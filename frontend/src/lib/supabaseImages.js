const MANIFEST_URL = "/supabase-images.json";

let manifestPromise;

export const loadSupabaseImages = () => {
  if (!manifestPromise) {
    manifestPromise = fetch(MANIFEST_URL, { cache: "no-cache" }).then((response) => {
      if (!response.ok) {
        throw new Error(`Supabase image manifest failed: ${response.status}`);
      }
      return response.json();
    });
  }
  return manifestPromise;
};

