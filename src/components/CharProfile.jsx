import React from "react";

import "./CharProfile.css";
import { Link, Tooltip } from "@mui/material";

const CharProfile = ({ pic, name }) => {
  if (name == "King II") {
    console.log("issa king C:");
  } else {
    console.log("not king :C");
  }
  return (
    <div className="char-profile combo-section">
      <h1 id="char-name">{name}</h1>

      {name === "King II" ? (
        <Tooltip title="Art by @SkyCrimeDraws" placement="bottom">
          <Link
            href="https://twitter.com/SkyCrimeDraws"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img id="char-pic" src={pic} alt={name} />
          </Link>
        </Tooltip>
      ) : (
        <img id="char-pic" src={pic} alt={name} />
      )}
    </div>
  );
};

export default CharProfile;
