import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import { useLanguage, pick } from "@/contexts/LanguageContext";
import { TRAVEL_CATEGORIES } from "@/lib/data";
import { pathFor } from "@/lib/routes";
import EditableImage from "@/components/EditableImage";

const BADGE_KEY = {
  popular:  "badge_popular",
  last:     "badge_last",
  seasonal: "badge_seasonal",
};

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
            <span className="overline">{t("cat_overline")}</span>
            <h2 className="font-serif-x text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-5 text-[#2C2621]">
              {t("cat_title")}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-base md:text-lg text-[#5C5248] leading-relaxed">
              {t("cat_sub")}
            </p>
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
                  <EditableImage
                    slot={`home.cat.${c.slug}`}
                    fallback={c.image}
                    alt={pick(c.title, lang)}
                    imgProps={{ loading: "lazy" }}
                    aspectRatio="4/5"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1513]/80 via-[#1A1513]/20 to-transparent" />
                  <span className="film-grain" />

                  {/* Number watermark */}
                  <span className="absolute top-6 left-6 font-serif-x-italic text-7xl md:text-8xl text-[#FDFBF7]/70 leading-none">
                    {c.number}
                  </span>

                  {/* Badges */}
                  {c.badges?.length > 0 && (
                    <div className="absolute top-6 right-6 flex flex-wrap gap-2 justify-end max-w-[60%]">
                      {c.badges.map((b) => (
                        <span
                          key={b}
                          data-testid={`badge-${c.slug}-${b}`}
                          className="inline-flex items-center bg-[#FDFBF7]/95 backdrop-blur-sm px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase"
                          style={{ color: c.accent }}
                        >
                          {t(BADGE_KEY[b])}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Region pill bottom */}
                  <span className="absolute bottom-5 left-6 inline-flex items-center gap-2 bg-[#1A1513]/55 backdrop-blur-md text-[#FDFBF7] px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase border border-[#FDFBF7]/20">
                    <MapPin className="w-3 h-3" strokeWidth={1.6} />
                    {pick(c.region, lang)}
                  </span>
                </ImageWrapper>

                <div className={`md:col-span-5 ${reverse ? "md:order-1 md:pr-6" : "md:pl-6"}`}>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#5C5248]">
                    {pick(c.region, lang)}
                  </span>
                  <h3 className="font-serif-x text-3xl md:text-4xl leading-[1.05] mt-3 tracking-tight text-[#2C2621]">
                    {pick(c.title, lang)}
                  </h3>
                  <p className="mt-5 text-base text-[#5C5248] leading-relaxed">
                    {pick(c.summary, lang)}
                  </p>

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

                  {linkTo ? (
                    <Link
                      to={linkTo}
                      data-testid={`category-cta-${c.slug}`}
                      className="mt-8 inline-flex items-center gap-3 border border-[#2C2621]/20 px-7 py-3.5 text-[10px] tracking-[0.3em] uppercase text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-all duration-300"
                    >
                      {t("cta_discover_routes")}
                      <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                    </Link>
                  ) : (
                    <a
                      href="#contact"
                      data-testid={`category-cta-${c.slug}`}
                      className="mt-8 inline-flex items-center gap-3 border border-[#2C2621]/20 px-7 py-3.5 text-[10px] tracking-[0.3em] uppercase text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621] transition-all duration-300"
                    >
                      {t("cta_discover_routes")}
                      <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                    </a>
                  )}
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
