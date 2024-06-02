import { Box, Paper, styled } from "@mui/material";
import CollapsableSection from "./CollapsableSection";
import { useState } from "react";
import renderInputImage from "../utils/renderInputImage";
import { BorderLeft } from "@mui/icons-material";

const KeyMoveContainer = styled(Box)(({ theme }) => ({
  marginBottom: "4rem",
  "& .moveNotation": {
    background: "#222",
    borderLeft: "4px solid #d42f2f",
    padding: "1.5rem 2rem",
    maxWidth: "90%",
  },
  "& .moveFramesTitle, & .moveCounterTitle": {
    color: "#d42f2f",
    display: "block",
    fontSize: "1.2rem",
    marginBottom: "1.1em",
  },
  "& .moveFramesContent, & .moveCounterContent": {
    fontFamily: "Inter",
    fontSize: "1.2rem",
    marginBottom: "1.5em",
    display: "block",
  },
}));

const KeyMovesToPunish = ({ keyMovesArr }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  console.log(keyMovesArr);
  return (
    <Box>
      <CollapsableSection
        title={"Key Moves To Punish:"}
        toggleState={isCollapsed}
        collapseFn={toggleCollapse}
        styles={{ padding: "1rem 0" }}
        contentStyles={{
          background: "#333333",
          padding: "1rem 3rem",
          borderRadius: "8px",
        }}
      >
        {keyMovesArr.map((keyMove) => (
          <KeyMoveContainer key={keyMove._id}>
            <h2 className="moveNotation">{renderInputImage(keyMove.move)}:</h2>
            <div className="moveDescription">
              <span className="moveFramesTitle">Punish: </span>
              <span className="moveFramesContent">{keyMove.punish}</span>
              <span className="moveCounterTitle">CounterPlay: </span>
              <span className="moveCounterContent">{keyMove.purpose}</span>
            </div>
          </KeyMoveContainer>
        ))}
      </CollapsableSection>
    </Box>
  );
};

export default KeyMovesToPunish;
