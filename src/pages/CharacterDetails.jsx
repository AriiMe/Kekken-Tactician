// CharacterDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MostImportantGrabs from "../components/MostImportantGrabs";
import { HeatDash } from "../components/HeatDash";
import MiniCombo from "../components/MiniCombo";
import HeatEngagers from "../components/HeatEngagers";
import MainCombos from "../components/MainCombos";
import WallCombos from "../components/WallCombos";
import Punishers from "../components/Punishers";
import { Grid, Paper, Typography, Box } from "@mui/material";

import styles from "./CharacterDetails.module.css";

const CharacterDetails = () => {
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const { characterId } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (characterId) {
      fetch(`${apiUrl}/characters/${characterId}`)
        .then((response) => response.json())
        .then((data) => setCharacter(data))
        .catch((error) => {
          console.error("Error fetching character:", error);
          setError(error);
        });
    }
  }, [characterId, apiUrl]);
  console.log("char", character);

  if (error) {
    return <Box>Error: {error.message}</Box>;
  }

  if (!character) {
    return <Box>Get Ready for the next battle...</Box>;
  }

  return (
    <Box sx={{ pt: 9, pb: 0 }}>
      <Grid container spacing={1}>
        {/* Left column: Heat System, Important Grabs, Mini Combos, Heat Engagers */}
        <Grid item xs={12} md={3} className={styles.leftColumn}>
          <Paper
            sx={{
              overflowY: "auto",
              maxHeight: "90vh",
              "&::-webkit-scrollbar": {
                width: "10px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                border: "3px solid transparent",
                backgroundClip: "content-box",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.4)",
              },
            }}
          >
            <Paper sx={{ marginBottom: 1 }}>
              <HeatDash heat={character.heatSystem} />
            </Paper>
            <Paper sx={{ marginBottom: 1 }}>
              <MostImportantGrabs grabs={character.mostImportantGrabs} />
            </Paper>
            <Paper sx={{ marginBottom: 1 }}>
              <MiniCombo miniCombo={character.guaranteedFollowUps} />
            </Paper>
            <Paper>
              <HeatEngagers heat={character.heatEngagers} />
            </Paper>
            <Paper>
              <Punishers punishers={character.punishers} />
            </Paper>
          </Paper>
        </Grid>

        {/* Right column: Main Combos and Wall Combos */}
        <Grid item xs={12} md={9} className={styles.rightColumn}>
          <Paper
            sx={{
              overflowY: "auto",
              maxHeight: "90vh",
              "&::-webkit-scrollbar": {
                width: "10px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "20px",
                border: "3px solid transparent",
                backgroundClip: "content-box",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.4)",
              },
            }}
          >
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Paper sx={{ marginBottom: 1 }}>
                  <MainCombos combos={character.importantCombos} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper>
                  <WallCombos wallCombos={character.wallCombos} />
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CharacterDetails;
