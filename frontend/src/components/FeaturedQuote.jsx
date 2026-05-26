import React from "react";
import { Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import EditableImage from "@/components/EditableImage";

export const FeaturedQuote = () => {
  const { t } = useLanguage();

  return (
    <section
      data-testid="featured-quote-section"
      className="relative bg-[#1A1513] text-[#FDFBF7] py-24 md:py-32 overflow-hidden"
    >
      <EditableImage
        slot="home.quote.bg"
        fallback="https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=2000&q=85"
        alt=""
        imgProps={{ loading: "lazy" }}
        className="ken-burns absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1513]/85 via-[#1A1513]/75 to-[#1A1513]/95" />
      <div className="absolute inset-0 berber-bg-cross opacity-40" aria-hidden="true" />
      <span className="film-grain" />

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
        <Quote className="w-12 h-12 mx-auto text-[#D4A373]/60" strokeWidth={1.2} aria-hidden="true" />
        <blockquote className="mt-8">
          <p className="font-serif-x-italic text-3xl md:text-4xl lg:text-5xl leading-[1.2] text-[#FDFBF7]">
            "{t("quote_body")}"
          </p>
          <footer className="mt-10 text-[10px] tracking-[0.3em] uppercase text-[#D4A373]">
            {t("quote_signature")}
          </footer>
        </blockquote>
      </div>
    </section>
  );
};

export default FeaturedQuote;
