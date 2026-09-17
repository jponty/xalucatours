import { createVoiceRecorder } from "./voiceDictation";

const API = `${(process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "")}/api/form-dictation/stream-token`;
const abortError = () => new DOMException("Cancelled", "AbortError");

/** Reuses PCM capture. Only short-lived credentials ever enter the browser. */
export async function createLiveVoiceRecorder({ signal, lang = "es", onTranscript, onLimit, onInterrupted }) {
  let microphone, socket, ready = false, stopping = false, ended = false;
  let startupTimer, finishTimer, resolveReady, rejectReady, resolveFinish, rejectFinish;
  const turns = new Map();
  let samples = [];
  let sampleCount = 0;
  const transcript = () => [...turns.entries()].sort(([a], [b]) => a - b).map(([, text]) => text).filter(Boolean).join(" ");
  const clean = () => {
    clearTimeout(startupTimer); clearTimeout(finishTimer);
    microphone?.cancel(); samples = []; sampleCount = 0;
    signal.removeEventListener("abort", cancel);
    if (socket) {
      socket.onmessage = null; socket.onerror = null; socket.onclose = null;
      if (socket.readyState === 1) socket.send(JSON.stringify({ type: "Terminate" }));
      socket.close();
    }
  };
  const fail = code => {
    if (ended) return;
    ended = true;
    const error = new Error(code);
    rejectReady?.(error); rejectFinish?.(error);
    clean();
    if (ready && !stopping) onInterrupted(code);
  };
  function cancel() {
    if (ended) return;
    ended = true;
    rejectReady?.(abortError()); rejectFinish?.(abortError()); clean();
  }
  const flush = final => {
    if (!sampleCount || !socket || socket.readyState !== 1) return;
    if (socket.bufferedAmount > microphone.sampleRate * 2 * 5) { fail("timeout"); return; }
    // Send approximately 100 ms, with >=50 ms padding for the final frame.
    const length = final ? Math.max(sampleCount, Math.ceil(microphone.sampleRate * 0.05)) : sampleCount;
    const buffer = new ArrayBuffer(length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    samples.forEach(chunk => chunk.forEach(value => { view.setInt16(offset, value, true); offset += 2; }));
    samples = []; sampleCount = 0;
    socket.send(buffer);
  };
  signal.addEventListener("abort", cancel, { once: true });
  try {
    if (signal.aborted || ended) throw abortError();
    // Start AudioContext synchronously with the click, including on iOS.
    microphone = await createVoiceRecorder({ signal, retainAudio: false, onLimit,
      onInterrupted: () => fail("microphone"),
      onSamples: chunk => {
        if (!ready || ended) return;
        samples.push(chunk); sampleCount += chunk.length;
        if (sampleCount >= microphone.sampleRate * 0.1) flush(false);
      },
    });
    if (signal.aborted || ended) throw abortError();
    const requestController = new AbortController();
    const abortRequest = () => requestController.abort();
    signal.addEventListener("abort", abortRequest, { once: true });
    const requestTimer = setTimeout(abortRequest, 12000);
    let data;
    try {
      const response = await fetch(API, { method: "POST", signal: requestController.signal, cache: "no-store" });
      data = await response.json().catch(() => ({}));
      if (!response.ok || typeof data.token !== "string") throw new Error(data.detail?.code || "unavailable");
    } finally { clearTimeout(requestTimer); signal.removeEventListener("abort", abortRequest); }
    if (signal.aborted || ended) throw abortError();
    const params = new URLSearchParams({ token: data.token, sample_rate: String(microphone.sampleRate),
      speech_model: "universal-3-5-pro", encoding: "pcm_s16le", language_codes: JSON.stringify([lang]),
      continuous_partials: "true", inactivity_timeout: "20" });
    socket = new WebSocket(`wss://streaming.eu.assemblyai.com/v3/ws?${params}`);
    const connected = new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
    socket.onmessage = event => {
      if (ended) return;
      let data;
      try { data = JSON.parse(event.data); } catch { fail("unavailable"); return; }
      if (data.type === "Begin") { ready = true; clearTimeout(startupTimer); resolveReady(); }
      if (data.type === "Turn" && Number.isInteger(data.turn_order) && typeof data.transcript === "string") {
        if (data.turn_order < 0 || data.turn_order > 1000 || data.transcript.length > 20000) { fail("unavailable"); return; }
        turns.set(data.turn_order, data.transcript);
        if (transcript().length > 20000) { fail("unavailable"); return; }
        onTranscript(transcript());
      }
      if (data.type === "Termination") {
        if (!stopping) { fail("timeout"); return; }
        ended = true; resolveFinish?.(transcript()); clean();
      }
      if (data.type === "Error" || data.error) fail("unavailable");
    };
    socket.onerror = () => fail("unavailable");
    socket.onclose = () => { if (!ended) fail("unavailable"); };
    startupTimer = setTimeout(() => fail("timeout"), 12000);
    await connected;
    return {
      cancel,
      stop: async () => {
        if (ended || stopping) return transcript();
        stopping = true;
        const completed = new Promise((resolve, reject) => { resolveFinish = resolve; rejectFinish = reject; });
        // Attach a handler immediately; a network error can arrive during flush.
        completed.catch(() => {});
        await microphone.stop();
        if (!ended) {
          flush(true);
          if (!ended) {
            socket.send(JSON.stringify({ type: "Terminate" }));
            finishTimer = setTimeout(() => fail("timeout"), 10000);
          }
        }
        return completed;
      },
    };
  } catch (error) {
    cancel();
    microphone?.cancel();
    throw error.name === "AbortError" && !signal.aborted ? new Error("timeout") : error;
  }
}
