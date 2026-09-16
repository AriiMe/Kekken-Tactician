import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import GameLibrary from "./pages/GameLibrary";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import PrivacyNotice from "./components/PrivacyNotice";
import ScrollToTop from "./components/ScrollToTop";

import "./App.css";

const About = lazy(() => import("./pages/About"));
const AntiCharDetails = lazy(() => import("./pages/AntiCharDetails"));
const AntiGuideSelect = lazy(() => import("./pages/AntiGuideSelect"));
const CharacterDetails = lazy(() => import("./pages/CharacterDetails"));
const CharacterSelect = lazy(() => import("./pages/CharacterSelect"));
const Credits = lazy(() => import("./pages/Credits"));
const CustomComboPage = lazy(() => import("./pages/CustomComboPage"));
const FAQ = lazy(() => import("./pages/FAQ"));
const KomradEasterEgg = lazy(() => import("./pages/KomradEasterEgg"));
const News = lazy(() => import("./pages/News"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const Privacy = lazy(() => import("./pages/Privacy"));
const StatsPage = lazy(() => import("./pages/StatsPage"));
const StratContent = lazy(() => import("./pages/StratConent"));
const StratRoulette = lazy(() => import("./pages/StratRoulette"));
const UpdateRequest = lazy(() => import("./pages/UpdateRequest"));

function RouteFallback() {
  return (
    <div className="route-loading" role="status">
      <span /> Loading the lab…
    </div>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-shell">
        <Navbar />
        <div className="app-shell__content">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<GameLibrary />} />
              <Route path="/games/tekken-8" element={<CharacterSelect />} />
              <Route
                path="/tekken-8"
                element={<Navigate to="/games/tekken-8" replace />}
              />
              <Route
                path="/character/combos/:characterName/:characterId"
                element={<CharacterDetails />}
              />
              <Route path="/combo-generator" element={<CustomComboPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/update-request" element={<UpdateRequest />} />
              <Route path="/anti-guide" element={<AntiGuideSelect />} />
              <Route
                path="/anti-guide/character/:characterId"
                element={<AntiCharDetails />}
              />
              <Route path="/strat-roulette" element={<StratRoulette />} />
              <Route path="/strat-content" element={<StratContent />} />
              <Route path="/faqu" element={<FAQ />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/news" element={<News />} />
              <Route
                path="/nothing-here/for-sure/no-easter-egg"
                element={<KomradEasterEgg />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
        <PrivacyNotice />
      </div>
    </BrowserRouter>
  );
};

export default App;
