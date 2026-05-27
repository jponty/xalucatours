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
import MarrakechErg67Page from "@/pages/MarrakechErg67Page";
import MarrakechErg78Page from "@/pages/MarrakechErg78Page";
import ErgMarrakech67Page from "@/pages/ErgMarrakech67Page";
import ErgMarrakech78Page from "@/pages/ErgMarrakech78Page";
import MarrakechLoop23Page from "@/pages/MarrakechLoop23Page";
import MarrakechLoop34Page from "@/pages/MarrakechLoop34Page";
import MarrakechLoop45Page from "@/pages/MarrakechLoop45Page";
import MarrakechErgChebbiMarrakechHubPage from "@/pages/MarrakechErgChebbiMarrakechHubPage";
import MarrakechEssaouiraHubPage from "@/pages/MarrakechEssaouiraHubPage";
import GransurFezRakHubPage from "@/pages/GransurFezRakHubPage";
import GransurFezSidialiRakHubPage from "@/pages/GransurFezSidialiRakHubPage";
import GransurOuarzaFezHubPage from "@/pages/GransurOuarzaFezHubPage";
import GransurTangerRakHubPage from "@/pages/GransurTangerRakHubPage";
import FezMarrakech910Page from "@/pages/FezMarrakech910Page";
import MarrakechFez67Page from "@/pages/MarrakechFez67Page";
import MarrakechFez78Page from "@/pages/MarrakechFez78Page";
import MarrakechFez89Page from "@/pages/MarrakechFez89Page";
import MarrakechFez910Page from "@/pages/MarrakechFez910Page";
import {
  EscapadaDesierto34Page,
  EscapadaAtlas34Page,
  EscapadaFezPage,
  EscapadaMarrakechPage,
  EscapadaTangerPage,
} from "@/pages/EscapadaIntroPages";
import NorteCiudadesImperialesHubPage from "@/pages/NorteCiudadesImperialesHubPage";
import NorteTangerFezHubPage from "@/pages/NorteTangerFezHubPage";
import CiudadesImperiales45Page from "@/pages/CiudadesImperiales45Page";
import CiudadesImperialesRif67Page from "@/pages/CiudadesImperialesRif67Page";
import TangerFez45Page from "@/pages/TangerFez45Page";
import TangerFez56Page from "@/pages/TangerFez56Page";
import FezTanger56Page from "@/pages/FezTanger56Page";
import FezTanger67Page from "@/pages/FezTanger67Page";
import PlanificaTuViajePage from "@/pages/PlanificaTuViajePage";
import ProximasSalidasPage from "@/pages/ProximasSalidasPage";
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
  if (routeId === "tourShort")     return <EscapadasPage />;
  if (routeId === "tourBespoke")   return <ViajesAMedidaPage />;
  if (routeId === "tourAtlasDesiertoHub") return <AtlasDesiertoHubPage />;
  if (routeId === "tourMarrakechErgHub")  return <MarrakechErgChebbiHubPage />;
  if (routeId === "tourErgChebbiMarrakechHub") return <ErgChebbiMarrakechHubPage />;
  if (routeId === "tourMarrakechLoopHub") return <MarrakechErgChebbiMarrakechHubPage />;
  if (routeId === "tourMarrakechEssHub")  return <MarrakechEssaouiraHubPage />;
  if (routeId === "tourGransurFezRak")     return <GransurFezRakHubPage />;
  if (routeId === "tourGransurFezSidiali") return <GransurFezSidialiRakHubPage />;
  if (routeId === "tourGransurOuarzaFez")  return <GransurOuarzaFezHubPage />;
  if (routeId === "tourGransurTangerRak")  return <GransurTangerRakHubPage />;
  if (routeId === "tourFezRak910")         return <FezMarrakech910Page />;
  if (routeId === "tourMarrakechFez67")    return <MarrakechFez67Page />;
  if (routeId === "tourMarrakechFez78")    return <MarrakechFez78Page />;
  if (routeId === "tourMarrakechFez89")    return <MarrakechFez89Page />;
  if (routeId === "tourMarrakechFez910")   return <MarrakechFez910Page />;
  if (routeId === "tourEscapadaDesierto34") return <EscapadaDesierto34Page />;
  if (routeId === "tourEscapadaAtlas34")    return <EscapadaAtlas34Page />;
  if (routeId === "tourEscapadaFez")        return <EscapadaFezPage />;
  if (routeId === "tourEscapadaMarrakech")  return <EscapadaMarrakechPage />;
  if (routeId === "tourEscapadaTanger")     return <EscapadaTangerPage />;
  if (routeId === "tourNorteCiudadesImperiales") return <NorteCiudadesImperialesHubPage />;
  if (routeId === "tourCiudadesImperiales45")    return <CiudadesImperiales45Page />;
  if (routeId === "tourCiudadesImperialesRif67") return <CiudadesImperialesRif67Page />;
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
  if (routeId === "tourMarrakechErg67")   return <MarrakechErg67Page />;
  if (routeId === "tourMarrakechErg78")   return <MarrakechErg78Page />;
  if (routeId === "tourErgMarrakech67")   return <ErgMarrakech67Page />;
  if (routeId === "tourErgMarrakech78")   return <ErgMarrakech78Page />;
  if (routeId === "tourMarrakechLoop23")  return <MarrakechLoop23Page />;
  if (routeId === "tourMarrakechLoop34")  return <MarrakechLoop34Page />;
  if (routeId === "tourMarrakechLoop45")  return <MarrakechLoop45Page />;
  if (routeId === "tourUpcoming")  return <ProximasSalidasPage />;
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
