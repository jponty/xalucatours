import React from "react";
import "@/App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { EditModeProvider } from "@/contexts/EditModeContext";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import StubPage from "@/pages/StubPage";
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
import ProximasSalidasPage from "@/pages/ProximasSalidasPage";
import WhenToTravelPage from "@/pages/WhenToTravelPage";
import QueVerEnMarruecosPage from "@/pages/QueVerEnMarruecosPage";
import QueHacemosPage from "@/pages/QueHacemosPage";
import IncentivosPage from "@/pages/IncentivosPage";
import MoroccoLandingPage from "@/pages/MoroccoLandingPage";
import { resolvePath, pathFor } from "@/lib/routes";

/**
 * Single resolver — reads the current pathname and renders the right page.
 * Spanish lives at the root (no /es/ prefix). EN/FR live under /en/* and /fr/*.
 */
const LocalizedRouter = () => {
  const location = useLocation();
  const { lang, routeId } = resolvePath(location.pathname);

  if (routeId === "home")          return <HomePage />;
  if (routeId === "toursLanding")  return <ToursLandingPage />;
  if (routeId === "catalog")       return <ToursLandingPage />;   // /catalogo alias of /viajes
  if (routeId === "tourFull")      return <MarruecosPage />;
  if (routeId === "tourNorth")     return <NortePage />;
  if (routeId === "tourSouth")     return <SurPage />;
  if (routeId === "tourAdventure") return <AventuraPage />;
  if (routeId === "tourAventuraEnduroHub") return <AventuraEnduroHubPage />;
  if (routeId === "tourEnduroAventura45")  return <EnduroAventura45Page />;
  if (routeId === "tourEnduroAventura67")  return <EnduroAventura67Page />;
  if (routeId === "tourFinDeAno2025")      return <FinDeAno2026Page />;
  if (routeId === "tourShort")     return <EscapadasPage />;
  if (routeId === "tourBespoke")   return <ViajesAMedidaPage />;
  if (routeId === "tourAtlasDesiertoHub") return <AtlasDesiertoHubPage />;
  if (routeId === "tourMarrakechErgHub")  return <MarrakechErgChebbiHubPage />;
  if (routeId === "tourErgChebbiMarrakechHub") return <ErgChebbiMarrakechHubPage />;
  if (routeId === "tourMarrakechLoopHub") return <MarrakechErgChebbiMarrakechHubPage />;
  if (routeId === "tourMarrakechEssHub")  return <MarrakechEssaouiraHubPage />;
  if (routeId === "tourMarrakechEss45")   return <MarrakechEssaouira45Page />;
  if (routeId === "tourMarrakechEss67")   return <MarrakechEssaouira67Page />;
  if (routeId === "tourErrAtlasFezHub")   return <ErrachidiaAtlasFezHubPage />;
  if (routeId === "tourFezAtlasErr56")    return <FezAtlasErrachidia56Page />;
  if (routeId === "tourDesiertoAtlasHub") return <DesiertoAtlasHubPage />;
  if (routeId === "tourGransurFezRak")     return <GransurFezRakHubPage />;
  if (routeId === "tourGransurFezSidiali") return <GransurFezSidialiRakHubPage />;
  if (routeId === "tourGransurOuarzaFez")  return <GransurOuarzaFezHubPage />;
  if (routeId === "tourGransurTangerRak")  return <GransurTangerRakHubPage />;
  if (routeId === "tourFezRak910")         return <FezMarrakech910Page />;
  if (routeId === "tourFezRak89")          return <FezMarrakech89Page />;
  if (routeId === "tourFezRak78")          return <FezMarrakech78Page />;
  if (routeId === "tourFezSidialiRak78")   return <FezSidialiMarrakech78Page />;
  if (routeId === "tourFezSidialiRak89")   return <FezSidialiMarrakech89Page />;
  if (routeId === "tourFezSidialiRak910")  return <FezSidialiMarrakech910Page />;
  if (routeId === "tourAtlasDesiertoFezHub") return <AtlasDesiertoFezHubPage />;
  if (routeId === "tourGransurRakFezHub")  return <GransurRakFezHubPage />;
  if (routeId === "tourTangerRak89")       return <TangerRak89Page />;
  if (routeId === "tourTangerRak910")      return <TangerRak910Page />;
  if (routeId === "tourFezSidialiOzz56")   return <FezSidialiOuarzazate56Page />;
  if (routeId === "tourFezSidialiOzz67")   return <FezSidialiOuarzazate67Page />;
  if (routeId === "tourFezSidialiOzz78")   return <FezSidialiOuarzazate78Page />;
  if (routeId === "tourOzzSidialiFez56")   return <OuarzazateSidialiFez56Page />;
  if (routeId === "tourOzzSidialiFez67")   return <OuarzazateSidialiFez67Page />;
  if (routeId === "tourOzzSidialiFez78")   return <OuarzazateSidialiFez78Page />;
  if (routeId === "tourFezRak67")          return <FezMarrakech67Page />;
  if (routeId === "tourMarrakechFez67")    return <MarrakechFez67Page />;
  if (routeId === "tourMarrakechFez78")    return <MarrakechFez78Page />;
  if (routeId === "tourMarrakechFez89")    return <MarrakechFez89Page />;
  if (routeId === "tourMarrakechFez910")   return <MarrakechFez910Page />;
  if (routeId === "tourMarrakechSidialiFez78")  return <MarrakechSidialiFez78Page />;
  if (routeId === "tourMarrakechSidialiFez89")  return <MarrakechSidialiFez89Page />;
  if (routeId === "tourMarrakechSidialiFez910") return <MarrakechSidialiFez910Page />;
  if (routeId === "tourEscapadaDesierto34") return <EscapadaDesierto34Page />;
  if (routeId === "tourEscapadaAtlas34")    return <EscapadaAtlas34Page />;
  if (routeId === "tourEscapadaFez")        return <EscapadaFezPage />;
  if (routeId === "tourEscapadaFez23")      return <EscapadaFez23Page />;
  if (routeId === "tourEscapadaFez34")      return <EscapadaFez34Page />;
  if (routeId === "tourEscapadaFezSidiali34") return <EscapadaFezSidiali34Page />;
  if (routeId === "tourEscapadaFezSidiali45") return <EscapadaFezSidiali45Page />;
  if (routeId === "tourEscapadaMarrakech")  return <EscapadaMarrakechPage />;
  if (routeId === "tourEscapadaMarrakech23")return <EscapadaMarrakech23Page />;
  if (routeId === "tourEscapadaRakAgafay34")return <EscapadaRakAgafay34Page />;
  if (routeId === "tourEscapadaRakErgRakHub")return <EscapadaRakErgRakHubPage />;
  if (routeId === "tourEscapadaTanger")     return <EscapadaTangerPage />;
  if (routeId === "tourNorteCiudadesImperiales") return <NorteCiudadesImperialesHubPage />;
  if (routeId === "tourCiudadesImperiales45")    return <CiudadesImperiales45Page />;
  if (routeId === "tourCiudadesImperiales67")    return <CiudadesImperiales67Page />;
  if (routeId === "tourCiudadesImperialesRif67") return <CiudadesImperialesRif67Page />;
  if (routeId === "tourCiudadesImperialesRif78") return <CiudadesImperialesRif78Page />;
  if (routeId === "tourNorteTangerFez")          return <NorteTangerFezHubPage />;
  if (routeId === "tourTangerFez45")             return <TangerFez45Page />;
  if (routeId === "tourTangerFez56")             return <TangerFez56Page />;
  if (routeId === "tourFezTanger56")             return <FezTanger56Page />;
  if (routeId === "tourFezTanger67")             return <FezTanger67Page />;
  if (routeId === "planTrip")                    return <PlanificaTuViajePage />;
  if (routeId === "tourDesiertoAtlas67")  return <DesiertoAtlas67Page />;
  if (routeId === "tourDesiertoAtlas56")  return <DesiertoAtlas56Page />;
  if (routeId === "tourDesiertoAtlas45")  return <DesiertoAtlas45Page />;
  if (routeId === "tourAtlasDesierto45")  return <AtlasDesierto45Page />;
  if (routeId === "tourAtlasDesierto56")  return <AtlasDesierto56Page />;
  if (routeId === "tourAtlasDesierto67")  return <AtlasDesierto67Page />;
  if (routeId === "tourMarrakechErg45")   return <MarrakechErg45Page />;
  if (routeId === "tourMarrakechErg56")   return <MarrakechErg56Page />;
  if (routeId === "tourMarrakechErg67")   return <MarrakechErg67Page />;
  if (routeId === "tourMarrakechErg78")   return <MarrakechErg78Page />;
  if (routeId === "tourErgMarrakech67")   return <ErgMarrakech67Page />;
  if (routeId === "tourErgMarrakech78")   return <ErgMarrakech78Page />;
  if (routeId === "tourErgMarrakech45")   return <ErgMarrakech45Page />;
  if (routeId === "tourErgMarrakech56")   return <ErgMarrakech56Page />;
  if (routeId === "tourMarrakechLoop23")  return <MarrakechLoop23Page />;
  if (routeId === "tourEscapadaRakErgRak23") return <MarrakechLoop23Page />;
  if (routeId === "tourMarrakechLoop34")  return <MarrakechLoop34Page />;
  if (routeId === "tourEscapadaRakErgRak34") return <MarrakechLoop34Page />;
  if (routeId === "tourMarrakechLoop45")  return <MarrakechLoop45Page />;
  if (routeId === "tourEscapadaRakErgRak45") return <MarrakechLoop45Page />;
  if (routeId === "tourMarrakechLoop56")  return <MarrakechLoop56Page />;
  if (routeId === "tourMarrakechLoop67")  return <MarrakechLoop67Page />;
  if (routeId === "tourMarrakechLoop78")  return <MarrakechLoop78Page />;
  if (routeId === "tourUpcoming")  return <ProximasSalidasPage />;
  if (routeId === "whenToTravel")  return <WhenToTravelPage />;
  if (routeId === "whatToSee")     return <QueVerEnMarruecosPage />;
  if (routeId === "whatWeDo")      return <QueHacemosPage />;
  if (routeId === "events")        return <IncentivosPage />;
  if (routeId === "morocco")       return <MoroccoLandingPage />;
  if (routeId)                     return <StubPage routeId={routeId} />;

  // Unknown URL within a known lang → redirect to home of that lang
  return <Navigate to={pathFor(lang, "home")} replace />;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <LanguageProvider>
          <EditModeProvider>
            <Layout>
              <Routes>
                <Route path="*" element={<LocalizedRouter />} />
              </Routes>
            </Layout>
          </EditModeProvider>
        </LanguageProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
