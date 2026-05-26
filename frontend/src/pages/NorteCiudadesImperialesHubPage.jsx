import React from "react";
import ItineraryHubPage from "@/components/ItineraryHubPage";
import { HUB_NORTE_CIUDADES_IMPERIALES } from "@/lib/itineraryHubs";

export default function NorteCiudadesImperialesHubPage() {
  return <ItineraryHubPage hub={HUB_NORTE_CIUDADES_IMPERIALES} />;
}
