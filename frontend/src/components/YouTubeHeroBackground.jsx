import React, { useEffect, useRef, useState } from "react";
import { loadYouTubeAPI } from "@/lib/youtubeApi";
import { preloadImageLink } from "@/lib/imageUrl";

// The poster stays underneath: loading, blocked autoplay and embed failures
// must never leave an empty hero. YouTube may still display its own branding;
// controls=0 is not a promise of a completely chrome-free video service.
export default function YouTubeHeroBackground({
  videoId,
  endSeconds,
  posterSrc,
  posterTestId = "hero-video-poster",
  children,
}) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const [playbackState, setPlaybackState] = useState("loading");
  const playing = playbackState === "playing";
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false,
  );

  useEffect(() => {
    if (!posterSrc) return undefined;
    return preloadImageLink(posterSrc, { width: 1280 });
  }, [posterSrc]);

  useEffect(() => {
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(preference.matches);
    preference?.addEventListener?.("change", onChange);
    return () => preference?.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    // An iframe has no object-fit. Size its 16:9 viewport to cover the actual
    // hero, including tall mobile layouts and orientation/font-size changes.
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      const videoWidth = Math.max(width, height * 16 / 9);
      stage.style.width = `${Math.ceil(videoWidth)}px`;
      stage.style.height = `${Math.ceil(videoWidth * 9 / 16)}px`;
    };
    resize();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    observer?.observe(container);
    window.addEventListener("resize", resize);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    setPlaybackState(reducedMotion ? "reduced-motion" : "loading");
    if (reducedMotion) return undefined;
    const stage = stageRef.current;
    const holder = document.createElement("div");
    stage.appendChild(holder);
    let cancelled = false;
    let failed = false;
    let player;

    const showPoster = (state) => {
      if (!cancelled) setPlaybackState(state);
    };
    const playClip = (target) => {
      target.mute();
      // Do not use seekTo or native playlist looping: either can lose the
      // segment boundary. Reapply 0–endSeconds on every single iteration.
      target.loadVideoById({ videoId, startSeconds: 0, endSeconds });
    };

    loadYouTubeAPI().then((YT) => {
      if (cancelled) return;
      player = new YT.Player(holder, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          rel: 0,
          iv_load_policy: 3,
          start: 0,
          end: endSeconds,
          origin: window.location.origin,
        },
        events: {
          onReady: ({ target }) => {
            if (!cancelled && !failed) {
              setPlaybackState("ready");
              playClip(target);
            }
          },
          onStateChange: ({ data, target }) => {
            if (cancelled || failed) return;
            if (data === YT.PlayerState.PLAYING) {
              target.mute();
              setPlaybackState("playing");
            } else if (data === YT.PlayerState.ENDED) {
              showPoster("restarting");
              playClip(target);
            } else if (data === YT.PlayerState.PAUSED) {
              showPoster("paused");
            }
          },
          onAutoplayBlocked: () => showPoster("autoplay-blocked"),
          onError: ({ data }) => {
            failed = true;
            showPoster(`error-${data}`);
          },
        },
      });
      // The video is decorative and cannot steal focus or capture clicks
      // from the hero's existing links and form selectors.
      const iframe = player.getIframe();
      iframe.setAttribute("title", "Xaluca Tours · Marruecos");
      iframe.setAttribute("tabindex", "-1");
      iframe.setAttribute("aria-hidden", "true");
      iframe.setAttribute("allow", "autoplay; encrypted-media");
      iframe.style.border = "0";
    }).catch(() => {
      failed = true;
      showPoster("unavailable");
    });

    return () => {
      cancelled = true;
      try {
        player?.destroy();
      } catch {
        // Navigation or the player itself may already have removed the iframe.
      } finally {
        stage.replaceChildren();
      }
    };
  }, [videoId, endSeconds, reducedMotion]);

  return (
    <div ref={containerRef} data-testid="youtube-hero-background" data-playing={playing && !reducedMotion} data-playback-state={playbackState}
      className="absolute inset-0 overflow-hidden bg-stone-950 pointer-events-none" aria-hidden="true">
      {posterSrc ? (
        <img
          data-testid={posterTestId}
          src={posterSrc}
          alt=""
          className="absolute inset-0 h-full w-full select-none object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      ) : null}
      {children}
      <div className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${playing && !reducedMotion ? "opacity-100" : "opacity-0"}`}>
        <div ref={stageRef} data-testid="youtube-hero-stage"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
