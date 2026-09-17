import { createLiveVoiceRecorder } from "./liveVoiceDictation";
import { createVoiceRecorder } from "./voiceDictation";
jest.mock("./voiceDictation", () => ({ createVoiceRecorder: jest.fn() }));

let socket, capture, mic, controller, onTranscript, onInterrupted;
const originalSocket = global.WebSocket;
const originalFetch = global.fetch;
const tick = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
const message = data => socket.onmessage?.({ data: JSON.stringify(data) });
const start = () => createLiveVoiceRecorder({ signal: controller.signal, lang: "es", onTranscript, onInterrupted, onLimit: jest.fn() });
const begin = async () => { const promise = start(); await tick(); message({ type: "Begin" }); return promise; };
beforeEach(() => {
  jest.useFakeTimers();
  controller = new AbortController(); onTranscript = jest.fn(); onInterrupted = jest.fn();
  mic = { sampleRate: 16000, cancel: jest.fn(), stop: jest.fn().mockResolvedValue(null) };
  createVoiceRecorder.mockImplementation(async options => { capture = options; return mic; });
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ token: "temporary-token" }) });
  global.WebSocket = jest.fn(function (url) {
    socket = this; this.url = url; this.readyState = 1; this.bufferedAmount = 0;
    this.send = jest.fn(); this.close = jest.fn();
  });
});
afterEach(() => { controller.abort(); jest.useRealTimers(); global.WebSocket = originalSocket; global.fetch = originalFetch; });

test("uses a bounded token and EU connection; only sends PCM after Begin", async () => {
  const promise = start(); await tick();
  capture.onSamples(new Int16Array(2048));
  expect(socket.send).not.toHaveBeenCalled();
  message({ type: "Begin" }); const session = await promise;
  expect(socket.url).toContain("wss://streaming.eu.assemblyai.com/v3/ws?");
  const params = new URL(socket.url).searchParams;
  expect(params.get("token")).toBe("temporary-token");
  expect(params.get("language_codes")).toBe('["es"]');
  expect(capture.retainAudio).toBe(false);
  capture.onSamples(new Int16Array([1, ...new Array(2047).fill(0)]));
  expect(socket.send.mock.calls[0][0].byteLength).toBe(4096);
  expect(new DataView(socket.send.mock.calls[0][0]).getInt16(0, true)).toBe(1);
  session.cancel(); expect(mic.cancel).toHaveBeenCalled(); expect(socket.close).toHaveBeenCalled();
});

test("replaces revised turns and waits for the final transcript on stop", async () => {
  const session = await begin();
  message({ type: "Turn", turn_order: 0, transcript: "Quiero" });
  message({ type: "Turn", turn_order: 0, transcript: "Quiero visitar el Atlas." });
  message({ type: "Turn", turn_order: 1, transcript: "Somos dos." });
  expect(onTranscript).toHaveBeenLastCalledWith("Quiero visitar el Atlas. Somos dos.");
  const completed = session.stop(); await tick();
  expect(socket.send).toHaveBeenCalledWith(JSON.stringify({ type: "Terminate" }));
  message({ type: "Turn", turn_order: 1, transcript: "Somos tres." }); message({ type: "Termination" });
  await expect(completed).resolves.toBe("Quiero visitar el Atlas. Somos tres.");
  expect(mic.cancel).toHaveBeenCalled();
});

test("aborts microphone and connection when switching tabs", async () => {
  await begin(); controller.abort();
  expect(mic.cancel).toHaveBeenCalled(); expect(socket.close).toHaveBeenCalled();
  expect(socket.onmessage).toBeNull();
});

test("disconnections surface a safe error and close the microphone", async () => {
  await begin(); socket.onclose();
  expect(onInterrupted).toHaveBeenCalledWith("unavailable");
  expect(mic.cancel).toHaveBeenCalled();
});

test("refuses an unavailable token without leaving the microphone open", async () => {
  fetch.mockResolvedValue({ ok: false, json: async () => ({ detail: { code: "rate_limit" } }) });
  await expect(start()).rejects.toThrow("rate_limit");
  expect(mic.cancel).toHaveBeenCalled();
});

test("startup and stop have bounded timeouts", async () => {
  const pending = start(); const rejected = expect(pending).rejects.toThrow("timeout");
  await tick(); jest.advanceTimersByTime(12000); await rejected;
  expect(mic.cancel).toHaveBeenCalled();
  const session = await begin(); const finished = session.stop();
  const stopped = expect(finished).rejects.toThrow("timeout");
  await tick(); jest.advanceTimersByTime(10000); await stopped;
});
