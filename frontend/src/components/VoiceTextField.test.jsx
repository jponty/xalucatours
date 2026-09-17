import React, { act, useState } from "react";
import { createRoot } from "react-dom/client";
import VoiceTextField, { VoiceDictationProvider } from "./VoiceTextField";
import { createVoiceRecorder, dictationAvailable, supportsDictation, transcribeVoice } from "@/lib/voiceDictation";

jest.mock("@/lib/voiceDictation", () => ({
  ...jest.requireActual("@/lib/voiceDictation"),
  createVoiceRecorder: jest.fn(), dictationAvailable: jest.fn(), supportsDictation: jest.fn(), transcribeVoice: jest.fn(),
}));

let container, root, recording, submitted;
function Harness({ maxLength, lang = "es", initial = "Ya escrito", second = false }) {
  const [value, setValue] = useState(initial);
  const [busy, setBusy] = useState(false);
  return <VoiceDictationProvider onBusyChange={setBusy}><form onSubmit={event => { event.preventDefault(); submitted(value); }}>
    <label htmlFor="notes">Notas</label>
    <VoiceTextField as="textarea" id="notes" aria-label="Notas" data-testid="notes" maxLength={maxLength}
      value={value} onValueChange={setValue} lang={lang} />
    {second && <VoiceTextField id="name" value="" onValueChange={() => {}} lang={lang} />}
    <button type="submit" disabled={busy}>Enviar</button>
  </form></VoiceDictationProvider>;
}
const buttons = () => [...container.querySelectorAll("button")];
const button = (label) => buttons().find(el => el.textContent === label);
const click = async (label) => { await act(async () => button(label).click()); };
const render = async (props) => { await act(async () => root.render(<Harness {...props} />)); };
const change = async (selector, text) => {
  await act(async () => {
    const input = container.querySelector(selector);
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set.call(input, text);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  global.IS_REACT_ACT_ENVIRONMENT = true;
  supportsDictation.mockReturnValue(true);
  dictationAvailable.mockResolvedValue(true);
  recording = { stop: jest.fn().mockResolvedValue(new Blob(["audio"])), cancel: jest.fn() };
  createVoiceRecorder.mockResolvedValue(recording);
  transcribeVoice.mockResolvedValue("Quiero descubrir el Atlas.");
  submitted = jest.fn();
  container = document.createElement("div"); document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); delete global.IS_REACT_ACT_ENVIRONMENT; });

test("records, appends to the latest edited text, then submits the ordinary field", async () => {
  await render();
  await click("Dictar");
  expect(button("Enviar").disabled).toBe(true);
  expect(transcribeVoice).not.toHaveBeenCalled();
  await change("#notes", "Editado durante la grabación");
  await click("Detener y transcribir");
  expect(container.querySelector("#notes").value).toBe("Editado durante la grabación\nQuiero descubrir el Atlas.");
  expect(button("Enviar").disabled).toBe(false);
  expect(submitted).not.toHaveBeenCalled();
  await click("Enviar");
  expect(submitted).toHaveBeenCalledWith("Editado durante la grabación\nQuiero descubrir el Atlas.");
});

test("cancelled recordings are never transcribed, and other fields are locked only while busy", async () => {
  await render({ second: true });
  await click("Dictar");
  expect(button("Dictar").disabled).toBe(true);
  await click("Cancelar");
  expect(recording.cancel).toHaveBeenCalled();
  expect(transcribeVoice).not.toHaveBeenCalled();
  expect(button("Enviar").disabled).toBe(false);
  expect(container.querySelector("#notes").value).toBe("Ya escrito");
});

test("cancelling a pending permission request stops a late recorder", async () => {
  let resolve;
  createVoiceRecorder.mockImplementation(() => new Promise(done => { resolve = done; }));
  await render(); await click("Dictar"); await click("Cancelar");
  await act(async () => resolve(recording));
  expect(recording.cancel).toHaveBeenCalled();
  expect(button("Enviar").disabled).toBe(false);
  expect(transcribeVoice).not.toHaveBeenCalled();
});

test("late transcription after cancel cannot overwrite text or submit", async () => {
  let resolve;
  transcribeVoice.mockImplementation(() => new Promise(done => { resolve = done; }));
  await render(); await click("Dictar"); await click("Detener y transcribir");
  await click("Cancelar"); await act(async () => resolve("Late text"));
  expect(container.querySelector("#notes").value).toBe("Ya escrito");
  expect(submitted).not.toHaveBeenCalled();
});

test("automatically stops at two minutes and avoids duplicate transcriptions", async () => {
  await render(); await click("Dictar");
  const { onLimit } = createVoiceRecorder.mock.calls[0][0];
  await act(async () => { onLimit(); onLimit(); });
  expect(recording.stop).toHaveBeenCalledTimes(1);
  expect(transcribeVoice).toHaveBeenCalledTimes(1);
});

test("unmount releases microphone and aborts the job", async () => {
  await render(); await click("Dictar");
  const { signal } = createVoiceRecorder.mock.calls[0][0];
  await act(async () => root.render(null));
  expect(signal.aborted).toBe(true);
  expect(recording.cancel).toHaveBeenCalled();
});

test.each(["NotAllowedError", "NotFoundError"])("%s preserves manual writing", async name => {
  createVoiceRecorder.mockRejectedValue(Object.assign(new Error("mic"), { name }));
  await render(); await click("Dictar");
  expect(container.querySelector("#notes").disabled).toBe(false);
  expect(button("Enviar").disabled).toBe(false);
  expect(container.textContent).toMatch(/micrófono/);
});

test.each(["unavailable", "timeout", "rate_limit", "no_speech", "bad_audio"])("handles %s without deleting existing text", async code => {
  transcribeVoice.mockRejectedValue(new Error(code));
  await render(); await click("Dictar"); await click("Detener y transcribir");
  expect(container.querySelector("#notes").value).toBe("Ya escrito");
  expect(container.querySelector('[role="status"]').textContent.length).toBeGreaterThan(10);
  expect(button("Enviar").disabled).toBe(false);
});

test("unconfigured service never requests the microphone", async () => {
  dictationAvailable.mockResolvedValue(false);
  await render(); await click("Dictar");
  expect(createVoiceRecorder).not.toHaveBeenCalled();
  expect(container.textContent).toContain("El dictado no está disponible");
  expect(button("Enviar").disabled).toBe(false);
});

test("unsupported browsers keep a usable field", async () => {
  supportsDictation.mockReturnValue(false);
  await render(); await click("Dictar");
  expect(dictationAvailable).not.toHaveBeenCalled();
  expect(container.textContent).toContain("Este navegador no permite dictado");
});

test("never silently truncates long text; the full transcript can be edited before adding", async () => {
  await render({ maxLength: 20 }); await click("Dictar"); await click("Detener y transcribir");
  expect(container.querySelector("#notes").value).toBe("Ya escrito");
  expect(container.querySelector('[aria-label="Transcripción para revisar"]').value).toBe("Quiero descubrir el Atlas.");
  expect(button("Añadir al campo").disabled).toBe(true);
  await change('[aria-label="Transcripción para revisar"]', "Atlas");
  await click("Añadir al campo");
  expect(container.querySelector("#notes").value).toBe("Ya escrito\nAtlas");
});

test.each([["es", "Dictar"], ["en", "Dictate"], ["fr", "Dicter"]])("localized accessible controls in %s", async (lang, label) => {
  await render({ lang });
  expect(button(label).getAttribute("type")).toBe("button");
  expect(button(label).getAttribute("aria-controls")).toBe("notes");
  expect(container.querySelector("label button")).toBeNull();
  expect(container.querySelector("#notes").getAttribute("aria-describedby")).toBeTruthy();
  expect(container.innerHTML).not.toMatch(/assemblyai/i);
});
