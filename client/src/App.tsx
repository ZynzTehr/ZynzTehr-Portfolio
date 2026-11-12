import React, { Suspense, lazy } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import { loadHome } from "./lib/loadHome";

// Act I to III (three.js globe, carousel, index, coda) load as their own chunk.
// The prologue prefetches it while its beats play, so Launch never waits.
const Home = lazy(loadHome);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="min-h-svh w-full" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;
