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

const App = () => {
  return (
    <BrowserRouter>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Navbar />
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<CharacterSelect />} />
            <Route
              path="/character/combos/:characterName/:characterId"
              element={<CharacterDetails />}
            />
            <Route path="/combo-generator" element={<CustomComboPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/update-request" element={<UpdateRequest />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </BrowserRouter>
  );
};

export default App;
