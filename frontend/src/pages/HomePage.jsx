import React, { useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import Marquee from "@/components/Marquee";
import EmotionalIntro from "@/components/EmotionalIntro";
import WhyXaluca from "@/components/WhyXaluca";
import FeaturedQuote from "@/components/FeaturedQuote";
import TravelCategories from "@/components/TravelCategories";
import StressFreeProcess from "@/components/StressFreeProcess";
import WhatJourneysFeelLike from "@/components/WhatJourneysFeelLike";
import MoroccoCircuits from "@/components/MoroccoCircuits";
import MapSection from "@/components/MapSection";
import PersonalConsultation, { CommunityCTA } from "@/components/PersonalConsultation";
import ContactForm from "@/components/ContactForm";

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
      <StressFreeProcess />
      <WhatJourneysFeelLike />
      <MoroccoCircuits />
      <MapSection />
      <PersonalConsultation />
      <CommunityCTA />
      <ContactForm />
    </div>
  );
}
