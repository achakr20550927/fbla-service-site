import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { MapPage } from './pages/MapPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { CountyReportPage } from './pages/CountyReportPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/report/:countyId" element={<CountyReportPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
