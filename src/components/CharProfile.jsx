import React from "react";

import "./CharProfile.css";
import { Link, Tooltip } from "@mui/material";

const CharProfile = ({ pic, name }) => {
  return (
    <div className="char-profile combo-section">
      <h1 id="char-name">{name}</h1>

      <img id="char-pic" src={pic} alt={name} />
    </div>
  );
};

export default CharProfile;
