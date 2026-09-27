import { lazy, Suspense, useEffect } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
const MapPage = lazy(() =>
  import("./pages/MapPage").then((m) => ({ default: m.MapPage })),
);
const CountyReportPage = lazy(() =>
  import("./pages/CountyReportPage").then((m) => ({
    default: m.CountyReportPage,
  })),
);
const ResourcesPage = lazy(() =>
  import("./pages/ResourcesPage").then((m) => ({ default: m.ResourcesPage })),
);
const AboutPage = lazy(() =>
  import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const SourcesPage = lazy(() =>
  import("./pages/InformationPage").then((m) => ({ default: m.SourcesPage })),
);
const PrivacyPage = lazy(() =>
  import("./pages/InformationPage").then((m) => ({ default: m.PrivacyPage })),
);
const TermsPage = lazy(() =>
  import("./pages/InformationPage").then((m) => ({ default: m.TermsPage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/InformationPage").then((m) => ({ default: m.NotFoundPage })),
);
function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
    document.title = `${pathname.startsWith("/report/") ? "County report" : { "/": "Maryland community safety", "/map": "County data", "/resources": "Find support", "/about": "Our project", "/sources": "Sources & methodology", "/privacy": "Privacy", "/terms": "Terms" }[pathname] || "Page not found"} | Silence the Violence`;
  }, [pathname, hash]);
  return null;
}
function App() {
  return (
    <HashRouter>
      <RouteEffects />
      <Layout>
        <Suspense
          fallback={
            <div className="shell section-space" role="status">
              Loading page…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/report/:countyId" element={<CountyReportPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/sources" element={<SourcesPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </HashRouter>
  );
}
export default App;
