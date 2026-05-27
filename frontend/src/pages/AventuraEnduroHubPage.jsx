import React from "react";
import ItineraryHubPage from "@/components/ItineraryHubPage";
import { HUB_AVENTURA_ENDURO } from "@/lib/itineraryHubs";

export default function AventuraEnduroHubPage() {
  return <ItineraryHubPage hub={HUB_AVENTURA_ENDURO} testid="aventura-enduro-hub-page" />;
}
