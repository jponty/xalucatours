import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Headset, Compass } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { translations } from "@/lib/i18n";
import { TRAVEL_CATEGORIES } from "@/lib/data";
import { SOUTH_TRIPS, FULL_TRIPS, SHORT_TRIPS, NORTH_TRIPS } from "@/lib/homeCarousels";
import { pathFor } from "@/lib/routes";
import { openChatbaseAssistant } from "@/lib/chatbase";
import CategoryImageCarousel from "@/components/CategoryImageCarousel";
import XalucaLogoBadge from "@/components/XalucaLogoBadge";
import EditableText from "@/components/EditableText";
import TripPriceDisclosure from "@/components/TripPriceDisclosure";

const BADGE_KEY = {
  popular:  "badge_popular",
  last:     "badge_last",
  seasonal: "badge_seasonal",
};

const PLAN_LABEL = { es: "Planificar mi viaje", en: "Plan my trip", fr: "Planifier mon voyage" };

/* Specific trip pages associated with each travel style. */
const OPTIONS_BY_SLUG = {
  "magic-south":     SOUTH_TRIPS,
  "north-to-south":  FULL_TRIPS,
  "short-escapes":   SHORT_TRIPS,
  "northern-morocco": NORTH_TRIPS,
};

const OPTIONS_LABEL = { es: "Opciones de viaje", en: "Trip options", fr: "Options de voyage" };

export const TravelCategories = () => {
  const { t, lang } = useLanguage();

  return (
    <section
      id="categories"
      data-testid="travel-categories-section"
      className="relative bg-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16 md:mb-20">
          <div className="md:col-span-7">
            <EditableText slot="home.cat.overline" defaults={translations.cat_overline} multiline={false} className="overline" />
            <EditableText as="h2" slot="home.cat.title" defaults={translations.cat_title}
              className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621] block" />
          </div>
          <div className="md:col-span-5">
            <EditableText as="p" slot="home.cat.sub" defaults={translations.cat_sub}
              className="text-base md:text-lg text-[#5C5248] leading-relaxed block" />
          </div>
        </div>

        <div className="space-y-12 md:space-y-16">
          {TRAVEL_CATEGORIES.map((c, idx) => {
            const reverse = idx % 2 === 1;
            const linkTo = c.routeId ? pathFor(lang, c.routeId) : null;
            const ImageWrapper = linkTo ? Link : "div";
            const imageProps = linkTo
              ? { to: linkTo, "data-testid": `category-image-${c.slug}` }
              : {};
            return (
              <article
                key={c.slug}
                data-testid={`category-card-${c.slug}`}
                className="group grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center"
              >
                <ImageWrapper
                  {...imageProps}
                  className={`relative md:col-span-7 overflow-hidden h-[56vh] min-h-[420px] max-h-[640px] block ${
                    reverse ? "md:order-2" : ""
                  }`}
                >
                  <CategoryImageCarousel
                    slug={c.slug}
                    images={(c.images && c.images.length > 0) ? c.images : [c.image]}
                    alt={pick(c.title, lang)}
                    aspectRatio="4/5"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/80 via-[#1A1513]/20 to-transparent pointer-events-none" />
                  <span className="film-grain pointer-events-none" />

                  {/* Number watermark */}
                  <span className="absolute top-6 left-6 font-serif-x-italic text-7xl md:text-8xl text-[#FDFBF7]/70 leading-none">
                    {c.number}
                  </span>

                  {/* Badges */}
                  {c.badges?.length > 0 ? (
                    <div className="absolute top-6 right-6 flex flex-wrap gap-2 justify-end max-w-[60%]">
                      {c.badges.map((b) => (
                        <span
                          key={b}
                          data-testid={`badge-${c.slug}-${b}`}
                          className="inline-flex items-center bg-[#FDFBF7]/95 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase"
                          style={{ color: c.accent }}
                        >
                          <EditableText
                            slot={`home.cat.${c.slug}.badge.${b}`}
                            defaults={translations[BADGE_KEY[b]]}
                            as="span"
                            multiline={false}
                          />
                        </span>
                      ))}
                    </div>
                  ) : (
                    /* No top-right label → show the Xaluca brand logo there. */
                    <XalucaLogoBadge
                      className="top-6 right-6 w-11 h-11 md:w-12 md:h-12"
                      testid={`category-logo-${c.slug}`}
                    />
                  )}

                  {/* Travel-style category pill (bottom) */}
                  <span className="absolute bottom-5 left-6 inline-flex items-center gap-2 bg-[#1A1513]/55 backdrop-blur-md text-[#FDFBF7] px-3.5 py-1.5 text-[10px] tracking-[0.25em] uppercase border border-[#FDFBF7]/20">
                    <EditableText
                      slot={`home.cat.${c.slug}.category`}
                      defaults={c.category || c.region}
                      multiline={false}
                    />
                  </span>
                </ImageWrapper>

                <div className={`md:col-span-5 ${reverse ? "md:order-1 md:pr-6" : "md:pl-6"}`}>
                  <EditableText
                    slot={`home.cat.${c.slug}.region`}
                    defaults={c.region}
                    as="span"
                    multiline={false}
                    className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]"
                  />
                  <EditableText as="h3" slot={`home.cat.${c.slug}.title`} defaults={c.title}
                    className="font-serif-x text-3xl md:text-4xl leading-[1.05] mt-3 tracking-tight text-[#2C2621] block" />
                  <EditableText as="p" slot={`home.cat.${c.slug}.summary`} defaults={c.summary}
                    className="mt-5 text-base text-[#5C5248] leading-relaxed block" />

                  {/* Opciones de viaje — specific trip pages for this style */}
                  {OPTIONS_BY_SLUG[c.slug]?.length > 0 && (
                    <div className="mt-7" data-testid={`category-options-${c.slug}`}>
                      <span className="block text-[10px] tracking-[0.3em] uppercase text-[#A07042]">
                        <EditableText
                          slot="home.cat.options_label"
                          defaults={OPTIONS_LABEL}
                          as="span"
                          multiline={false}
                        />
                      </span>
                      <ul className="mt-3 border-t border-[#2C2621]/10 divide-y divide-[#2C2621]/10">
                        {OPTIONS_BY_SLUG[c.slug].map((trip) => (
                          <li key={trip.id} className="py-1">
                            <Link
                              to={pathFor(lang, trip.routeId)}
                              data-testid={`category-option-${c.slug}-${trip.routeId}`}
                              className="group/opt flex items-start gap-2.5 pt-2 text-sm text-[#2C2621] hover:text-[#C16542] transition-colors"
                            >
                              <ArrowRight
                                className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#C16542] transition-transform duration-300 group-hover/opt:translate-x-1"
                                strokeWidth={1.6}
                              />
                              <span className="leading-snug">{pick(trip.title, lang)}</span>
                            </Link>
                            {trip.summary && (
                              <p
                                data-testid={`category-option-desc-${trip.routeId}`}
                                className="mt-1 ml-6 text-[12px] text-[#5C5248] leading-[1.6] line-clamp-2"
                              >
                                {pick(trip.summary, lang)}
                              </p>
                            )}
                            <div className="ml-6">
                              <TripPriceDisclosure routeId={trip.routeId} slug={c.slug} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Group departure schedule (only on group-departures card) */}
                  {c.departures && (
                    <ul className="mt-6 divide-y divide-[#2C2621]/10 border-t border-b border-[#2C2621]/10">
                      {c.departures.map((d, i) => (
                        <li key={i} className="flex items-center justify-between py-3 text-sm">
                          <span className="inline-flex items-center gap-2 text-[#2C2621]">
                            <Calendar className="w-3.5 h-3.5 text-[#C16542]" strokeWidth={1.5} />
                            {pick(d.label, lang)}
                          </span>
                          <span className="text-[#5C5248] font-serif-x-italic">{d.dates}</span>
                          <span
                            className="text-[10px] tracking-[0.25em] uppercase"
                            style={{ color: d.spots <= 2 ? "#C16542" : "#5C5248" }}
                          >
                            {d.spots} {d.spots === 1 ? "spot" : "spots"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      to={linkTo || pathFor(lang, "contact")}
                      data-testid={`category-cta-${c.slug}`}
                      className="inline-flex items-center gap-3 border border-[#2C2621]/20 px-7 py-3.5 text-[10px] tracking-[0.3em] uppercase text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-all duration-300"
                    >
                      <EditableText
                        slot="home.cat.discover_cta"
                        defaults={translations.cta_discover_routes}
                        as="span"
                        multiline={false}
                      />
                      <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                    </Link>
                    <button
                      type="button"
                      data-testid={`category-assistant-${c.slug}`}
                      onClick={openChatbaseAssistant}
                      aria-label="Asistente Virtual"
                      title="Asistente Virtual"
                      className="inline-flex items-center justify-center border border-[#2C2621]/20 w-[50px] h-[50px] text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-all duration-300"
                    >
                      <Headset className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <Link
                      to={pathFor(lang, "planTrip")}
                      data-testid={`category-plan-${c.slug}`}
                      aria-label={pick(PLAN_LABEL, lang)}
                      title={pick(PLAN_LABEL, lang)}
                      className="inline-flex items-center justify-center w-[50px] h-[50px] bg-[#C16542] hover:bg-[#A35133] text-[#FDFBF7] transition-colors duration-300"
                    >
                      <Compass className="w-4 h-4" strokeWidth={1.6} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TravelCategories;
