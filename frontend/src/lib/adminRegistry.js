import { useEffect } from "react";
import { ADMIN_SESSION_EVENT, getAdminToken } from "./adminSession";

const API = process.env.REACT_APP_BACKEND_URL || "";
const registries = new Map();

// Registries are CMS indexes, not visitor analytics. Public browsing must never
// write them. The backend independently verifies the signed admin token.
export function queueAdminRegistry(kind, key, entry) {
  if (!getAdminToken() || !key) return;
  if (!registries.has(kind)) {
    registries.set(kind, { known: new Set(), queue: new Map(), timer: null });
  }
  const registry = registries.get(kind);
  const fingerprint = JSON.stringify([key, entry]);
  if (registry.known.has(fingerprint)) return;
  registry.known.add(fingerprint);
  registry.queue.set(key, { entry, fingerprint });
  if (registry.timer) return;
  registry.timer = setTimeout(async () => {
    registry.timer = null;
    const batch = [...registry.queue.values()];
    registry.queue.clear();
    const token = getAdminToken();
    if (!token) {
      batch.forEach(({ fingerprint: id }) => registry.known.delete(id));
      return;
    }
    // Bound request size even when an admin opens a large gallery.
    for (let start = 0; start < batch.length; start += 100) {
      const chunk = batch.slice(start, start + 100);
      try {
        const values = chunk.map(({ entry: value }) => value);
        const response = await fetch(`${API}/api/${kind}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(kind === "image_urls" ? { urls: values } : { slots: values }),
        });
        if (!response.ok) throw new Error("registry-failed");
      } catch {
        // Retry on the next admin visit, never in an automatic retry loop.
        chunk.forEach(({ fingerprint: id }) => registry.known.delete(id));
      }
    }
  }, 1500);
}

export function useAdminRegistryEntry(kind, key, entry) {
  const serialized = JSON.stringify(entry);
  useEffect(() => {
    const register = () => queueAdminRegistry(kind, key, JSON.parse(serialized));
    register();
    window.addEventListener(ADMIN_SESSION_EVENT, register);
    return () => window.removeEventListener(ADMIN_SESSION_EVENT, register);
  }, [kind, key, serialized]);
}
