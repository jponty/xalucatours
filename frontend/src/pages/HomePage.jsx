import React, { useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import Marquee from "@/components/Marquee";
import EmotionalIntro from "@/components/EmotionalIntro";
import WhyXaluca from "@/components/WhyXaluca";
import FeaturedQuote from "@/components/FeaturedQuote";
import TravelCategories from "@/components/TravelCategories";
import OurTrips from "@/components/OurTrips";
import AllTripsCarousel from "@/components/AllTripsCarousel";
import StressFreeProcess from "@/components/StressFreeProcess";
import WhatJourneysFeelLike from "@/components/WhatJourneysFeelLike";
import MoroccoVideos from "@/components/MoroccoVideos";
import MoroccoCircuits from "@/components/MoroccoCircuits";
import MapSection from "@/components/MapSection";
import PersonalConsultation, { CommunityCTA } from "@/components/PersonalConsultation";
import ContactForm from "@/components/ContactForm";
import Testimonials from "@/components/Testimonials";
import HomeCategoryCarousel from "@/components/HomeCategoryCarousel";
import {
  SOUTH_TRIPS,
  FULL_TRIPS,
  SHORT_TRIPS,
  NORTH_TRIPS,
  UPCOMING_TRIPS,
} from "@/lib/homeCarousels";

/* Trilingual copy for the five new category sections. */
const COPY = {
  south: {
    eyebrow: { es: "Viajes por el sur de Marruecos", en: "Southern Morocco journeys", fr: "Voyages au Sud du Maroc" },
    title:   { es: "La magia del sur de Marruecos",  en: "The magic of southern Morocco", fr: "La magie du Sud du Maroc" },
    description: {
      es: "Cuatro circuitos cinematográficos por la ruta de las mil kasbahs, el Alto Atlas y las dunas del Erg Chebbi — el alma del Sahara marroquí.",
      en: "Four cinematic circuits along the thousand-kasbahs route, the High Atlas and the Erg Chebbi dunes — the soul of Moroccan Sahara.",
      fr: "Quatre circuits cinématographiques sur la route des mille kasbahs, le Haut Atlas et les dunes de l'Erg Chebbi — l'âme du Sahara marocain.",
    },
    cta: { es: "Ver Sur de Marruecos", en: "View Southern Morocco", fr: "Voir le Sud du Maroc" },
  },
  full: {
    eyebrow: { es: "Marruecos integral", en: "Full Morocco", fr: "Maroc intégral" },
    title:   { es: "Marruecos de norte a sur", en: "Morocco from north to south", fr: "Le Maroc du nord au sud" },
    description: {
      es: "Grandes travesías que conectan medinas imperiales, cordilleras del Atlas y dunas saharianas en un solo viaje.",
      en: "Grand crossings linking imperial medinas, Atlas ranges and Saharan dunes in a single journey.",
      fr: "Grandes traversées reliant médinas impériales, chaînes de l'Atlas et dunes sahariennes en un seul voyage.",
    },
    cta: { es: "Ver Marruecos integral", en: "View full Morocco", fr: "Voir Maroc intégral" },
  },
  short: {
    eyebrow: { es: "Escapadas cortas", en: "Short escapes", fr: "Escapades courtes" },
    title:   { es: "Escapadas cortas por Marruecos", en: "Short escapes in Morocco", fr: "Escapades courtes au Maroc" },
    description: {
      es: "Tres o cuatro días para desconectar — desierto, montaña o medina, sin renunciar a un Marruecos auténtico.",
      en: "Three or four days to disconnect — desert, mountain or medina, without giving up an authentic Morocco.",
      fr: "Trois ou quatre jours pour déconnecter — désert, montagne ou médina, sans renoncer à un Maroc authentique.",
    },
    cta: { es: "Ver escapadas", en: "View short escapes", fr: "Voir escapades" },
  },
  north: {
    eyebrow: { es: "Viajes por el norte de Marruecos", en: "Northern Morocco journeys", fr: "Voyages au Nord du Maroc" },
    title:   { es: "La riqueza del norte de Marruecos", en: "The richness of northern Morocco", fr: "La richesse du Nord du Maroc" },
    description: {
      es: "Ciudades imperiales, medinas vivas, la perla azul del Rif y el estrecho de Gibraltar — el norte cultural y mediterráneo del país.",
      en: "Imperial cities, living medinas, the blue pearl of the Rif and the Strait of Gibraltar — Morocco's cultural Mediterranean north.",
      fr: "Cités impériales, médinas vivantes, la perle bleue du Rif et le détroit de Gibraltar — le nord culturel et méditerranéen du pays.",
    },
    cta: { es: "Ver Norte de Marruecos", en: "View Northern Morocco", fr: "Voir le Nord du Maroc" },
  },
  upcoming: {
    eyebrow: { es: "Salidas en grupo", en: "Group departures", fr: "Départs en groupe" },
    title:   { es: "Próximas salidas en grupo", en: "Upcoming group departures", fr: "Prochains départs en groupe" },
    description: {
      es: "Fechas confirmadas, grupos pequeños (máx. 12 viajeros) y un acompañante Xaluca durante todo el viaje.",
      en: "Confirmed dates, small groups (max. 12 travellers) and a Xaluca host for the entire trip.",
      fr: "Dates confirmées, petits groupes (max. 12 voyageurs) et un accompagnant Xaluca pendant tout le voyage.",
    },
    cta: { es: "Ver todas las salidas", en: "View all departures", fr: "Voir tous les départs" },
  },
};

export default function HomePage() {
  useEffect(() => {
    document.title = "Xaluca Tours · Viajes a medida por Marruecos";
  }, []);

  return (
    <div data-testid="home-page">
      <HeroSlider />
      <Marquee />
      <EmotionalIntro />
      <WhyXaluca />
      <FeaturedQuote />
      <TravelCategories />
      <OurTrips />
      <AllTripsCarousel />

      {/* Category carousels — quick access to specific trip pages */}
      <HomeCategoryCarousel
        testid="home-south-carousel"
        eyebrow={COPY.south.eyebrow}
        title={COPY.south.title}
        description={COPY.south.description}
        ctaLabel={COPY.south.cta}
        ctaRouteId="tourSouth"
        trips={SOUTH_TRIPS}
        tone="sand"
        accent="#C16542"
      />

      <HomeCategoryCarousel
        testid="home-full-carousel"
        eyebrow={COPY.full.eyebrow}
        title={COPY.full.title}
        description={COPY.full.description}
        ctaLabel={COPY.full.cta}
        ctaRouteId="tourFull"
        trips={FULL_TRIPS}
        tone="cream"
        accent="#A07042"
      />

      <HomeCategoryCarousel
        testid="home-short-carousel"
        eyebrow={COPY.short.eyebrow}
        title={COPY.short.title}
        description={COPY.short.description}
        ctaLabel={COPY.short.cta}
        ctaRouteId="tourShort"
        trips={SHORT_TRIPS}
        tone="sand"
        accent="#D97742"
      />

      <HomeCategoryCarousel
        testid="home-north-carousel"
        eyebrow={COPY.north.eyebrow}
        title={COPY.north.title}
        description={COPY.north.description}
        ctaLabel={COPY.north.cta}
        ctaRouteId="tourNorth"
        trips={NORTH_TRIPS}
        tone="cream"
        accent="#3A4A5F"
      />

      <HomeCategoryCarousel
        testid="home-upcoming-carousel"
        eyebrow={COPY.upcoming.eyebrow}
        title={COPY.upcoming.title}
        description={COPY.upcoming.description}
        ctaLabel={COPY.upcoming.cta}
        ctaRouteId="upcomingDepartures"
        trips={UPCOMING_TRIPS}
        tone="dark"
        accent="#D4A373"
        compactMeta={true}
      />

      <StressFreeProcess />
      <WhatJourneysFeelLike />
      <Testimonials themes={["general"]} limit={3} tone="cream" testid="home-testimonials" />
      <MoroccoVideos />
      <MoroccoCircuits />
      <MapSection />
      <PersonalConsultation />
      <CommunityCTA />
      <ContactForm />
    </div>
  );
}
