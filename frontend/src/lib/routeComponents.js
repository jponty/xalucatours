// Centralized routeId → Component registry.
// Keeps App.js small and makes adding/removing routes a one-line change.
//
// Usage: const Component = ROUTE_COMPONENTS[routeId];

import HomePage from "@/pages/HomePage";
import ToursLandingPage from "@/pages/ToursLandingPage";
import MarruecosPage from "@/pages/MarruecosPage";
import NortePage from "@/pages/NortePage";
import SurPage from "@/pages/SurPage";
import AventuraPage from "@/pages/AventuraPage";
import EscapadasPage from "@/pages/EscapadasPage";
import ViajesAMedidaPage from "@/pages/ViajesAMedidaPage";
import DesiertoAtlas67Page from "@/pages/DesiertoAtlas67Page";
import DesiertoAtlas56Page from "@/pages/DesiertoAtlas56Page";
import DesiertoAtlas45Page from "@/pages/DesiertoAtlas45Page";
import AtlasDesierto45Page from "@/pages/AtlasDesierto45Page";
import AtlasDesierto56Page from "@/pages/AtlasDesierto56Page";
import AtlasDesierto67Page from "@/pages/AtlasDesierto67Page";
import AtlasDesiertoHubPage from "@/pages/AtlasDesiertoHubPage";
import MarrakechErgChebbiHubPage from "@/pages/MarrakechErgChebbiHubPage";
import ErgChebbiMarrakechHubPage from "@/pages/ErgChebbiMarrakechHubPage";
import MarrakechErg45Page from "@/pages/MarrakechErg45Page";
import MarrakechErg56Page from "@/pages/MarrakechErg56Page";
import MarrakechErg67Page from "@/pages/MarrakechErg67Page";
import MarrakechErg78Page from "@/pages/MarrakechErg78Page";
import ErgMarrakech67Page from "@/pages/ErgMarrakech67Page";
import ErgMarrakech78Page from "@/pages/ErgMarrakech78Page";
import ErgMarrakech45Page from "@/pages/ErgMarrakech45Page";
import ErgMarrakech56Page from "@/pages/ErgMarrakech56Page";
import MarrakechLoop23Page from "@/pages/MarrakechLoop23Page";
import MarrakechLoop34Page from "@/pages/MarrakechLoop34Page";
import MarrakechLoop45Page from "@/pages/MarrakechLoop45Page";
import MarrakechLoop56Page from "@/pages/MarrakechLoop56Page";
import MarrakechLoop67Page from "@/pages/MarrakechLoop67Page";
import MarrakechLoop78Page from "@/pages/MarrakechLoop78Page";
import MarrakechErgChebbiMarrakechHubPage from "@/pages/MarrakechErgChebbiMarrakechHubPage";
import MarrakechEssaouiraHubPage from "@/pages/MarrakechEssaouiraHubPage";
import MarrakechEssaouira45Page from "@/pages/MarrakechEssaouira45Page";
import MarrakechEssaouira67Page from "@/pages/MarrakechEssaouira67Page";
import ErrachidiaAtlasFezHubPage from "@/pages/ErrachidiaAtlasFezHubPage";
import FezAtlasErrachidia56Page from "@/pages/FezAtlasErrachidia56Page";
import DesiertoAtlasHubPage from "@/pages/DesiertoAtlasHubPage";
import GransurFezRakHubPage from "@/pages/GransurFezRakHubPage";
import GransurFezSidialiRakHubPage from "@/pages/GransurFezSidialiRakHubPage";
import GransurOuarzaFezHubPage from "@/pages/GransurOuarzaFezHubPage";
import GransurTangerRakHubPage from "@/pages/GransurTangerRakHubPage";
import FezMarrakech910Page from "@/pages/FezMarrakech910Page";
import FezMarrakech67Page from "@/pages/FezMarrakech67Page";
import FezMarrakech89Page from "@/pages/FezMarrakech89Page";
import FezMarrakech78Page from "@/pages/FezMarrakech78Page";
import FezSidialiMarrakech78Page from "@/pages/FezSidialiMarrakech78Page";
import FezSidialiMarrakech89Page from "@/pages/FezSidialiMarrakech89Page";
import FezSidialiMarrakech910Page from "@/pages/FezSidialiMarrakech910Page";
import AtlasDesiertoFezHubPage from "@/pages/AtlasDesiertoFezHubPage";
import GransurRakFezHubPage from "@/pages/GransurRakFezHubPage";
import TangerRak89Page from "@/pages/TangerRak89Page";
import TangerRak910Page from "@/pages/TangerRak910Page";
import FezSidialiOuarzazate56Page from "@/pages/FezSidialiOuarzazate56Page";
import FezSidialiOuarzazate67Page from "@/pages/FezSidialiOuarzazate67Page";
import FezSidialiOuarzazate78Page from "@/pages/FezSidialiOuarzazate78Page";
import OuarzazateSidialiFez56Page from "@/pages/OuarzazateSidialiFez56Page";
import OuarzazateSidialiFez67Page from "@/pages/OuarzazateSidialiFez67Page";
import OuarzazateSidialiFez78Page from "@/pages/OuarzazateSidialiFez78Page";
import MarrakechFez67Page from "@/pages/MarrakechFez67Page";
import MarrakechFez78Page from "@/pages/MarrakechFez78Page";
import MarrakechFez89Page from "@/pages/MarrakechFez89Page";
import MarrakechFez910Page from "@/pages/MarrakechFez910Page";
import MarrakechSidialiFez78Page from "@/pages/MarrakechSidialiFez78Page";
import MarrakechSidialiFez89Page from "@/pages/MarrakechSidialiFez89Page";
import MarrakechSidialiFez910Page from "@/pages/MarrakechSidialiFez910Page";
import {
  EscapadaDesierto34Page,
  EscapadaAtlas34Page,
  EscapadaFezPage,
  EscapadaFez23Page,
  EscapadaFez34Page,
  EscapadaFezSidiali34Page,
  EscapadaFezSidiali45Page,
  EscapadaMarrakechPage,
  EscapadaMarrakech23Page,
  EscapadaRakAgafay34Page,
  EscapadaTangerPage,
} from "@/pages/EscapadaIntroPages";
import EscapadaRakErgRakHubPage from "@/pages/EscapadaRakErgRakHubPage";
import AventuraEnduroHubPage from "@/pages/AventuraEnduroHubPage";
import EnduroAventura45Page from "@/pages/EnduroAventura45Page";
import EnduroAventura67Page from "@/pages/EnduroAventura67Page";
import FinDeAno2026Page from "@/pages/FinDeAno2026Page";
import NorteCiudadesImperialesHubPage from "@/pages/NorteCiudadesImperialesHubPage";
import NorteTangerFezHubPage from "@/pages/NorteTangerFezHubPage";
import CiudadesImperiales45Page from "@/pages/CiudadesImperiales45Page";
import CiudadesImperiales67Page from "@/pages/CiudadesImperiales67Page";
import CiudadesImperialesRif67Page from "@/pages/CiudadesImperialesRif67Page";
import CiudadesImperialesRif78Page from "@/pages/CiudadesImperialesRif78Page";
import TangerFez45Page from "@/pages/TangerFez45Page";
import TangerFez56Page from "@/pages/TangerFez56Page";
import FezTanger56Page from "@/pages/FezTanger56Page";
import FezTanger67Page from "@/pages/FezTanger67Page";
import PlanificaTuViajePage from "@/pages/PlanificaTuViajePage";
import PlannerPage from "@/pages/PlannerPage";
import ProximasSalidasPage from "@/pages/ProximasSalidasPage";
import WhenToTravelPage from "@/pages/WhenToTravelPage";
import QueVerEnMarruecosPage from "@/pages/QueVerEnMarruecosPage";
import QueHacemosPage from "@/pages/QueHacemosPage";
import IncentivosPage from "@/pages/IncentivosPage";
import MoroccoLandingPage from "@/pages/MoroccoLandingPage";
import EquipoPage from "@/pages/EquipoPage";
import BlogPage from "@/pages/BlogPage";
import ContactPage from "@/pages/ContactPage";
import CitaPreviaPage from "@/pages/CitaPreviaPage";
import CatalogoPage from "@/pages/CatalogoPage";
import JuegoPage from "@/pages/JuegoPage";
import ConcursoPage from "@/pages/ConcursoPage";
import GaleriaPage from "@/pages/GaleriaPage";
import PreciosPage from "@/pages/PreciosPage";
import OpinionesPage from "@/pages/OpinionesPage";
import VuelosPage from "@/pages/VuelosPage";
import AsistentePage from "@/pages/AsistentePage";
import FavoritosPage from "@/pages/FavoritosPage";
import FastTrackPage from "@/pages/FastTrackPage";
import FeedbackPage from "@/pages/FeedbackPage";

export const ROUTE_COMPONENTS = {
  home:                          HomePage,
  toursLanding:                  ToursLandingPage,
  catalog:                       CatalogoPage,            // /catalogo · Publuu flipbook
  tourFull:                      MarruecosPage,
  tourNorth:                     NortePage,
  tourSouth:                     SurPage,
  tourAdventure:                 AventuraPage,
  tourAventuraEnduroHub:         AventuraEnduroHubPage,
  tourEnduroAventura45:          EnduroAventura45Page,
  tourEnduroAventura67:          EnduroAventura67Page,
  tourFinDeAno2025:              FinDeAno2026Page,
  tourShort:                     EscapadasPage,
  tourBespoke:                   ViajesAMedidaPage,

  // Hubs & program pages
  tourAtlasDesiertoHub:          AtlasDesiertoHubPage,
  tourMarrakechErgHub:           MarrakechErgChebbiHubPage,
  tourErgChebbiMarrakechHub:     ErgChebbiMarrakechHubPage,
  tourMarrakechLoopHub:          MarrakechErgChebbiMarrakechHubPage,
  tourMarrakechEssHub:           MarrakechEssaouiraHubPage,
  tourMarrakechEss45:            MarrakechEssaouira45Page,
  tourMarrakechEss67:            MarrakechEssaouira67Page,
  tourErrAtlasFezHub:            ErrachidiaAtlasFezHubPage,
  tourFezAtlasErr56:             FezAtlasErrachidia56Page,
  tourDesiertoAtlasHub:          DesiertoAtlasHubPage,
  tourGransurFezRak:             GransurFezRakHubPage,
  tourGransurFezSidiali:         GransurFezSidialiRakHubPage,
  tourGransurOuarzaFez:          GransurOuarzaFezHubPage,
  tourGransurTangerRak:          GransurTangerRakHubPage,
  tourFezRak910:                 FezMarrakech910Page,
  tourFezRak89:                  FezMarrakech89Page,
  tourFezRak78:                  FezMarrakech78Page,
  tourFezSidialiRak78:           FezSidialiMarrakech78Page,
  tourFezSidialiRak89:           FezSidialiMarrakech89Page,
  tourFezSidialiRak910:          FezSidialiMarrakech910Page,
  tourAtlasDesiertoFezHub:       AtlasDesiertoFezHubPage,
  tourGransurRakFezHub:          GransurRakFezHubPage,
  tourTangerRak89:               TangerRak89Page,
  tourTangerRak910:              TangerRak910Page,
  tourFezSidialiOzz56:           FezSidialiOuarzazate56Page,
  tourFezSidialiOzz67:           FezSidialiOuarzazate67Page,
  tourFezSidialiOzz78:           FezSidialiOuarzazate78Page,
  tourOzzSidialiFez56:           OuarzazateSidialiFez56Page,
  tourOzzSidialiFez67:           OuarzazateSidialiFez67Page,
  tourOzzSidialiFez78:           OuarzazateSidialiFez78Page,
  tourFezRak67:                  FezMarrakech67Page,
  tourMarrakechFez67:            MarrakechFez67Page,
  tourMarrakechFez78:            MarrakechFez78Page,
  tourMarrakechFez89:            MarrakechFez89Page,
  tourMarrakechFez910:           MarrakechFez910Page,
  tourMarrakechSidialiFez78:     MarrakechSidialiFez78Page,
  tourMarrakechSidialiFez89:     MarrakechSidialiFez89Page,
  tourMarrakechSidialiFez910:    MarrakechSidialiFez910Page,

  // Escapadas
  tourEscapadaDesierto34:        EscapadaDesierto34Page,
  tourEscapadaAtlas34:           EscapadaAtlas34Page,
  tourEscapadaFez:               EscapadaFezPage,
  tourEscapadaFez23:             EscapadaFez23Page,
  tourEscapadaFez34:             EscapadaFez34Page,
  tourEscapadaFezSidiali34:      EscapadaFezSidiali34Page,
  tourEscapadaFezSidiali45:      EscapadaFezSidiali45Page,
  tourEscapadaMarrakech:         EscapadaMarrakechPage,
  tourEscapadaMarrakech23:       EscapadaMarrakech23Page,
  tourEscapadaRakAgafay34:       EscapadaRakAgafay34Page,
  tourEscapadaRakErgRakHub:      EscapadaRakErgRakHubPage,
  tourEscapadaTanger:            EscapadaTangerPage,

  // Norte
  tourNorteCiudadesImperiales:   NorteCiudadesImperialesHubPage,
  tourCiudadesImperiales45:      CiudadesImperiales45Page,
  tourCiudadesImperiales67:      CiudadesImperiales67Page,
  tourCiudadesImperialesRif67:   CiudadesImperialesRif67Page,
  tourCiudadesImperialesRif78:   CiudadesImperialesRif78Page,
  tourNorteTangerFez:            NorteTangerFezHubPage,
  tourTangerFez45:               TangerFez45Page,
  tourTangerFez56:               TangerFez56Page,
  tourFezTanger56:               FezTanger56Page,
  tourFezTanger67:               FezTanger67Page,

  // Tier 2/3 desert programs
  tourDesiertoAtlas67:           DesiertoAtlas67Page,
  tourDesiertoAtlas56:           DesiertoAtlas56Page,
  tourDesiertoAtlas45:           DesiertoAtlas45Page,
  tourAtlasDesierto45:           AtlasDesierto45Page,
  tourAtlasDesierto56:           AtlasDesierto56Page,
  tourAtlasDesierto67:           AtlasDesierto67Page,
  tourMarrakechErg45:            MarrakechErg45Page,
  tourMarrakechErg56:            MarrakechErg56Page,
  tourMarrakechErg67:            MarrakechErg67Page,
  tourMarrakechErg78:            MarrakechErg78Page,
  tourErgMarrakech67:            ErgMarrakech67Page,
  tourErgMarrakech78:            ErgMarrakech78Page,
  tourErgMarrakech45:            ErgMarrakech45Page,
  tourErgMarrakech56:            ErgMarrakech56Page,
  tourMarrakechLoop23:           MarrakechLoop23Page,
  tourEscapadaRakErgRak23:       MarrakechLoop23Page,     // alias → same component
  tourMarrakechLoop34:           MarrakechLoop34Page,
  tourEscapadaRakErgRak34:       MarrakechLoop34Page,     // alias
  tourMarrakechLoop45:           MarrakechLoop45Page,
  tourEscapadaRakErgRak45:       MarrakechLoop45Page,     // alias
  tourMarrakechLoop56:           MarrakechLoop56Page,
  tourMarrakechLoop67:           MarrakechLoop67Page,
  tourMarrakechLoop78:           MarrakechLoop78Page,

  // Editorial / utility
  planTrip:                      PlanificaTuViajePage,
  planner:                       PlannerPage,
  tourUpcoming:                  ProximasSalidasPage,
  whenToTravel:                  WhenToTravelPage,
  whatToSee:                     QueVerEnMarruecosPage,
  whatWeDo:                      QueHacemosPage,
  events:                        IncentivosPage,
  morocco:                       MoroccoLandingPage,
  about:                         EquipoPage,
  blog:                          BlogPage,
  contact:                       ContactPage,
  appointment:                   CitaPreviaPage,
  juego:                         JuegoPage,
  concurso:                      ConcursoPage,
  galeria:                       GaleriaPage,
  precios:                       PreciosPage,
  opiniones:                     OpinionesPage,
  vuelos:                        VuelosPage,
  asistente:                     AsistentePage,
  favorites:                     FavoritosPage,
  fastTrack:                     FastTrackPage,
  feedback:                      FeedbackPage,
};
