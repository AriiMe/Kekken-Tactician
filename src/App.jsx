import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CharacterDetails from "./pages/CharacterDetails";
import CharacterSelect from "./pages/CharacterSelect";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CharacterSelect />} />
        <Route path="/character/:characterId" element={<CharacterDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
