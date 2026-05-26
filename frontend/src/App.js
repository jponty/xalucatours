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
