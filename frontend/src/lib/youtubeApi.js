// Shared by the interactive video section and decorative hero backgrounds.
let apiPromise;

export function loadYouTubeAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    let script = document.getElementById("youtube-iframe-api");
    const isNew = !script;
    if (isNew) {
      script = document.createElement("script");
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
    }

    const cleanup = () => {
      window.clearTimeout(timeout);
      script.removeEventListener("error", fail);
      if (window.onYouTubeIframeAPIReady === ready) {
        window.onYouTubeIframeAPIReady = previousReady;
      }
    };
    const fail = () => {
      cleanup();
      script.remove();
      reject(new Error("YouTube player API is unavailable"));
    };
    const ready = () => {
      cleanup();
      try {
        if (typeof previousReady === "function") previousReady();
      } finally {
        resolve(window.YT);
      }
    };
    const timeout = window.setTimeout(fail, 20000);
    window.onYouTubeIframeAPIReady = ready;
    script.addEventListener("error", fail, { once: true });
    if (isNew) document.head.appendChild(script);
  }).catch((error) => {
    apiPromise = undefined; // A later visit may retry after a connection failure.
    throw error;
  });

  return apiPromise;
}
