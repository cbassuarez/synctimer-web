import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import Home from './pages/Home';
import Features from './pages/Features';
import Sync from './pages/Sync';
import CueSheets from './pages/CueSheets';
import AppClip from './pages/AppClip';
import Support from './pages/Support';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Press from './pages/Press';
import QrTool from './pages/QrTool';

const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="page-transition"
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={pageTransition.transition}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="app">
      <SiteHeader />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/features"
            element={
              <PageTransition>
                <Features />
              </PageTransition>
            }
          />
          <Route
            path="/sync"
            element={
              <PageTransition>
                <Sync />
              </PageTransition>
            }
          />
          <Route
            path="/cue-sheets"
            element={
              <PageTransition>
                <CueSheets />
              </PageTransition>
            }
          />
          <Route
            path="/app-clip"
            element={
              <PageTransition>
                <AppClip />
              </PageTransition>
            }
          />
          <Route
            path="/support"
            element={
              <PageTransition>
                <Support />
              </PageTransition>
            }
          />
          <Route
            path="/privacy"
            element={
              <PageTransition>
                <Privacy />
              </PageTransition>
            }
          />
          <Route
            path="/terms"
            element={
              <PageTransition>
                <Terms />
              </PageTransition>
            }
          />
          <Route
            path="/press"
            element={
              <PageTransition>
                <Press />
              </PageTransition>
            }
          />
          <Route
            path="/qr/*"
            element={
              <PageTransition>
                <QrTool />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
      <SiteFooter />
    </div>
  );
}
