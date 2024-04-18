import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CharacterDetails from "./pages/CharacterDetails";
import CharacterSelect from "./pages/CharacterSelect";
import Navbar from "./components/NavBar";
import About from "./pages/About";
import UpdateRequest from "./pages/UpdateRequest";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CharacterSelect />} />
        <Route path="/character/:characterId" element={<CharacterDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/update-request" element={<UpdateRequest />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
