import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Check, Copy, ExternalLink, Heart, Loader2, MessageSquareText, Mic, Pause,
  RotateCcw, Send, ShieldCheck, Sparkles, Star,
} from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";

const API = process.env.REACT_APP_BACKEND_URL || "";
const MAX_RECORDING_SECONDS = 180;
const GOOGLE_REVIEWS_URL = "https://g.page/r/CUMF_8B7DWiXEBM/review";

const COPY = {
  eyebrow: { es: "Tu experiencia importa", en: "Your experience matters", fr: "Votre expérience compte" },
  title: { es: "Ayúdanos a viajar mejor contigo.", en: "Help us travel better with you.", fr: "Aidez-nous à mieux voyager avec vous." },
  intro: {
    es: "Cuéntanos qué funcionó, qué podríamos mejorar o qué recuerdo te llevas de Marruecos. Puedes escribirlo o explicárnoslo con tu propia voz.",
    en: "Tell us what worked, what we could improve, or which Morocco memory stayed with you. Write it down or tell us in your own voice.",
    fr: "Dites-nous ce qui a fonctionné, ce que nous pouvons améliorer ou quel souvenir du Maroc vous accompagne. Écrivez-le ou racontez-le avec votre voix.",
  },
  starsTitle: {
    es: "Tus 5 estrellas nos dan fuerzas para seguir creciendo y mejorando cada día.",
    en: "Your 5 stars inspire us to keep growing and improving every day.",
    fr: "Vos 5 étoiles nous donnent la force de continuer à grandir et à nous améliorer chaque jour.",
  },
  starsBody: {
    es: "Valoramos enormemente todos los comentarios que recibimos, tanto las experiencias positivas como el feedback constructivo. Cada opinión nos ayuda a ofrecer una mejor experiencia a nuestros viajeros y huéspedes.",
    en: "We deeply value every comment we receive, from positive experiences to constructive feedback. Each review helps us offer an even better experience to our travellers and guests.",
    fr: "Nous accordons une grande importance à chaque commentaire reçu, qu'il s'agisse d'une expérience positive ou d'un avis constructif. Chaque opinion nous aide à offrir une meilleure expérience à nos voyageurs et à nos hôtes.",
  },
  textTab: { es: "Escribir comentario", en: "Write feedback", fr: "Écrire un commentaire" },
  voiceTab: { es: "Grabar mi voz", en: "Record my voice", fr: "Enregistrer ma voix" },
  textLabel: { es: "Tu comentario", en: "Your feedback", fr: "Votre commentaire" },
  textPlaceholder: {
    es: "Cuéntanos tu experiencia con el máximo detalle que quieras…",
    en: "Tell us about your experience in as much detail as you like…",
    fr: "Racontez-nous votre expérience avec autant de détails que vous le souhaitez…",
  },
  record: { es: "Empezar a grabar", en: "Start recording", fr: "Commencer l'enregistrement" },
  stop: { es: "Finalizar grabación", en: "Finish recording", fr: "Terminer l'enregistrement" },
  replace: { es: "Volver a grabar", en: "Record again", fr: "Réenregistrer" },
  transcribing: { es: "Transcribiendo tu grabación…", en: "Transcribing your recording…", fr: "Transcription de votre enregistrement…" },
  retryTranscription: { es: "Reintentar transcripción", en: "Retry transcription", fr: "Réessayer la transcription" },
  transcriptLabel: { es: "Texto transcrito", en: "Transcribed text", fr: "Texte transcrit" },
  transcriptHelp: {
    es: "Lee la transcripción y corrige lo que necesites antes de enviarla.",
    en: "Read the transcript and make any corrections you need before sending it.",
    fr: "Relisez la transcription et corrigez-la si nécessaire avant de l'envoyer.",
  },
  voiceHelp: {
    es: "La grabación se utiliza únicamente para transcribirla y se elimina inmediatamente. Solo guardaremos el texto que revises. Máximo 3 minutos y 25 MB.",
    en: "The recording is used only for transcription and deleted immediately. We only save the text you review. Maximum 3 minutes and 25 MB.",
    fr: "L'enregistrement sert uniquement à la transcription puis est supprimé immédiatement. Seul le texte relu est conservé. Maximum 3 minutes et 25 Mo.",
  },
  rating: { es: "¿Cómo valorarías tu experiencia?", en: "How would you rate your experience?", fr: "Comment évaluez-vous votre expérience ?" },
  name: { es: "Nombre (opcional)", en: "Name (optional)", fr: "Nom (facultatif)" },
  email: { es: "Email (opcional)", en: "Email (optional)", fr: "E-mail (facultatif)" },
  trip: { es: "Viaje o fecha (opcional)", en: "Trip or date (optional)", fr: "Voyage ou date (facultatif)" },
  consent: {
    es: "Acepto que Xaluca Tours trate este comentario y, si incluyo mi email, pueda contactarme para ampliar la información.",
    en: "I agree that Xaluca Tours may process this feedback and, if I include my email, contact me for further information.",
    fr: "J'accepte que Xaluca Tours traite ce commentaire et, si j'indique mon e-mail, puisse me contacter pour plus d'informations.",
  },
  submit: { es: "Enviar feedback", en: "Send feedback", fr: "Envoyer" },
  sending: { es: "Guardando tu comentario…", en: "Saving your feedback…", fr: "Enregistrement de votre commentaire…" },
  successTitle: { es: "Gracias por compartirlo.", en: "Thank you for sharing.", fr: "Merci de l'avoir partagé." },
  successBody: {
    es: "Tu comentario ya está en manos del equipo de Xaluca Tours. Cada experiencia nos ayuda a cuidar mejor el siguiente viaje.",
    en: "Your feedback is now with the Xaluca Tours team. Every experience helps us care for the next journey even better.",
    fr: "Votre commentaire est maintenant entre les mains de l'équipe Xaluca Tours. Chaque expérience nous aide à améliorer le prochain voyage.",
  },
  another: { es: "Enviar otro comentario", en: "Send another", fr: "Envoyer un autre commentaire" },
  googleEyebrow: { es: "Comparte tu experiencia", en: "Share your experience", fr: "Partagez votre expérience" },
  googleTitle: {
    es: "¿Nos ayudas también en Google?",
    en: "Would you also help us on Google?",
    fr: "Pouvez-vous aussi nous aider sur Google ?",
  },
  googleBody: {
    es: "Tu experiencia puede ayudar a otros viajeros a elegir su próximo viaje. Copia tu comentario y compártelo también en Google Reseñas.",
    en: "Your experience can help other travellers choose their next journey. Copy your feedback and share it on Google Reviews too.",
    fr: "Votre expérience peut aider d'autres voyageurs à choisir leur prochain voyage. Copiez votre commentaire et partagez-le aussi sur Google.",
  },
  submittedReview: { es: "Tu comentario", en: "Your feedback", fr: "Votre commentaire" },
  copyReview: { es: "Copiar reseña", en: "Copy review", fr: "Copier l'avis" },
  copiedReview: { es: "Reseña copiada", en: "Review copied", fr: "Avis copié" },
  publishGoogle: { es: "Publicar en Google Reseñas", en: "Post on Google Reviews", fr: "Publier sur Google" },
};

const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export default function FeedbackPage() {
  const { lang } = useLanguage();
  const [mode, setMode] = useState("text");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tripReference, setTripReference] = useState("");
  const [rating, setRating] = useState(0);
  const [consent, setConsent] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioName, setAudioName] = useState("");
  const [transcript, setTranscript] = useState("");
  const [transcriptionLanguage, setTranscriptionLanguage] = useState("");
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptionAttempt, setTranscriptionAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState(null);
  const [copied, setCopied] = useState(false);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    document.title = `Feedback · Xaluca Tours`;
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const adoptAudio = useCallback((blob, filename) => {
    setAudioBlob(blob);
    setAudioName(filename);
  }, []);

  useEffect(() => {
    if (!audioBlob) {
      return undefined;
    }

    const controller = new AbortController();
    const transcribe = async () => {
      setTranscribing(true);
      setTranscript("");
      setError("");
      try {
        const body = new FormData();
        body.append("audio", audioBlob, audioName || "feedback.webm");
        const response = await fetch(`${API}/api/feedback/transcribe`, {
          method: "POST",
          body,
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.detail || "No se pudo transcribir la grabación.");
        setTranscript(data.text || "");
        setTranscriptionLanguage(data.language || lang);
        // The browser no longer needs the recording after transcription. Drop
        // both references immediately so only the editable text remains.
        setAudioBlob(null);
        setAudioName("");
      } catch (err) {
        if (err.name !== "AbortError") {
          const networkError = err instanceof TypeError;
          setError(
            networkError
              ? "El servidor no está disponible. Inicia el backend y vuelve a intentarlo."
              : (err.message || "No se pudo transcribir la grabación. Vuelve a intentarlo.")
          );
        }
      } finally {
        if (!controller.signal.aborted) setTranscribing(false);
      }
    };
    transcribe();
    return () => controller.abort();
  }, [audioBlob, audioName, lang, transcriptionAttempt]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setRecording(false);
  }, []);

  useEffect(() => {
    if (!recording) return undefined;
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (value + 1 >= MAX_RECORDING_SECONDS) {
          window.setTimeout(stopRecording, 0);
          return MAX_RECORDING_SECONDS;
        }
        return value + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [recording, stopRecording]);

  const startRecording = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("Este navegador no permite grabar directamente. Prueba con un navegador compatible y permite el acceso al micrófono.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const candidates = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"];
      const mimeType = candidates.find((type) => window.MediaRecorder.isTypeSupported?.(type));
      const recorder = new window.MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data?.size) chunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const type = (recorder.mimeType || mimeType || "audio/webm").split(";", 1)[0];
        const blob = new Blob(chunksRef.current, { type });
        const extension = type.includes("mp4") ? "m4a" : "webm";
        if (blob.size) adoptAudio(blob, `feedback-${Date.now()}.${extension}`);
      };
      recorderRef.current = recorder;
      recorder.start(500);
      setSeconds(0);
      setRecording(true);
      setAudioBlob(null);
      setAudioName("");
    } catch {
      setError("No hemos podido acceder al micrófono. Revisa el permiso del navegador e inténtalo de nuevo.");
    }
  };

  const resetAudio = () => {
    stopRecording();
    setAudioBlob(null);
    setAudioName("");
    setTranscript("");
    setTranscriptionLanguage("");
    setTranscribing(false);
    setTranscriptionAttempt(0);
    setSeconds(0);
  };

  const resetForm = () => {
    setMessage(""); setName(""); setEmail(""); setTripReference("");
    setRating(0); setConsent(false); setError(""); setSent(false);
    setSubmittedFeedback(null); setCopied(false); resetAudio();
  };

  const copySubmittedReview = async () => {
    const text = submittedFeedback?.text || "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (mode === "text" && !message.trim()) {
      setError("Escribe tu comentario antes de enviarlo."); return;
    }
    if (mode === "voice" && transcribing) {
      setError("Espera a que termine la transcripción antes de enviarla."); return;
    }
    if (mode === "voice" && !transcript.trim()) {
      setError("La grabación debe tener una transcripción antes de enviarla."); return;
    }
    if (!consent) {
      setError("Debes aceptar el tratamiento del comentario."); return;
    }
    setBusy(true);
    try {
      const body = new FormData();
      body.append("name", name);
      body.append("email", email);
      body.append("trip_reference", tripReference);
      if (rating) body.append("rating", String(rating));
      body.append("submission_type", mode === "voice" ? "voice" : "text");
      body.append("message", mode === "voice" ? transcript.trim() : message.trim());
      body.append("language", lang);
      body.append("consent", "true");
      body.append("source_url", window.location.href);
      body.append("website", "");
      if (mode === "voice" && transcriptionLanguage) body.append("transcription_language", transcriptionLanguage);
      const response = await fetch(`${API}/api/feedback`, { method: "POST", body });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || "No se pudo enviar el comentario.");
      setSubmittedFeedback({
        rating,
        text: mode === "voice" ? transcript.trim() : message.trim(),
      });
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "No se pudo enviar el comentario. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    const canShareOnGoogle = submittedFeedback?.rating >= 4 && Boolean(submittedFeedback?.text);
    return (
      <div className="bg-[#F7F0E4] pt-[112px] md:pt-[132px]" data-testid="feedback-success">
        <div className="min-h-[calc(100svh-112px)] md:min-h-[calc(100svh-132px)] px-5 py-16 md:px-8 md:py-24 flex items-center justify-center">
          <div className="w-full max-w-4xl text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#C16542] text-white shadow-xl shadow-[#C16542]/20">
              <Check className="h-9 w-9" strokeWidth={1.5} />
            </span>
            <p className="overline mt-8 text-[#A8533A]">Xaluca · Feedback</p>
            <h1 className="font-serif-x mt-5 text-5xl md:text-6xl text-[#2C2621]">{pick(COPY.successTitle, lang)}</h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#5C5248]">{pick(COPY.successBody, lang)}</p>

            {canShareOnGoogle && (
              <section className="mt-12 border border-[#2C2621]/12 bg-[#FDFBF7] p-6 text-left shadow-[0_24px_70px_rgba(44,38,33,0.08)] md:p-10" data-testid="feedback-google-review-invitation">
                <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_220px] md:items-start">
                  <div>
                    <p className="overline text-[#A8533A]">{pick(COPY.googleEyebrow, lang)}</p>
                    <h2 className="font-serif-x mt-4 text-3xl text-[#2C2621] md:text-4xl">{pick(COPY.googleTitle, lang)}</h2>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#5C5248]">{pick(COPY.googleBody, lang)}</p>
                  </div>
                  <div className="flex items-center justify-center gap-1 md:justify-end" aria-label={`${submittedFeedback.rating} / 5`}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star key={value} className={`h-5 w-5 ${value <= submittedFeedback.rating ? "fill-[#D4A373] text-[#D4A373]" : "text-[#2C2621]/15"}`} strokeWidth={1.4} />
                    ))}
                  </div>
                </div>

                <div className="mt-7 border-l-2 border-[#C16542] bg-[#F7F0E4] px-5 py-5 md:px-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#A8533A]">{pick(COPY.submittedReview, lang)}</p>
                  <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-[#2C2621]" data-testid="feedback-submitted-review">{submittedFeedback.text}</p>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={copySubmittedReview} className="inline-flex items-center justify-center gap-3 border border-[#2C2621]/20 bg-white px-5 py-4 text-[10px] uppercase tracking-[0.2em] text-[#2C2621] transition-colors hover:border-[#C16542] hover:text-[#A8533A]" data-testid="feedback-copy-review">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {pick(copied ? COPY.copiedReview : COPY.copyReview, lang)}
                  </button>
                  <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#C16542] px-5 py-4 text-center text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#A8533A]" data-testid="feedback-publish-google">
                    <ExternalLink className="h-4 w-4" /> {pick(COPY.publishGoogle, lang)}
                  </a>
                </div>
              </section>
            )}

            <button type="button" onClick={resetForm} className="mt-10 inline-flex items-center gap-3 bg-[#2C2621] px-7 py-4 text-[11px] uppercase tracking-[0.24em] text-white hover:bg-[#C16542]">
              <RotateCcw className="h-4 w-4" /> {pick(COPY.another, lang)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F0E4] pt-[112px] text-[#2C2621] md:pt-[132px]" data-testid="feedback-page">
      <section className="relative overflow-hidden bg-[#1A1513] px-6 py-20 md:py-28 text-white">
        <div className="absolute inset-0 berber-bg-cross opacity-35" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl grid gap-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="overline text-[#D4A373]">{pick(COPY.eyebrow, lang)}</p>
            <h1 className="font-serif-x mt-6 text-5xl leading-[0.98] md:text-7xl lg:text-8xl">{pick(COPY.title, lang)}</h1>
          </div>
          <p className="md:col-span-4 border-l border-[#D4A373]/35 pl-6 text-base leading-relaxed text-white/72">{pick(COPY.intro, lang)}</p>
        </div>
      </section>

      <section className="border-b border-[#2C2621]/10 bg-[#FDFBF7] px-5 py-12 md:px-10 md:py-16" data-testid="feedback-stars-message">
        <div className="mx-auto grid max-w-6xl gap-7 md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:gap-12">
          <div className="flex items-center gap-2 text-[#E2AE36]" aria-label="5 estrellas">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star key={value} className="h-7 w-7 fill-current md:h-8 md:w-8" strokeWidth={1.2} />
            ))}
          </div>
          <div className="max-w-4xl">
            <h2 className="font-serif-x text-3xl leading-tight text-[#2C2621] md:text-4xl">
              {pick(COPY.starsTitle, lang)}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#5C5248] md:text-base">
              {pick(COPY.starsBody, lang)}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_310px]">
          <form onSubmit={submit} className="border border-[#2C2621]/12 bg-[#FDFBF7] shadow-[0_25px_70px_rgba(44,38,33,0.09)]">
            <div className="grid grid-cols-2 border-b border-[#2C2621]/12">
              {[
                ["text", MessageSquareText, COPY.textTab],
                ["voice", Mic, COPY.voiceTab],
              ].map(([id, Icon, label]) => (
                <button key={id} type="button" onClick={() => { setMode(id); setError(""); }} className={`flex items-center justify-center gap-2 px-4 py-5 text-[10px] uppercase tracking-[0.2em] transition-colors ${mode === id ? "bg-[#C16542] text-white" : "text-[#5C5248] hover:bg-[#F7F0E4]"}`} data-testid={`feedback-mode-${id}`}>
                  <Icon className="h-4 w-4" strokeWidth={1.6} /> {pick(label, lang)}
                </button>
              ))}
            </div>

            <div className="space-y-8 p-6 md:p-10">
              {mode === "text" ? (
                <label className="block">
                  <span className="mb-3 block text-[10px] uppercase tracking-[0.22em] text-[#5C5248]">{pick(COPY.textLabel, lang)}</span>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={6000} rows={8} placeholder={pick(COPY.textPlaceholder, lang)} className="w-full resize-y border border-[#2C2621]/15 bg-white px-4 py-4 text-base leading-relaxed outline-none focus:border-[#C16542]" data-testid="feedback-text" />
                  <span className="mt-2 block text-right text-[10px] text-[#5C5248]/60">{message.length} / 6000</span>
                </label>
              ) : (
                <div className="border border-[#2C2621]/12 bg-[#F7F0E4]/65 p-6 md:p-8">
                  {recording || (!audioBlob && !transcript && !transcribing) ? (
                    <div className="text-center">
                      <button type="button" onClick={recording ? stopRecording : startRecording} className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full text-white shadow-xl transition-all ${recording ? "animate-pulse bg-[#A8533A]" : "bg-[#C16542] hover:scale-105"}`} aria-label={pick(recording ? COPY.stop : COPY.record, lang)} data-testid="feedback-record">
                        {recording ? <Pause className="h-9 w-9" fill="currentColor" /> : <Mic className="h-9 w-9" strokeWidth={1.5} />}
                      </button>
                      <p className="mt-5 font-serif-x text-2xl">{pick(recording ? COPY.stop : COPY.record, lang)}</p>
                      <p className={`mt-2 font-mono text-sm tracking-wider ${recording ? "text-[#A8533A]" : "text-[#5C5248]"}`}>{formatTime(seconds)} / 03:00</p>
                    </div>
                  ) : transcribing ? (
                    <div className="flex min-h-52 flex-col items-center justify-center text-center" data-testid="feedback-transcribing">
                      <Loader2 className="h-8 w-8 animate-spin text-[#C16542]" strokeWidth={1.5} />
                      <p className="font-serif-x mt-5 text-2xl">{pick(COPY.transcribing, lang)}</p>
                      <p className="mt-2 text-xs leading-relaxed text-[#5C5248]/70">{pick(COPY.voiceHelp, lang)}</p>
                    </div>
                  ) : transcript ? (
                    <div data-testid="feedback-transcript-editor">
                      <label className="block">
                        <span className="mb-3 block text-[10px] uppercase tracking-[0.22em] text-[#A8533A]">{pick(COPY.transcriptLabel, lang)}</span>
                        <textarea
                          value={transcript}
                          onChange={(event) => setTranscript(event.target.value)}
                          maxLength={12000}
                          rows={8}
                          className="w-full resize-y border border-[#C16542]/35 bg-white px-4 py-4 text-base leading-relaxed outline-none focus:border-[#C16542]"
                          data-testid="feedback-transcript"
                        />
                        <span className="mt-2 block text-right text-[10px] text-[#5C5248]/60">{transcript.length} / 12000</span>
                      </label>
                      <p className="mt-3 text-xs leading-relaxed text-[#5C5248]/75">{pick(COPY.transcriptHelp, lang)}</p>
                      <button type="button" onClick={resetAudio} className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#5C5248] hover:text-[#C16542]"><RotateCcw className="h-3.5 w-3.5" />{pick(COPY.replace, lang)}</button>
                    </div>
                  ) : (
                    <div className="flex min-h-40 flex-col items-center justify-center gap-4 text-center">
                      <button
                        type="button"
                        onClick={() => setTranscriptionAttempt((value) => value + 1)}
                        className="inline-flex items-center gap-2 bg-[#C16542] px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-white hover:bg-[#A8533A]"
                        data-testid="feedback-retry-transcription"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />{pick(COPY.retryTranscription, lang)}
                      </button>
                      <button type="button" onClick={resetAudio} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#5C5248] hover:text-[#C16542]"><Mic className="h-3.5 w-3.5" />{pick(COPY.replace, lang)}</button>
                    </div>
                  )}
                  <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-[#5C5248]/75">{pick(COPY.voiceHelp, lang)}</p>
                </div>
              )}

              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#5C5248]">{pick(COPY.rating, lang)}</p>
                <div className="mt-3 flex gap-2" aria-label={pick(COPY.rating, lang)}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} type="button" onClick={() => setRating(value)} className="p-1" aria-label={`${value} / 5`}>
                      <Star className={`h-7 w-7 ${value <= rating ? "fill-[#D4A373] text-[#D4A373]" : "text-[#2C2621]/20"}`} strokeWidth={1.4} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label><span className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#5C5248]">{pick(COPY.name, lang)}</span><input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} className="w-full border border-[#2C2621]/15 bg-white px-4 py-3 outline-none focus:border-[#C16542]" /></label>
                <label><span className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#5C5248]">{pick(COPY.email, lang)}</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} className="w-full border border-[#2C2621]/15 bg-white px-4 py-3 outline-none focus:border-[#C16542]" /></label>
                <label className="md:col-span-2"><span className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-[#5C5248]">{pick(COPY.trip, lang)}</span><input value={tripReference} onChange={(e) => setTripReference(e.target.value)} maxLength={200} placeholder="Ej. Gran Sur · mayo 2026" className="w-full border border-[#2C2621]/15 bg-white px-4 py-3 outline-none focus:border-[#C16542]" /></label>
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-[#5C5248]">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#C16542]" />
                <span>{pick(COPY.consent, lang)}</span>
              </label>
              <input name="website" tabIndex="-1" autoComplete="off" className="hidden" aria-hidden="true" />

              {error && <div role="alert" className="border border-[#C16542]/35 bg-[#C16542]/8 px-4 py-3 text-sm text-[#8C442E]">{error}</div>}
              <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-3 bg-[#2C2621] px-6 py-4 text-[11px] uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#C16542] disabled:cursor-wait disabled:opacity-60" data-testid="feedback-submit">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {pick(busy ? COPY.sending : COPY.submit, lang)}
              </button>
            </div>
          </form>

          <aside className="space-y-5 lg:pt-8">
            {[
              [Heart, "Escuchamos cada experiencia", "Tu comentario llega directamente al equipo que diseña y acompaña los viajes."],
              [Sparkles, "Mejora continua", "Lo que compartes nos ayuda a ajustar procesos, detalles y nuevas experiencias."],
              [ShieldCheck, "Privacidad desde el origen", "La grabación se elimina al terminar la transcripción. En Supabase solo conservamos el texto que hayas revisado y enviado."],
            ].map(([Icon, title, body]) => (
              <div key={title} className="border border-[#2C2621]/10 bg-[#FDFBF7]/70 p-6">
                <Icon className="h-5 w-5 text-[#C16542]" strokeWidth={1.5} />
                <h2 className="font-serif-x mt-5 text-2xl">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#5C5248]">{body}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </div>
  );
}
