const API = `${(process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "")}/api/assistant`;

async function request(path, { signal, token, body } = {}) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener("abort", abort, { once: true });
  const timeout = setTimeout(abort, 30000);
  try {
    const response = await fetch(`${API}${path}`, {
      method: body ? "POST" : "GET", cache: "no-store", signal: controller.signal,
      headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) {
      const error = new Error("assistant_request_failed");
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}

export const assistantAvailable = signal => request("/status", { signal }).then(data => data.available === true);
export const identifyForAssistant = (body, signal) => request("/session", { body, signal });
export const loadAssistantGuide = (token, selection, signal) => request("/guide", { token, body: selection, signal });

// Only allow same-site public pages, even if an API response is malformed.
export const safeAssistantSourcePath = path => typeof path === "string"
  && /^\/(?!\/)[a-zA-Z0-9_/-]*(?:#[a-zA-Z0-9_-]+)?$/.test(path)
  && !/^\/(?:(?:en|fr)\/)?(?:api|admin)(?:\/|#|$)/i.test(path) ? path : null;
