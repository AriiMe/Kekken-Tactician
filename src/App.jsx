import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CharacterDetails from "./pages/CharacterDetails";
import CharacterSelect from "./pages/CharacterSelect";
import Navbar from "./components/NavBar";
import About from "./pages/About";
import UpdateRequest from "./pages/UpdateRequest";
import CustomComboPage from "./pages/CustomComboPage";
import Yoshi from "./pages/Yoshi";

import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CharacterSelect />} />
        <Route
          path="/character/:characterName/:characterId"
          element={<CharacterDetails />}
        />
        <Route path="/custom" element={<CustomComboPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/update-request" element={<UpdateRequest />} />
        <Route path="/yoshi" element={<Yoshi />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
