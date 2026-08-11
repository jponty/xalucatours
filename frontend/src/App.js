import React, { useEffect } from "react";
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
import { AdminSessionProvider } from "@/contexts/AdminSessionContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import Layout from "@/components/Layout";
import StubPage from "@/pages/StubPage";
import AdminPage from "@/pages/AdminPage";
import { BlogPostPage } from "@/pages/BlogPage";
import { resolvePath, pathFor } from "@/lib/routes";
import { ROUTE_COMPONENTS } from "@/lib/routeComponents";
import SeoHead from "@/components/SeoHead";
import { getSeoMeta } from "@/lib/seoMeta";
import { seoImageForRoute } from "@/lib/seoImages";

/**
 * Single resolver — reads the current pathname and renders the right page.
 * Spanish lives at the root (no /es/ prefix). EN/FR live under /en/* and /fr/*.
 * Route → component mapping lives in `lib/routeComponents.js`.
 */
const LocalizedRouter = () => {
  const location = useLocation();
  const { lang, routeId } = resolvePath(location.pathname);

  // On route change, land at the top of the page unless the URL targets a
  // specific in-page anchor (#hash). Guarantees /contacto (and others) open
  // from the start rather than a previously scrolled position.
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  // Blog post: dynamic slug under /blog/:slug · /en/blog/:slug · /fr/blog/:slug
  // (resolvePath only matches exact slugs; we handle the post route manually.)
  // BlogPostPage injects its own SeoHead, so return it directly.
  const blogMatch = location.pathname.match(/^\/(?:(en|fr)\/)?blog\/([^/?#]+)\/?$/);
  if (blogMatch) return <BlogPostPage />;

  const Component = ROUTE_COMPONENTS[routeId];
  if (!Component && !routeId) {
    // Unknown URL within a known lang → redirect to home of that lang
    return <Navigate to={pathFor(lang, "home")} replace />;
  }

  // Per-page SEO: title + description + canonical + hreflang + a branded,
  // content-specific 1200x630 social image for every resolved page.
  const meta = getSeoMeta(routeId, lang);
  const hreflang = routeId
    ? { es: pathFor("es", routeId), en: pathFor("en", routeId), fr: pathFor("fr", routeId) }
    : undefined;

  return (
    <>
      <SeoHead
        title={meta.title}
        description={meta.description}
        image={seoImageForRoute(routeId)}
        lang={lang}
        hreflang={hreflang}
      />
      {Component ? <Component /> : <StubPage routeId={routeId} />}
    </>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <LanguageProvider>
          <FavoritesProvider>
            <AdminSessionProvider>
              <EditModeProvider>
              <Routes>
                <Route path="/admin" element={<AdminPage />} />
                <Route
                  path="*"
                  element={
                    <Layout>
                      <Routes>
                        <Route path="*" element={<LocalizedRouter />} />
                      </Routes>
                    </Layout>
                  }
                />
              </Routes>
              </EditModeProvider>
            </AdminSessionProvider>
          </FavoritesProvider>
        </LanguageProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
