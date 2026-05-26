import React, { useEffect } from "react";
import HeroSlider from "@/components/HeroSlider";
import Marquee from "@/components/Marquee";
import FeaturedJourneys from "@/components/FeaturedJourneys";
import LuxuryCamps from "@/components/LuxuryCamps";
import CulturalExperiences from "@/components/CulturalExperiences";
import Testimonials from "@/components/Testimonials";
import JournalSection from "@/components/JournalSection";
import MapSection from "@/components/MapSection";
import ContactForm from "@/components/ContactForm";

export default function HomePage() {
  useEffect(() => {
    document.title = "Xaluca Tours — Bespoke journeys through Morocco";
  }, []);

  return (
    <div data-testid="home-page">
      <HeroSlider />
      <Marquee />
      <FeaturedJourneys />
      <LuxuryCamps />
      <CulturalExperiences />
      <Testimonials />
      <JournalSection />
      <MapSection />
      <ContactForm />
    </div>
  );
}
