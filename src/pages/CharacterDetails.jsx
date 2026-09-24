import GuideSupplement from '../components/GuideSupplement';
import { usePageData } from '../context/PageDataContext';
// CharacterDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MostImportantGrabs from "../components/MostImportantGrabs";
import { HeatDash } from "../components/HeatDash";
import MiniCombo from "../components/MiniCombo";
import HeatEngagers from "../components/HeatEngagers";
import MainCombos from "../components/MainCombos";
import WallCombos from "../components/WallCombos";
import Punishers from "../components/Punishers";
import { Grid, Paper, Typography, Box, Container } from "@mui/material";
import styles from "./CharacterDetails.module.css";
import ComboEnders from "../components/ComboEnders";
import CharProfile from "../components/CharProfile";
import ChainThrows from "../components/ChainThrows";
import CreatorNotes from "../components/CreatorNotes";
import Stances from "../components/Stances";
import BeginnerCombos from '../components/BeginnerCombos';
import { getCharacterStances, getStanceLabels } from "../data/tekken8Stances";
import { StanceContext } from "../context/StanceContext";
import { getCharacter } from "../utils/apiClient";

const boraderRaduisSection = { borderRadius: "5px" };
const leftColumnMargin = { marginBottom: "0rem" };

const CharacterDetails = () => {
  const initialData = usePageData();
  const [character, setCharacter] = useState(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!initialData);

  const { characterId } = useParams();

  useEffect(() => {
    const controller = new AbortController();

    const fetchCharacter = async () => {
      try {
        if (!initialData) setLoading(true);
        setError(null);
        const data = await getCharacter(characterId, {
          signal: controller.signal,
        });
        setCharacter(data);
        setLoading(false);
      } catch (error) {
        if (error.name === "AbortError") return;
        if (!initialData) setError(error);
        setLoading(false);
      }
    };

    fetchCharacter();

    return () => controller.abort();
  }, [characterId, initialData]);

  if (loading) {
    if (characterId === "662bd3e3f1042bb628f57a67") {
      return (
        <div
          id="meme-yoshi"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <img
            src="/icons/1+4.webp"
            style={{ width: "200px", marginBottom: "30px" }}
            alt="1+4"
          />
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ color: "#d42f2f" }}
          >
            JK, it’s loading—please wait…
          </Typography>
        </div>
      );
    }
    return (
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "red",
          fontSize: "24px",
        }}
      >
        Loading please wait...
      </Container>
    );
  }

  if (error) {
    return <Box>Error: {error.message || "An unknown error occurred"}</Box>;
  }

  if (!character) {
    return <Box>Character not found...</Box>;
  }

  const characterName = character.name;
  const stances = getCharacterStances(character);
  const stanceLabels = getStanceLabels(stances);

  return (
    <StanceContext.Provider value={stanceLabels}>
    <Box
      className="character-sheet-container"
      sx={{ pt: 9, pb: 0, minHeight: "100vh", mb: 5 }}
    >
      <Container maxWidth="2xl" sx={{}}>
        <Grid container spacing={1} columnSpacing={2}>
          {/* Left column: Heat System, Important Grabs, Mini Combos, Heat Engagers */}
          <Grid item xs={12} md={4} lg={3} className={styles.leftColumn}>
            <Paper
              sx={{
                overflowY: "scroll",
                minHeight: "100vh",
                scrollbarWidth: "none",
                marginTop: "2rem",
                background: "#242424",
                "& .input-icons": {
                  width: "25px",
                  height: "25px",
                },
              }}
            >
              <Paper sx={leftColumnMargin}>
                <CharProfile pic={character.image} name={character.name} />
              </Paper>
              {character.heatSystem?.engager && character.heatSystem?.ender && (
                <Paper sx={leftColumnMargin}>
                  <HeatDash heat={character.heatSystem} name={characterName} />
                </Paper>
              )}
              <Paper sx={leftColumnMargin}>
                <MostImportantGrabs
                  grabs={character.mostImportantGrabs}
                  name={characterName}
                />
              </Paper>
              <Paper sx={leftColumnMargin}>
                <MiniCombo
                  miniCombo={character.guaranteedFollowUps}
                  name={characterName}
                />
              </Paper>
              <Paper sx={leftColumnMargin}>
                <HeatEngagers
                  heat={character.heatEngagers}
                  name={characterName}
                />
              </Paper>
              <Paper sx={leftColumnMargin}>
                <Punishers
                  punishers={character.punishers}
                  name={characterName}
                />
              </Paper>
            </Paper>
          </Grid>

          {/* Right column: Main Combos and Wall Combos */}
          <Grid item xs={12} md={8} lg={9} className={styles.rightColumn}>
            <Paper
              sx={{
                overflowY: "scroll",
                minHeight: "100vh",
                scrollbarWidth: "none",
                background: "#242424",
              }}
            >
              <Grid container spacing={0} sx={{ marginTop: "2rem" }}>
                <Grid item xs={12}>
                  <Paper sx={{ marginBottom: 1, ...boraderRaduisSection }}>
                    <MainCombos
                      combos={character.importantCombos}
                      name={characterName}
                      version={character.gameVersion}
                    />
                  </Paper>
                </Grid>
                {character.beginnerCombos?.length > 0 && <Grid item xs={12}>
                  <Paper sx={{ marginBottom: 1, ...boraderRaduisSection }}><BeginnerCombos combos={character.beginnerCombos} /></Paper>
                </Grid>}
                {stances.length > 0 && (
                  <Grid item xs={12}>
                    <Paper sx={{ marginBottom: 1, ...boraderRaduisSection }}>
                      <Stances stances={stances} />
                    </Paper>
                  </Grid>
                )}
                {character.creatorNotes && character.creatorNotes.length > 0 ? (
                  <Grid item xs={12}>
                    <Paper sx={{ marginBottom: 1, ...boraderRaduisSection }}>
                      <CreatorNotes
                        creatorNotes={character.creatorNotes[0]}
                        name={characterName}
                      />
                    </Paper>
                  </Grid>
                ) : null}

                {character.chainThrows &&
                Object.keys(character.chainThrows).length > 0 ? (
                  <Grid item xs={12}>
                    <Paper sx={boraderRaduisSection}>
                      <ChainThrows
                        chainThrows={character.chainThrows}
                        name={characterName}
                      />
                    </Paper>
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  <Paper sx={boraderRaduisSection}>
                    <WallCombos
                      wallCombos={character.wallCombos}
                      name={characterName}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={boraderRaduisSection}>
                    <ComboEnders enders={character.comboEnders} />
                  </Paper>
                </Grid>
                {character.sections?.wavu && <Grid item xs={12}><GuideSupplement guide={character.sections.wavu} /></Grid>}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </StanceContext.Provider>
  );
};

export default CharacterDetails;
