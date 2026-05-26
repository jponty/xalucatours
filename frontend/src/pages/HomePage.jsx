import React, { useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import Marquee from "@/components/Marquee";
import EmotionalIntro from "@/components/EmotionalIntro";
import WhyXaluca from "@/components/WhyXaluca";
import FeaturedQuote from "@/components/FeaturedQuote";
import TravelCategories from "@/components/TravelCategories";
import MoroccoInteractiveMap from "@/components/MoroccoInteractiveMap";
import StressFreeProcess from "@/components/StressFreeProcess";
import WhatJourneysFeelLike from "@/components/WhatJourneysFeelLike";
import MoroccoVideos from "@/components/MoroccoVideos";
import MoroccoCircuits from "@/components/MoroccoCircuits";
import MapSection from "@/components/MapSection";
import PersonalConsultation, { CommunityCTA } from "@/components/PersonalConsultation";
import ContactForm from "@/components/ContactForm";
import BerberDivider from "@/components/BerberDivider";

export default function HomePage() {
  useEffect(() => {
    document.title = "Xaluca Tours · Viajes a medida por Marruecos";
  }, []);

  return (
    <div data-testid="home-page">
      <HeroSlider />
      <Marquee />
      <EmotionalIntro />
      <BerberDivider variant="berber" tone="paper" color="#A07042" />
      <WhyXaluca />
      <FeaturedQuote />
      <BerberDivider variant="zellige" tone="cream" color="#A07042" />
      <TravelCategories />
      <MoroccoInteractiveMap />
      <BerberDivider variant="nomadic" tone="paper" color="#A07042" label="Atlas · Sáhara · Mediterráneo" />
      <StressFreeProcess />
      <WhatJourneysFeelLike />
      <BerberDivider variant="zellige" tone="cream" color="#A07042" />
      <MoroccoVideos />
      <MoroccoCircuits />
      <BerberDivider variant="berber" tone="cream" color="#A07042" />
      <MapSection />
      <PersonalConsultation />
      <CommunityCTA />
      <BerberDivider variant="nomadic" tone="paper" color="#A07042" label="Xaluca · Tours" />
      <ContactForm />
    </div>
  );
}
