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
import MarrakechErgChebbiMarrakechHubPage from "@/pages/MarrakechErgChebbiMarrakechHubPage";
import MarrakechEssaouiraHubPage from "@/pages/MarrakechEssaouiraHubPage";
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
  if (routeId === "tourMarrakechLoopHub") return <MarrakechErgChebbiMarrakechHubPage />;
  if (routeId === "tourMarrakechEssHub")  return <MarrakechEssaouiraHubPage />;
  if (routeId === "tourDesiertoAtlas67")  return <DesiertoAtlas67Page />;
  if (routeId === "tourDesiertoAtlas56")  return <DesiertoAtlas56Page />;
  if (routeId === "tourDesiertoAtlas45")  return <DesiertoAtlas45Page />;
  if (routeId === "tourAtlasDesierto45")  return <AtlasDesierto45Page />;
  if (routeId === "tourAtlasDesierto56")  return <AtlasDesierto56Page />;
  if (routeId === "tourAtlasDesierto67")  return <AtlasDesierto67Page />;
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
          <Layout>
            <Routes>
              <Route path="*" element={<LocalizedRouter />} />
            </Routes>
          </Layout>
        </LanguageProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
