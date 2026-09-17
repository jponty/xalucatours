export const MAX_DICTATION_SECONDS = 120;
const API = `${(process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "")}/api/form-dictation`;

export const appendDictation = (current, transcript, multiline = true) => {
  const added = String(transcript || "").trim();
  if (!added) return current;
  return current ? `${current}${/\s$/.test(current) ? "" : multiline ? "\n" : " "}${added}` : added;
};

export function encodeWav(chunks, sampleRate) {
  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const buffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(buffer);
  const label = (offset, value) => [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
  label(0, "RIFF"); view.setUint32(4, 36 + length * 2, true); label(8, "WAVE");
  label(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
  view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  label(36, "data"); view.setUint32(40, length * 2, true);
  let offset = 44;
  chunks.forEach(chunk => chunk.forEach(sample => { view.setInt16(offset, sample, true); offset += 2; }));
  return new Blob([buffer], { type: "audio/wav" });
}

export function supportsDictation() {
  return Boolean(window.isSecureContext && navigator.mediaDevices?.getUserMedia
    && (window.AudioContext || window.webkitAudioContext) && window.AudioWorkletNode);
}

const abortError = () => new DOMException("Cancelled", "AbortError");

export async function createVoiceRecorder({ signal, onLimit, onInterrupted, onSamples, retainAudio = true }) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext({ sampleRate: 16000 });
  let stream, source, node, timer, resolveStop, stopTimer;
  let finished = false;
  let cancelled = false;
  let chunks = [];
  const clean = () => {
    clearTimeout(timer);
    clearTimeout(stopTimer);
    stream?.getTracks().forEach(track => { track.onended = null; track.stop(); });
    source?.disconnect();
    node?.disconnect();
    if (node) node.port.onmessage = null;
    if (context.state !== "closed") context.close().catch(() => {});
  };
  const cancel = () => {
    cancelled = true;
    finished = true;
    chunks = [];
    clean();
    signal.removeEventListener("abort", cancel);
    resolveStop?.(null);
  };
  signal.addEventListener("abort", cancel, { once: true });
  try {
    if (signal.aborted) throw abortError();
    // Resume in the click's activation turn, before waiting for permission.
    const resumed = context.resume().then(() => null, error => error);
    stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true }, video: false });
    if (signal.aborted) throw abortError();
    const resumeError = await resumed;
    if (resumeError) throw resumeError;
    if (signal.aborted) throw abortError();
    await context.audioWorklet.addModule(`${process.env.PUBLIC_URL || ""}/audio/voice-recorder.worklet.js`);
    if (signal.aborted) throw abortError();
    node = new window.AudioWorkletNode(context, "xaluca-voice-recorder", { channelCount: 1, channelCountMode: "explicit" });
    source = context.createMediaStreamSource(stream);
    source.connect(node);
    node.connect(context.destination); // processor's output is always silence
    node.port.onmessage = ({ data }) => {
      if (cancelled) return;
      if (data.type === "samples") {
        const samples = new Int16Array(data.buffer);
        if (retainAudio) chunks.push(samples);
        onSamples?.(samples);
      }
      if (data.type === "stopped" || data.type === "limit") {
        finished = true;
        clean();
        resolveStop?.(encodeWav(chunks, context.sampleRate));
        if (data.type === "limit") onLimit();
      }
    };
    stream.getAudioTracks().forEach(track => { track.onended = () => { cancel(); onInterrupted(); }; });
    // Wall-clock guard covers background tabs / suspended audio contexts too.
    timer = setTimeout(onLimit, MAX_DICTATION_SECONDS * 1000);
    return {
      sampleRate: context.sampleRate,
      cancel,
      stop: () => {
        signal.removeEventListener("abort", cancel);
        if (cancelled) return Promise.resolve(null);
        if (finished) {
          const blob = encodeWav(chunks, context.sampleRate);
          chunks = [];
          return Promise.resolve(blob);
        }
        return new Promise(resolve => {
          resolveStop = blob => { chunks = []; resolve(blob); };
          node.port.postMessage("stop");
          // Worklet may have been suspended by the OS. Preserve received samples.
          stopTimer = setTimeout(() => { finished = true; clean(); resolveStop(encodeWav(chunks, context.sampleRate)); }, 500);
          stream.getTracks().forEach(track => { track.onended = null; track.stop(); });
        });
      },
    };
  } catch (error) {
    cancel();
    throw error;
  }
}

export async function dictationAvailable(signal) {
  const response = await fetch(`${API}/status`, { signal, cache: "no-store" });
  if (!response.ok) return false;
  return (await response.json()).available === true;
}

export async function transcribeVoice(blob, lang, signal) {
  if (!blob || blob.size <= 44) throw new Error("audio_duration");
  const response = await fetch(`${API}?language=${encodeURIComponent(lang)}`, {
    method: "POST", headers: { "Content-Type": "audio/wav" }, body: blob, signal, cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail?.code || "unavailable");
  if (typeof data.text !== "string" || !data.text.trim()) throw new Error("no_speech");
  return data.text.trim();
}
