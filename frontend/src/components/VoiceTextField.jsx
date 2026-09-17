import React, { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { Mic, Square, X, Loader2 } from "lucide-react";
import { appendDictation, createVoiceRecorder, dictationAvailable, supportsDictation, transcribeVoice } from "@/lib/voiceDictation";

const Scope = createContext(null);
export function VoiceDictationProvider({ children, onBusyChange }) {
  const [activeId, setActiveId] = useState(null);
  const select = useCallback((id) => { setActiveId(id); onBusyChange(Boolean(id)); }, [onBusyChange]);
  return <Scope.Provider value={{ activeId, select }}>{children}</Scope.Provider>;
}

const COPY = {
  es: {
    dictate: "Dictar", stop: "Detener y transcribir", cancel: "Cancelar", loading: "Preparando micrófono…",
    transcribing: "Transcribiendo…", recording: "Grabando", ready: "Texto añadido. Revísalo antes de enviar.",
    notice: "Hasta 2 min. Al detener, el audio se envía para transcribirlo. Revisa el texto antes de enviar.",
    unsupported: "Este navegador no permite dictado. Puedes escribir el texto normalmente.",
    permission: "Permite el acceso al micrófono en tu navegador o escribe el mensaje.",
    microphone: "No se puede utilizar el micrófono. Comprueba que esté conectado y disponible.",
    unavailable: "El dictado no está disponible ahora. Puedes escribir normalmente e intentarlo más tarde.",
    timeout: "La transcripción ha tardado demasiado. Tu texto anterior sigue intacto; inténtalo de nuevo.",
    rate_limit: "Has alcanzado el límite temporal de dictado. Puedes continuar escribiendo.",
    busy: "El servicio está ocupado. Inténtalo de nuevo en unos instantes.",
    no_speech: "No se ha detectado voz. Prueba otra grabación o escribe tu mensaje.",
    bad_audio: "No hemos podido leer la grabación. Inténtalo de nuevo.",
    audio_duration: "Graba un mensaje de hasta 2 minutos; la grabación debe contener voz.",
    audio_too_large: "La grabación supera el tamaño permitido. Prueba un mensaje más corto.",
    overflow: "La transcripción no cabe completa. Acórtala aquí antes de añadirla; no se ha borrado ningún texto.",
    transcript: "Transcripción para revisar", insert: "Añadir al campo", cancelled: "Dictado cancelado. Tu texto no ha cambiado.",
  },
  en: {
    dictate: "Dictate", stop: "Stop and transcribe", cancel: "Cancel", loading: "Preparing microphone…",
    transcribing: "Transcribing…", recording: "Recording", ready: "Text added. Please review before sending.",
    notice: "Up to 2 min. When you stop, your audio is sent for transcription. Review the text before sending.",
    unsupported: "Dictation is not supported in this browser. You can still type normally.",
    permission: "Allow microphone access in your browser, or type your message.",
    microphone: "Microphone unavailable. Check that it is connected and not in use.",
    unavailable: "Dictation is unavailable right now. You can type normally or try again later.",
    timeout: "Transcription took too long. Your existing text is unchanged; please try again.",
    rate_limit: "The temporary dictation limit has been reached. You can continue typing.",
    busy: "The service is busy. Please try again shortly.",
    no_speech: "No speech detected. Try another recording or type your message.",
    bad_audio: "We could not read the recording. Please try again.",
    audio_duration: "Record a voice message up to 2 minutes long.",
    audio_too_large: "The recording is too large. Try a shorter message.",
    overflow: "The full transcript does not fit. Shorten it here before adding it; no text has been deleted.",
    transcript: "Transcript to review", insert: "Add to field", cancelled: "Dictation cancelled. Your text is unchanged.",
  },
  fr: {
    dictate: "Dicter", stop: "Arrêter et transcrire", cancel: "Annuler", loading: "Préparation du microphone…",
    transcribing: "Transcription…", recording: "Enregistrement", ready: "Texte ajouté. Relisez-le avant l’envoi.",
    notice: "2 min maximum. À l’arrêt, l’audio est envoyé pour transcription. Relisez le texte avant l’envoi.",
    unsupported: "La dictée n’est pas disponible dans ce navigateur. Vous pouvez écrire normalement.",
    permission: "Autorisez le microphone dans votre navigateur ou écrivez votre message.",
    microphone: "Microphone indisponible. Vérifiez qu’il est connecté et disponible.",
    unavailable: "La dictée est indisponible pour le moment. Vous pouvez écrire ou réessayer plus tard.",
    timeout: "La transcription a pris trop de temps. Votre texte est conservé ; réessayez.",
    rate_limit: "La limite temporaire de dictée est atteinte. Vous pouvez continuer à écrire.",
    busy: "Le service est occupé. Réessayez dans quelques instants.",
    no_speech: "Aucune voix détectée. Réessayez ou écrivez votre message.",
    bad_audio: "Impossible de lire l’enregistrement. Veuillez réessayer.",
    audio_duration: "Enregistrez un message vocal de 2 minutes maximum.",
    audio_too_large: "L’enregistrement est trop volumineux. Essayez un message plus court.",
    overflow: "La transcription est trop longue. Raccourcissez-la ici avant de l’ajouter ; aucun texte n’a été effacé.",
    transcript: "Transcription à relire", insert: "Ajouter au champ", cancelled: "Dictée annulée. Votre texte est conservé.",
  },
};

/** Shared controlled field; voice is optional and never submits the form. */
export default function VoiceTextField({ as: Input = "input", value, onValueChange, lang = "es", tone = "light", disabled = false, ...inputProps }) {
  const id = useId();
  const { activeId, select } = useContext(Scope);
  const [available, setAvailable] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState("");
  const [seconds, setSeconds] = useState(0);
  const job = useRef(null);
  const recorder = useRef(null);
  const latest = useRef({ value, onValueChange, select });
  latest.current = { value, onValueChange, select };
  const copy = COPY[lang] || COPY.es;
  const multiline = Input === "textarea";
  const busy = ["starting", "recording", "transcribing"].includes(phase);
  const otherBusy = Boolean(activeId && activeId !== id);
  const hintId = `${id}-voice-hint`;
  const statusId = `${id}-voice-status`;
  const textTone = tone === "dark" ? "text-[#FDFBF7]/70" : "text-[#5C5248]";
  const buttonCls = `inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-sm border px-3 py-2 text-xs leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C16542] disabled:cursor-not-allowed disabled:opacity-50 ${tone === "dark" ? "border-[#D4A373]/50 text-[#FDFBF7] hover:bg-[#C16542]/25" : "border-[#A35133]/40 text-[#843F28] hover:bg-[#C16542]/10"}`;

  useEffect(() => {
    if (!supportsDictation()) { setAvailable(false); return; }
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    dictationAvailable(controller.signal).then(result => { if (active) setAvailable(result); })
      .catch(() => { if (active) setAvailable(false); }).finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, []);

  useEffect(() => () => {
    if (job.current) {
      job.current.abort();
      recorder.current?.cancel();
      job.current = null;
      recorder.current = null;
      latest.current.select(null);
    }
  }, []);

  useEffect(() => {
    if (phase !== "recording") return;
    const started = Date.now();
    const timer = setInterval(() => setSeconds(Math.min(120, Math.floor((Date.now() - started) / 1000))), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const release = (controller) => {
    if (job.current !== controller) return;
    job.current = null;
    recorder.current = null;
    select(null);
    setPhase("idle");
  };
  const cancel = () => {
    const controller = job.current;
    controller?.abort();
    recorder.current?.cancel();
    release(controller);
    setPending("");
    setMessage("cancelled");
  };
  const insert = (text) => {
    const merged = appendDictation(latest.current.value, text, multiline);
    if (inputProps.maxLength && merged.length > inputProps.maxLength) {
      setPending(text); setMessage("overflow"); return;
    }
    latest.current.onValueChange(merged);
    setPending(""); setMessage("ready");
  };
  const stop = async () => {
    const controller = job.current;
    const current = recorder.current;
    if (!controller || !current || current.stopping) return;
    current.stopping = true;
    setPhase("transcribing");
    let timeout;
    try {
      const blob = await current.stop();
      if (controller.signal.aborted) return;
      timeout = setTimeout(() => controller.abort("timeout"), 90000);
      const transcript = await transcribeVoice(blob, lang, controller.signal);
      if (!controller.signal.aborted && job.current === controller) insert(transcript);
    } catch (error) {
      if (job.current === controller) setMessage(controller.signal.reason === "timeout" ? "timeout" : error.message in copy ? error.message : "unavailable");
    } finally { clearTimeout(timeout); release(controller); }
  };
  const stopRef = useRef(stop);
  stopRef.current = stop;

  const start = async () => {
    if (busy || otherBusy || disabled || job.current) return;
    setMessage("");
    if (!supportsDictation()) { setMessage("unsupported"); return; }
    if (available !== true) { setMessage("unavailable"); return; }
    const controller = new AbortController();
    job.current = controller;
    select(id); setPhase("starting"); setSeconds(0); setPending("");
    try {
      const captured = await createVoiceRecorder({
        signal: controller.signal, onLimit: () => stopRef.current(),
        onInterrupted: () => { if (job.current === controller) { release(controller); setMessage("microphone"); } },
      });
      if (controller.signal.aborted || job.current !== controller) { captured.cancel(); return; }
      recorder.current = captured;
      setPhase("recording");
    } catch (error) {
      if (job.current !== controller) return;
      if (error.name !== "AbortError") setMessage(["NotAllowedError", "SecurityError"].includes(error.name) ? "permission" : "microphone");
      release(controller);
    }
  };

  return <div className="min-w-0" data-testid={`${inputProps["data-testid"] || inputProps.id}-voice`}>
    <Input {...inputProps} value={value} onChange={event => onValueChange(event.target.value)} disabled={disabled}
      aria-describedby={[inputProps["aria-describedby"], hintId, statusId].filter(Boolean).join(" ")} />
    <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
      <p id={hintId} className={`min-w-0 flex-[1_1_12rem] text-[11px] leading-relaxed ${textTone}`}>{copy.notice}</p>
      <div className="flex max-w-full flex-wrap gap-2">
        {phase === "recording" ? <button type="button" className={buttonCls} onClick={stop} aria-controls={inputProps.id}>
          <Square className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{copy.stop}
        </button> : !busy && <button type="button" className={buttonCls} onClick={start} disabled={disabled || otherBusy || available === null}
          aria-label={`${copy.dictate} · ${inputProps["aria-label"] || inputProps.name || inputProps.id}`} aria-controls={inputProps.id}>
          <Mic className="h-4 w-4 shrink-0" aria-hidden="true" />{copy.dictate}
        </button>}
        {busy && <button type="button" className={buttonCls} onClick={cancel}><X className="h-4 w-4 shrink-0" aria-hidden="true" />{copy.cancel}</button>}
      </div>
    </div>
    <p id={statusId} role="status" aria-live="polite" className={`mt-1 flex items-center gap-2 text-xs leading-relaxed ${textTone}`}>
      {(phase === "starting" || phase === "transcribing") && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
      {phase === "starting" ? copy.loading : phase === "transcribing" ? copy.transcribing : phase === "recording" ? copy.recording : copy[message] || ""}
      {phase === "recording" && <span aria-live="off" className="tabular-nums">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")} / 2:00</span>}
    </p>
    {pending && <div className="mt-3 space-y-2">
      <textarea aria-label={copy.transcript} value={pending} onChange={event => setPending(event.target.value)} rows={4}
        className={`w-full border bg-transparent p-3 text-sm ${textTone}`} />
      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonCls} onClick={() => insert(pending)}
          disabled={Boolean(inputProps.maxLength && appendDictation(value, pending, multiline).length > inputProps.maxLength)}>{copy.insert}</button>
        <button type="button" className={buttonCls} onClick={() => { setPending(""); setMessage("cancelled"); }}>{copy.cancel}</button>
      </div>
    </div>}
  </div>;
}
