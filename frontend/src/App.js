import React, { useEffect } from "react";
import "@/App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import StubPage from "@/pages/StubPage";
import { ROUTES, SUPPORTED_LANGS, DEFAULT_LANG, resolvePath } from "@/lib/routes";

/**
 * Resolves the current pathname to a routeId and renders the right page.
 * If the lang prefix is missing, redirects to /<DEFAULT_LANG>/.
 */
const LocalizedRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, routeId, slug } = resolvePath(location.pathname);

  // 1. No lang prefix at all → redirect to default lang
  useEffect(() => {
    if (!lang) {
      navigate(`/${DEFAULT_LANG}${location.pathname === "/" ? "" : location.pathname}${location.search}`, { replace: true });
    }
  }, [lang, location.pathname, location.search, navigate]);

  if (!lang) return null;

  // 2. Lang + empty slug = home
  if (routeId === "home") return <HomePage />;

  // 3. Known routeId → StubPage
  if (routeId) return <StubPage routeId={routeId} />;

  // 4. Unknown slug under a known lang → redirect to home of that lang
  return <Navigate to={`/${lang}`} replace />;
};

function App() {
  // Build a flat list of every (lang, slug) combination so React Router
  // recognises them. We render a single LocalizedRouter for all of them
  // which actually resolves the routeId from the pathname.
  const allPaths = SUPPORTED_LANGS.flatMap((l) =>
    Object.values(ROUTES).map((slugs) => {
      const slug = slugs[l];
      return slug ? `/${l}/${slug}` : `/${l}`;
    })
  );

  return (
    <div className="App">
      <BrowserRouter>
        <LanguageProvider>
          <Layout>
            <Routes>
              {/* Root → default language */}
              <Route path="/" element={<Navigate to={`/${DEFAULT_LANG}`} replace />} />

              {/* Every known lang+slug combination */}
              {allPaths.map((p) => (
                <Route key={p} path={p} element={<LocalizedRouter />} />
              ))}

              {/* Lang root with no slug */}
              {SUPPORTED_LANGS.map((l) => (
                <Route key={l} path={`/${l}`} element={<LocalizedRouter />} />
              ))}

              {/* Catch-all under a lang prefix */}
              {SUPPORTED_LANGS.map((l) => (
                <Route key={`${l}-catch`} path={`/${l}/*`} element={<LocalizedRouter />} />
              ))}

              {/* Anything else */}
              <Route path="*" element={<LocalizedRouter />} />
            </Routes>
          </Layout>
        </LanguageProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
