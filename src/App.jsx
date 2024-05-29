import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CharacterDetails from "./pages/CharacterDetails";
import CharacterSelect from "./pages/CharacterSelect";
import Navbar from "./components/NavBar";
import About from "./pages/About";
import UpdateRequest from "./pages/UpdateRequest";
import CustomComboPage from "./pages/CustomComboPage";

import "./App.css";
import Footer from "./components/Footer";
import { Box } from "@mui/material";
import AntiGuideSelect from "./pages/AntiGuideSelect";
import KomradEasterEgg from "./pages/KomradEasterEgg";
import NotFoundPage from "./pages/NotFoundPage";
import Credits from "./pages/Credits";
import FAQ from "./pages/FAQ";
import News from "./pages/News";
import AntiCharDetails from "./pages/AntiCharDetails";

const App = () => {
  return (
    <BrowserRouter>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, minHeight: "100vh" }}>
          <Routes>
            <Route path="/" element={<CharacterSelect />} />
            <Route
              path="/character/combos/:characterName/:characterId"
              element={<CharacterDetails />}
            />
            <Route path="/combo-generator" element={<CustomComboPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/update-request" element={<UpdateRequest />} />
            <Route path="/anti-guide" element={<AntiGuideSelect />} />
            <Route path="/anti-guide/character/:characterId" element={<AntiCharDetails />} />
            <Route path="/faqu" element={<FAQ />} />
            <Route path="/news" element={<News />} />
            <Route
              path="/nothing-here/for-sure/no-easter-egg"
              element={<KomradEasterEgg />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
};

export default App;
