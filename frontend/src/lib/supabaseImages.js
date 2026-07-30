const API = process.env.REACT_APP_BACKEND_URL || "";
const LIVE_MANIFEST_URL = `${API}/api/content-manifest`;
const BUILD_MANIFEST_URL = "/supabase-images.json";

let manifestPromise;

export const loadSupabaseImages = () => {
  if (!manifestPromise) {
    manifestPromise = fetch(LIVE_MANIFEST_URL, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Live Supabase manifest failed: ${response.status}`);
        return response.json();
      })
      .catch(() =>
        fetch(BUILD_MANIFEST_URL, { cache: "no-cache" }).then((response) => {
          if (!response.ok) {
            throw new Error(`Supabase build manifest failed: ${response.status}`);
          }
          return response.json();
        })
      );
  }
  return manifestPromise;
};
