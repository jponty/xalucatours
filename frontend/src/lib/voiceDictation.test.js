import fs from "fs";
import path from "path";
import vm from "vm";
import { appendDictation, createVoiceRecorder, encodeWav, transcribeVoice } from "./voiceDictation";

const readBlob = blob => new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsArrayBuffer(blob); });

test("appends without replacing or duplicating whitespace", () => {
  expect(appendDictation("Anterior", "  Nuevo  ")).toBe("Anterior\nNuevo");
  expect(appendDictation("Nombre", "Apellidos", false)).toBe("Nombre Apellidos");
  expect(appendDictation("Anterior\n", "Nuevo")).toBe("Anterior\nNuevo");
  expect(appendDictation("Anterior", " ")).toBe("Anterior");
});

test("encodes mono PCM16 little-endian with a correct WAV header", async () => {
  const wav = encodeWav([new Int16Array([-32768, 32767]), new Int16Array([0])], 16000);
  const buffer = await readBlob(wav);
  const view = new DataView(buffer);
  expect(wav.type).toBe("audio/wav");
  expect(view.byteLength).toBe(50);
  expect(view.getUint32(4, true)).toBe(42);
  expect(view.getUint16(22, true)).toBe(1);
  expect(view.getUint32(24, true)).toBe(16000);
  expect(view.getUint16(34, true)).toBe(16);
  expect(view.getUint32(40, true)).toBe(6);
  expect(view.getInt16(44, true)).toBe(-32768);
  expect(view.getInt16(46, true)).toBe(32767);
});

describe("audio worklet", () => {
  let Processor, messages;
  beforeEach(() => {
    messages = [];
    vm.runInNewContext(fs.readFileSync(path.resolve(process.cwd(), "public/audio/voice-recorder.worklet.js"), "utf8"), {
      AudioWorkletProcessor: class { constructor() { this.port = { postMessage: message => messages.push(message) }; } },
      registerProcessor: (_name, processor) => { Processor = processor; },
      sampleRate: 8, Int16Array, Math,
    });
  });
  test("flushes samples on stop, clamps values, and does not echo audio", () => {
    const processor = new Processor();
    processor.process([[new Float32Array([-2, 1, 0])]]);
    processor.port.onmessage({ data: "stop" });
    expect(messages.map(message => message.type)).toEqual(["samples", "stopped"]);
    expect([...new Int16Array(messages[0].buffer)]).toEqual([-32768, 32767, 0]);
    expect(processor.process([])).toBe(false);
  });
  test("caps captured samples at exactly 120 seconds", () => {
    const processor = new Processor();
    processor.process([[new Float32Array(2000)]]);
    expect(messages.map(message => message.type)).toEqual(["samples", "limit"]);
    expect(new Int16Array(messages[0].buffer)).toHaveLength(8 * 120);
    processor.port.onmessage({ data: "stop" });
    expect(messages).toHaveLength(2);
  });
});

describe("microphone lifecycle", () => {
  let context, node, track, originalContext, originalNode, originalMedia;
  beforeEach(() => {
    originalContext = window.AudioContext; originalNode = window.AudioWorkletNode; originalMedia = navigator.mediaDevices;
    track = { stop: jest.fn(), onended: null };
    context = { sampleRate: 16000, state: "running", resume: jest.fn().mockResolvedValue(), close: jest.fn().mockResolvedValue(),
      audioWorklet: { addModule: jest.fn().mockResolvedValue() }, createMediaStreamSource: () => ({ connect() {}, disconnect() {} }) };
    node = { connect() {}, disconnect: jest.fn(), port: { postMessage: jest.fn() } };
    window.AudioContext = jest.fn(() => context); window.AudioWorkletNode = jest.fn(() => node);
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: {
      getUserMedia: jest.fn().mockResolvedValue({ getTracks: () => [track], getAudioTracks: () => [track] }),
    } });
  });
  afterEach(() => {
    window.AudioContext = originalContext; window.AudioWorkletNode = originalNode;
    Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: originalMedia });
  });
  test("abort stops the track, disconnects nodes, and closes the context", async () => {
    const controller = new AbortController();
    await createVoiceRecorder({ signal: controller.signal, onLimit: jest.fn(), onInterrupted: jest.fn() });
    controller.abort();
    expect(track.stop).toHaveBeenCalled();
    expect(context.close).toHaveBeenCalled();
    expect(node.disconnect).toHaveBeenCalled();
  });
  test("permission granted after cancellation is immediately released", async () => {
    let resolve;
    navigator.mediaDevices.getUserMedia.mockImplementation(() => new Promise(done => { resolve = done; }));
    const controller = new AbortController();
    const promise = createVoiceRecorder({ signal: controller.signal, onLimit: jest.fn(), onInterrupted: jest.fn() });
    controller.abort();
    resolve({ getTracks: () => [track] });
    await expect(promise).rejects.toMatchObject({ name: "AbortError" });
    expect(track.stop).toHaveBeenCalled();
  });
  test("stop flushes a WAV and releases the microphone before transcribing", async () => {
    const controller = new AbortController();
    const capture = await createVoiceRecorder({ signal: controller.signal, onLimit: jest.fn(), onInterrupted: jest.fn() });
    const promise = capture.stop();
    expect(track.stop).toHaveBeenCalled();
    node.port.onmessage({ data: { type: "samples", buffer: new Int16Array([1, 2, 3]).buffer } });
    node.port.onmessage({ data: { type: "stopped" } });
    expect((await promise).size).toBe(50);
    expect(context.close).toHaveBeenCalled();
  });
});

test("uploads only audio and language to our backend, never an API key", async () => {
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ text: "  Un viaje  " }) });
  try {
    const audio = encodeWav([new Int16Array(16000)], 16000);
    const controller = new AbortController();
    expect(await transcribeVoice(audio, "es", controller.signal)).toBe("Un viaje");
    const [url, request] = global.fetch.mock.calls[0];
    expect(url).toMatch(/\/api\/form-dictation\?language=es$/);
    expect(request.headers).toEqual({ "Content-Type": "audio/wav" });
    expect(request.body).toBe(audio);
    expect(request.signal).toBe(controller.signal);
  } finally { global.fetch = originalFetch; }
});
