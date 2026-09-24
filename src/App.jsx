import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PageSeo from './components/PageSeo';
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
const ClassicTekken = lazy(() => import("./pages/ClassicTekken"));
const Tekken7 = lazy(() => import("./pages/Tekken7"));
const TekkenTag2 = lazy(() => import("./pages/TekkenTag2"));
const Credits = lazy(() => import("./pages/Credits"));
const CustomComboPage = lazy(() => import("./pages/CustomComboPage"));
const FAQ = lazy(() => import("./pages/FAQ"));
const KomradEasterEgg = lazy(() => import("./pages/KomradEasterEgg"));
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
    <>
      <PageSeo />
      <ScrollToTop />
      <div className="app-shell">
        <Navbar />
        <div className="app-shell__content">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<GameLibrary />} />
              <Route path="/games/tekken-8" element={<CharacterSelect />} />
              <Route path="/games/tekken-7" element={<Tekken7 />} />
              <Route path="/games/tekken-7/:characterSlug" element={<Tekken7 />} />
              <Route path="/games/tekken-tag-2" element={<TekkenTag2 />} />
              <Route path="/games/tekken-tag-2/:characterSlug" element={<TekkenTag2 />} />
              <Route path="/tekken-tag-2" element={<Navigate to="/games/tekken-tag-2" replace />} />
              <Route path="/tekken-7" element={<Navigate to="/games/tekken-7" replace />} />
              <Route path="/games/tekken-3" element={<ClassicTekken key="tekken-3" gameId="tekken-3" />} />
              <Route path="/games/tekken-3/:characterSlug" element={<ClassicTekken key="tekken-3" gameId="tekken-3" />} />
              <Route path="/tekken-3" element={<Navigate to="/games/tekken-3" replace />} />
              <Route path="/games/tekken-4" element={<ClassicTekken key="tekken-4" gameId="tekken-4" />} />
              <Route path="/games/tekken-tag-1" element={<ClassicTekken key="tekken-tag-1" gameId="tekken-tag-1" />} />
              <Route path="/games/tekken-tag-1/:characterSlug" element={<ClassicTekken key="tekken-tag-1" gameId="tekken-tag-1" />} />
              <Route path="/tekken-tag-1" element={<Navigate to="/games/tekken-tag-1" replace />} />
              <Route path="/games/tekken-4/:characterSlug" element={<ClassicTekken key="tekken-4" gameId="tekken-4" />} />
              <Route path="/tekken-4" element={<Navigate to="/games/tekken-4" replace />} />
              <Route path="/games/tekken-5" element={<ClassicTekken key="tekken-5" gameId="tekken-5" />} />
              <Route path="/games/tekken-5/:characterSlug" element={<ClassicTekken key="tekken-5" gameId="tekken-5" />} />
              <Route path="/tekken-5" element={<Navigate to="/games/tekken-5" replace />} />
              <Route path="/games/tekken-6" element={<ClassicTekken key="tekken-6" gameId="tekken-6" />} />
              <Route path="/games/tekken-6/:characterSlug" element={<ClassicTekken key="tekken-6" gameId="tekken-6" />} />
              <Route path="/tekken-6" element={<Navigate to="/games/tekken-6" replace />} />
              <Route path="/games/tekken-1" element={<ClassicTekken key="tekken-1" gameId="tekken-1" />} />
              <Route path="/games/tekken-1/:characterSlug" element={<ClassicTekken key="tekken-1" gameId="tekken-1" />} />
              <Route path="/tekken-1" element={<Navigate to="/games/tekken-1" replace />} />
              <Route path="/games/tekken-2" element={<ClassicTekken key="tekken-2" gameId="tekken-2" />} />
              <Route path="/games/tekken-2/:characterSlug" element={<ClassicTekken key="tekken-2" gameId="tekken-2" />} />
              <Route path="/tekken-2" element={<Navigate to="/games/tekken-2" replace />} />
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
    </>
  );
};

export default App;
