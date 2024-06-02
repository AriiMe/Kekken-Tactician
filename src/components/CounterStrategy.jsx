import { Box, styled } from "@mui/material";
import CollapsableSection from "./CollapsableSection";
import { useState } from "react";
import renderInputImage from "../utils/renderInputImage";

const DetailedMoveIntro = styled(Box)(({ theme }) => ({
  "& .moveTitle": {
    color: "#d42f2f",
    display: "block",
    fontSize: "1.2rem",
    marginBottom: "1.1em",
  },
  "& .moveDescription": {
    fontFamily: "Inter",
    fontSize: "1.2rem",
    marginBottom: "1.5em",
    display: "block",
  },
}));

const DetailedMoveContainer = styled(Box)(({ theme }) => ({
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

const CounterStrategy = ({ strategyArr }) => {
  const [collapsedStates, setCollapsedStates] = useState(
    strategyArr.map(() => false)
  );

  console.log(collapsedStates);

  const toggleCollapse = (index) => {
    setCollapsedStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = !prevStates[index];
      return updatedStates;
    });
  };

  return (
    <Box>
      {strategyArr.map((strategy, index) => (
        <CollapsableSection
          title={strategy.title}
          toggleState={collapsedStates[index]}
          collapseFn={() => toggleCollapse(index)}
          styles={{ padding: "1rem 0", marginTop: "2rem" }}
          contentStyles={{
            background: "#333333",
            padding: "1rem 3rem",
            borderRadius: "8px",
          }}
          key={strategy._id}
        >
          <DetailedMoveIntro>
            <h2 className="moveTitle">Overview:</h2>
            <p className="moveDescription">{strategy.description}</p>
          </DetailedMoveIntro>
          {strategy.other.map((move) => (
            <DetailedMoveContainer key={move._id}>
              <h2 className="moveNotation">{renderInputImage(move.move)}:</h2>
              <div className="moveDescription">
                <span className="moveFramesTitle">Punish: </span>
                <span className="moveFramesContent">{move.counter}</span>
                <span className="moveCounterTitle">CounterPlay: </span>
                <span className="moveCounterContent">{move.details}</span>
              </div>
            </DetailedMoveContainer>
          ))}
        </CollapsableSection>
      ))}
    </Box>
  );
};

export default CounterStrategy;
