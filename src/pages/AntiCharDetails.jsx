import { usePageData } from '../context/PageDataContext';
// CharacterDetails.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Grid, styled } from "@mui/material";
import styles from "./AntiCharDetails.module.css";
import KeyMovesToPunish from "../components/KeyMovesToPunish";
import CounterStrategy from "../components/CounterStrategy";
import { getCharacter } from "../utils/apiClient";

const ContentBox = styled(Box)(() => ({
  // padding: "0rem 2rem",
  margin: "2rem auto",
}));

const AntiCharDetails = () => {
  const [character, setCharacter] = useState(usePageData());
  const [error, setError] = useState(null);
  const { characterId } = useParams();

  useEffect(() => {
    const controller = new AbortController();

    const fetchCharacter = async () => {
      try {
        setError(null);
        const data = await getCharacter(characterId, {
          signal: controller.signal,
        });
        setCharacter(data);
      } catch (error) {
        if (error.name === "AbortError") return;
        setError(error);
      }
    };

    fetchCharacter();

    return () => controller.abort();
  }, [characterId]);

  if (error) {
    return <Box>Error: {error.message || "An unknown error occurred"}</Box>;
  }

  if (!character) {
    return <Box>Character not found...</Box>;
  }

  const antiChar = character.counterSchema?.[0];

  if (!antiChar) {
    return (
      <Box sx={{ minHeight: "100vh", pt: 16, textAlign: "center" }}>
        No anti-guide is available for {character.name} yet.
      </Box>
    );
  }

  return (
    <Box
      className="character-sheet-container"
      sx={{ pt: 9, pb: 0, minHeight: "100vh", mb: 5 }}
    >
      <Container
        maxWidth="2xl"
        sx={{ width: "90%!important", margin: "0 auto" }}
      >
        <Box className={styles.charPicContainer}>
          <h1>{character.name} Matchup Guide</h1>
          <img
            src={character.image}
            alt={character.name}
            className={styles.charPic}
          />
        </Box>
        <Grid
          container
          rowSpacing={2}
          mt={4}
          className={styles.introGridContainer}
        >
          <Grid item xs={12} md={6}>
            <div className={styles.introBox}>
              <h3>Optimal Range ({character.name.split(" ")[0]})</h3>
              <p>{antiChar.effectiveRange}</p>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={styles.introBox}>
              <h3>Weak Side</h3>
              <p>{antiChar.weakSide}</p>
            </div>
          </Grid>
          <Grid item xs={12} className={styles.introOverview}>
            <h2>Character Overview:</h2>
            <p>{antiChar.overview}</p>
          </Grid>
          <Grid item xs={12} className={styles.introStrategy}>
            <h2>Counter Strategy:</h2>
            <p>{antiChar.counterStrategy}</p>
          </Grid>
        </Grid>
        <ContentBox>
          <KeyMovesToPunish keyMovesArr={antiChar.keyMovesToPunish} />
          <CounterStrategy strategyArr={antiChar.detailedCounterStrategies} />
        </ContentBox>
      </Container>
    </Box>
  );
};

export default AntiCharDetails;
