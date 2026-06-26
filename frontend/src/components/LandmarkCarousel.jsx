import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Camera, X, MapPin, Compass, Headset, Phone, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { pathFor } from "@/lib/routes";
import { openChatbaseAssistant } from "@/lib/chatbase";
import ShareTripButton from "@/components/ShareTripButton";
import { LANDMARK_GALLERIES } from "@/lib/landmarkGalleries";
import { ALIAS_PROFILE } from "@/lib/placeGalleries";
import { POI_CARD_COPY } from "@/lib/poiCardCopy";
import { EXTRA_POI_CARDS } from "@/lib/extraPois";

const CARD_COPY = { ...POI_CARD_COPY, ...EXTRA_POI_CARDS };
import EditableImage from "@/components/EditableImage";
import EditableText from "@/components/EditableText";
import ImageContactBubble from "@/components/ImageContactBubble";
import grupXalucaLogo from "@/assets/grup-xaluca-logo.webp";
import monogramaX from "@/assets/monograma-x-crop.png";

const LABELS = {
  es: {
    eyebrow: "Galería del lugar",
    helper: "Selecciona un punto del mapa o de la lista para conocer cada lugar a través de pequeñas historias visuales.",
    prev: "Anterior",
    next: "Siguiente",
    close: "Cerrar galería",
    count_one: "card",
    count_many: "cards",
  },
  en: {
    eyebrow: "Place gallery",
    helper: "Pick a point on the map or the side list to read each place through small visual stories.",
    prev: "Previous",
    next: "Next",
    close: "Close gallery",
    count_one: "card",
    count_many: "cards",
  },
  fr: {
    eyebrow: "Galerie du lieu",
    helper: "Sélectionnez un point sur la carte ou dans la liste pour découvrir chaque lieu à travers de petites histoires visuelles.",
    prev: "Précédent",
    next: "Suivant",
    close: "Fermer la galerie",
    count_one: "card",
    count_many: "cards",
  },
};

/* Trilingual defaults for the editable section chrome (GLOBAL slots — one
   edit updates the heading on every place gallery across the site). */
const PLACE_UI = {
  eyebrow: { es: "Galería del lugar", en: "Place gallery", fr: "Galerie du lieu" },
  helper: {
    es: "Selecciona un punto del mapa o de la lista para conocer cada lugar a través de pequeñas historias visuales.",
    en: "Pick a point on the map or the side list to read each place through small visual stories.",
    fr: "Sélectionnez un point sur la carte ou dans la liste pour découvrir chaque lieu à travers de petites histoires visuelles.",
  },
};

const PLAN_CTA = { es: "Planificar mi viaje", en: "Plan my trip", fr: "Planifier mon voyage" };
const ASSISTANT_CTA = { es: "Asistente virtual", en: "Virtual assistant", fr: "Assistant virtuel" };
const CALL_CTA = { es: "Llamar por teléfono", en: "Call us", fr: "Nous appeler" };
const CALL_TEL = "+34937268366";
const APPOINTMENT_CTA = { es: "Cita previa", en: "Book an appointment", fr: "Prendre rendez-vous" };

const Card = ({ image, accent, placeName, lang, index, total, slot }) => {
  return (
  <article
    data-testid={`landmark-card-${index}`}
    className="landmark-story-card snap-start shrink-0 w-[78vw] sm:w-[320px] md:w-[300px] lg:w-[320px] bg-[#FDFBF7] border border-[#2C2621]/12 overflow-hidden flex flex-col group transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(26,21,19,0.45)]"
  >
    <div className="relative aspect-[4/5] overflow-hidden bg-[#1A1513]">
      <EditableImage
        slot={slot}
        fallback={image.src}
        alt={pick(image.title, lang)}
        aspectRatio="4/5"
        imgProps={{ loading: "lazy" }}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/55 via-transparent to-transparent opacity-90 pointer-events-none" />
      <span className="film-grain pointer-events-none" />
      {/* Xaluca "&" monogram — decorative graphic anchored to the right edge */}
      <img
        src={monogramaX}
        alt=""
        aria-hidden="true"
        data-testid={`landmark-card-monogram-${index}`}
        className="pointer-events-none select-none absolute right-0 bottom-0 h-[86%] w-auto object-contain opacity-60 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
      />
      {/* Location tag — always the real place name (e.g. "Ouarzazate"), using
          the same accent colour the point has in the day's highlighted POIs. */}
      <span
        data-testid={`landmark-card-tag-${index}`}
        className="absolute top-3.5 left-3.5 inline-flex items-center gap-2 bg-[#FDFBF7]/95 backdrop-blur-sm px-2.5 py-1 text-[9px] tracking-[0.28em] uppercase z-[1] pointer-events-none"
        style={{ color: accent }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
        <span>{pick(placeName, lang)}</span>
      </span>
      <img
        src={grupXalucaLogo}
        alt="Xaluca"
        data-testid={`landmark-card-logo-${index}`}
        className="absolute top-3 right-3 w-11 h-11 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] pointer-events-none z-[1]"
      />
      {/* Quick contact bubble — bottom-left of each place photo */}
      <ImageContactBubble slug={`landmark-${index}`} align="left" vertical="bottom" zClass="z-[6]" />
    </div>
    <div className="flex-1 p-5 md:p-6 flex flex-col gap-3">
      <EditableText
        slot={`${slot}.title`}
        defaults={image.title}
        as="h5"
        className="font-serif-x text-[18px] md:text-[20px] leading-[1.2] text-[#2C2621]"
      />
      <EditableText
        slot={`${slot}.desc`}
        defaults={image.description}
        as="p"
        className="text-[13px] md:text-[13.5px] text-[#5C5248] leading-[1.7] flex-1"
      />
      <span className="block w-10 h-px mt-1" style={{ background: accent }} />
      <div className="mt-2 flex flex-wrap items-center gap-2.5" data-testid={`landmark-card-actions-${index}`}>
        <Link
          to={pathFor(lang, "planTrip")}
          data-testid={`landmark-card-plan-cta-${index}`}
          aria-label={pick(PLAN_CTA, lang)}
          title={pick(PLAN_CTA, lang)}
          className="inline-flex items-center justify-center w-11 h-11 bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] transition-colors"
        >
          <Compass className="w-[18px] h-[18px]" strokeWidth={1.6} />
        </Link>
        <button
          type="button"
          onClick={openChatbaseAssistant}
          data-testid={`landmark-card-assistant-cta-${index}`}
          aria-label={pick(ASSISTANT_CTA, lang)}
          title={pick(ASSISTANT_CTA, lang)}
          className="inline-flex items-center justify-center w-11 h-11 border border-[#2C2621]/25 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors"
        >
          <Headset className="w-[18px] h-[18px]" strokeWidth={1.6} />
        </button>
        <a
          href={`tel:${CALL_TEL}`}
          data-testid={`landmark-card-call-cta-${index}`}
          aria-label={pick(CALL_CTA, lang)}
          title={pick(CALL_CTA, lang)}
          className="inline-flex items-center justify-center w-11 h-11 border border-[#2C2621]/25 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors"
        >
          <Phone className="w-[18px] h-[18px]" strokeWidth={1.6} />
        </a>
        <Link
          to={pathFor(lang, "appointment")}
          data-testid={`landmark-card-appointment-cta-${index}`}
          aria-label={pick(APPOINTMENT_CTA, lang)}
          title={pick(APPOINTMENT_CTA, lang)}
          className="inline-flex items-center justify-center w-11 h-11 border border-[#2C2621]/25 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-colors"
        >
          <CalendarClock className="w-[18px] h-[18px]" strokeWidth={1.6} />
        </Link>
        <ShareTripButton index={index} />
      </div>
    </div>
  </article>
  );
};

export const LandmarkCarousel = ({ landmark, accent = "#C16542", onClose }) => {
  const { lang } = useLanguage();
  const t = LABELS[lang] || LABELS.es;
  // GLOBAL, page/language-independent slot base. The same point of interest
  // (matched by its stable `poiKey`, not its display name) shares ONE CMS
  // record across every trip page and itinerary day, so editing its cards,
  // images, titles, descriptions or captions anywhere updates it everywhere.
  const poiKey = landmark ? (landmark.poiKey || landmark.id) : "x";
  // Curated day landmarks carry an explicit `slotBase` (`landmark.${id}`) so
  // their gallery is managed centrally from /admin and synced everywhere the
  // day map renders them. Everything else falls back to the poi-key base.
  const galleryBase = landmark && landmark.slotBase
    ? `${landmark.slotBase}.gallery`
    : `poi.${poiKey}.gallery`;
  // Galleries can come either from the inline `landmark.gallery` (used by
  // synthetic city-profile waypoints) or the static LANDMARK_GALLERIES dict
  // keyed by landmark.id (the original curated landmark days).
  const images =
    (landmark && Array.isArray(landmark.gallery) && landmark.gallery.length > 0
      ? landmark.gallery
      : (landmark && LANDMARK_GALLERIES[landmark.id]) || []);
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  // Client-provided card copy (title + description), keyed by the gallery's
  // stable id. Falls back through poiKey, slotBase id and gazetteer aliases so
  // the same place gets the right copy regardless of which resolver surfaced it.
  const copyKeys = landmark
    ? [
        landmark.id,
        landmark.poiKey,
        landmark.slotBase && landmark.slotBase.replace(/^landmark\./, ""),
        ALIAS_PROFILE[landmark.id],
        ALIAS_PROFILE[landmark.poiKey],
      ].filter(Boolean)
    : [];
  const cardCopy = copyKeys.map((k) => CARD_COPY[k]).find(Boolean) || null;

  // Auto-scroll into view + reset scroll position when landmark changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: 0, behavior: "instant" in window ? "instant" : "auto" });
    }
  }, [landmark && landmark.id]);

  if (!landmark || images.length === 0) return null;

  const scrollBy = (dir) => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector("[data-testid^='landmark-card-']");
    const step = card ? card.getBoundingClientRect().width + 16 : 320;
    trackRef.current.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      data-testid={`landmark-carousel-${landmark.id}`}
      key={landmark.id}
      className="landmark-carousel-enter mt-8 md:mt-10 bg-[#FDFBF7] border border-[#2C2621]/15 overflow-hidden shadow-[0_24px_60px_-30px_rgba(26,21,19,0.35)]"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 md:px-7 py-4 md:py-5 border-b border-[#2C2621]/10 bg-[#FDFBF7]">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-full shrink-0"
            style={{ background: `${accent}1A`, color: accent }}
          >
            <Camera className="w-4 h-4" strokeWidth={1.7} />
          </span>
          <div className="min-w-0">
            <EditableText
              slot="gallery-ui.place.eyebrow"
              defaults={PLACE_UI.eyebrow}
              as="span"
              multiline={false}
              className="block text-[10px] tracking-[0.3em] uppercase"
              style={{ color: accent }}
            />
            <p className="font-serif-x text-[16px] md:text-[18px] text-[#2C2621] leading-snug mt-0.5 inline-flex items-center gap-2 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} strokeWidth={1.6} />
              <span className="truncate">{pick(landmark.name, lang)}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-block text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
            {images.length} {images.length === 1 ? t.count_one : t.count_many}
          </span>
          {images.length > 1 && (
            <div className="hidden md:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label={t.prev}
                data-testid={`landmark-carousel-prev-${landmark.id}`}
                className="inline-flex items-center justify-center w-9 h-9 border border-[#2C2621]/25 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-all duration-300"
              >
                <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label={t.next}
                data-testid={`landmark-carousel-next-${landmark.id}`}
                className="inline-flex items-center justify-center w-9 h-9 border border-[#2C2621]/25 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-all duration-300"
              >
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.6} />
              </button>
            </div>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              data-testid={`landmark-carousel-close-${landmark.id}`}
              className="inline-flex items-center justify-center w-9 h-9 border border-[#2C2621]/20 text-[#5C5248] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-all duration-300"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.6} />
            </button>
          )}
        </div>
      </div>

      {/* Track */}
      <div className="relative bg-[#F7F1E4]">
        <div
          ref={trackRef}
          data-testid={`landmark-carousel-track-${landmark.id}`}
          className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory px-5 md:px-7 py-6 md:py-7 scroll-smooth landmark-track"
        >
          {images.map((img, i) => {
            const ov = cardCopy && cardCopy[i];
            const image = ov ? { ...img, title: ov.title, description: ov.description } : img;
            return (
              <Card
                key={i}
                image={image}
                accent={accent}
                placeName={landmark.name}
                lang={lang}
                index={i}
                total={images.length}
                slot={`${galleryBase}.${i}`}
              />
            );
          })}
        </div>

        {/* Mobile arrows — overlay */}
        {images.length > 1 && (
          <div className="md:hidden flex justify-end gap-1.5 px-5 pb-5">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label={t.prev}
              data-testid={`landmark-carousel-prev-mobile-${landmark.id}`}
              className="inline-flex items-center justify-center w-10 h-10 border border-[#2C2621]/25 text-[#2C2621] bg-[#FDFBF7] hover:bg-[#2C2621] hover:text-[#FDFBF7] transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label={t.next}
              data-testid={`landmark-carousel-next-mobile-${landmark.id}`}
              className="inline-flex items-center justify-center w-10 h-10 border border-[#2C2621]/25 text-[#2C2621] bg-[#FDFBF7] hover:bg-[#2C2621] hover:text-[#FDFBF7] transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.6} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* Subtle helper card shown when no landmark is selected. */
export const LandmarkCarouselHint = ({ accent = "#C16542" }) => {
  return (
    <div
      data-testid="landmark-carousel-hint"
      className="mt-8 md:mt-10 flex items-center gap-4 px-5 md:px-7 py-4 md:py-5 bg-[#FDFBF7]/70 border border-dashed border-[#2C2621]/20"
    >
      <span
        className="inline-flex items-center justify-center w-9 h-9 rounded-full shrink-0"
        style={{ background: `${accent}1A`, color: accent }}
      >
        <Camera className="w-4 h-4" strokeWidth={1.6} />
      </span>
      <p className="text-[12px] md:text-[13px] tracking-[0.04em] text-[#5C5248] leading-relaxed">
        <EditableText slot="gallery-ui.place.helper" defaults={PLACE_UI.helper} as="span" />
      </p>
    </div>
  );
};

export default LandmarkCarousel;
