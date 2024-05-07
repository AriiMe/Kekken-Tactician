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
import { Grid, Paper, Typography, Box, Container } from "@mui/material";
import { Helmet } from "react-helmet";
import styles from "./CharacterDetails.module.css";
import ComboEnders from "../components/ComboEnders";
import CharProfile from "../components/CharProfile";
import ChainThrows from "../components/ChainThrows";

const CharacterDetails = () => {
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { characterId } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/characters/${characterId}`);
        if (!response.ok) {
          throw new Error("Character not found");
        }
        const data = await response.json();

        setCharacter(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId, apiUrl]);

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
            JK, it's loading please wait...
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
    return <Box>Error: {error.message}</Box>;
  }

  if (!character) {
    return <Box>Character not found...</Box>;
  }

  const characterName = character.name.split(" ").join("-").toLowerCase();

  // SEO STUFF HERE

  const description = `Everything you need to know about ${characterName} in Tekken 8. Combos, Heat System, Grabs, Punishers, and more. Cheat Sheet for ${characterName} Tekken8.`;
  const keywords = [
    "Tekken-8",
    `${characterName}-combos`,
    `${characterName}-Heat-dash`,
    `${characterName}-Heat-flop`,
    "Tekken-8-Punishers",
    "Tekken-8-Heat-Flop",
    "Tekken-8-Heat-Dash",
    "Tekken-8-frame-data",
    "Tekken-8-character-specific-data",
    "Tekken-8-guide",
    "Tekken-8-tutorial",
    "Tekken-8-cheat-sheet",
    `Tekken-8-${characterName}-combos`,
    `Tekken-8-${characterName}-cheat-sheet`,
    `Tekken-8-${characterName}-tutorial`,
    `Tekken-8-${characterName}-guide`,
    `Tekken-8-${characterName}-wall-combos`,
    `${characterName}-best-moves`,
    `${characterName}-top-10-moves`,
    `Tekken-8-${characterName}-strategy`,
    `Tekken-8-${characterName}-tips`,
    `Tekken-8-${characterName}-tricks`,
    `Tekken-8-${characterName}-matchups`,
    `Tekken-8-${characterName}-counter`,
    `Tekken-8-${characterName}-strengths`,
    `Tekken-8-${characterName}-weaknesses`,
    `Tekken-8-${characterName}-tier-rank`,
    `Tekken-8-${characterName}-gameplay`,
    `Tekken-8-${characterName}-guide-for-beginners`,
    `Tekken-8-${characterName}-advanced-guide`,
    `Tekken-8-${characterName}-pro-tips`,
    `Tekken-8-${characterName}-wall-damage`,
    `Tekken-8-${characterName}-wall-carry`,
    `Tekken-8-${characterName}-oki-setup`,
    `Tekken-8-${characterName}-punishment-guide`,
    `Tekken-8-${characterName}-frame-traps`,
    `Tekken-8-${characterName}-mixups`,
  ].join(", ");

  const characterCombosURL = `https://www.tekkentactician.com/character/combos/${characterName}-combos/${characterId}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: "Tekken 8",
    character: {
      "@type": "GameCharacter",
      name: `${character.name}`,
      alternateName: "風間 仁",
      description: `${character.name} is a key character in the Tekken series, known for his powerful combos and complex storyline.`,
      gameTip: `Utilize ${character.name}'s key moves to maximize frame advantage against opponents.`,
      associatedMoves:
        "Electric Wind Hook Fist, Devil's Beam, Rage Art,Electric Wind God Fist, Heat Smash",
      isPlayableCharacter: true,
    },
  };

  return (
    <Box
      className="character-sheet-container"
      sx={{ pt: 9, pb: 0, minHeight: "100vh", mb: 5 }}
    >
      <Helmet>
        <title>
          Tekken {character.name} - Combos ,Guide and Cheat Sheet - Tekken 8
        </title>
        <link rel="canonical" href={characterCombosURL} />
        <meta property="og:url" content={characterCombosURL} />
        <meta property="og:image" content={character.image} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Tekken 8 ${character.name} Guide and Cheat Sheet`}
        />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Tekken 8 ${character.name} Guide and Cheat Sheet`}
        />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={character.image} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Container maxWidth="2xl" sx={{}}>
        <Grid container spacing={1}>
          {/* Left column: Heat System, Important Grabs, Mini Combos, Heat Engagers */}
          <Grid item xs={12} md={4} lg={3} className={styles.leftColumn}>
            <Paper
              sx={{
                overflowY: "scroll",
                minHeight: "100vh",
                scrollbarWidth: "none",
                "& .input-icons": {
                  width: "25px",
                  height: "25px",
                },
              }}
            >
              <Paper sx={{ marginBottom: 1 }}>
                <CharProfile pic={character.image} name={character.name} />
              </Paper>
              <Paper sx={{ marginBottom: 1 }}>
                <HeatDash heat={character.heatSystem} name={characterName} />
              </Paper>
              <Paper sx={{ marginBottom: 1 }}>
                <MostImportantGrabs
                  grabs={character.mostImportantGrabs}
                  name={characterName}
                />
              </Paper>
              <Paper sx={{ marginBottom: 1 }}>
                <MiniCombo
                  miniCombo={character.guaranteedFollowUps}
                  name={characterName}
                />
              </Paper>
              <Paper>
                <HeatEngagers
                  heat={character.heatEngagers}
                  name={characterName}
                />
              </Paper>
              <Paper>
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
              }}
            >
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <Paper sx={{ marginBottom: 1 }}>
                    <MainCombos
                      combos={character.importantCombos}
                      name={characterName}
                    />
                  </Paper>
                </Grid>
                {character.chainThrows &&
                Object.keys(character.chainThrows).length > 0 ? (
                  <Grid item xs={12}>
                    <Paper>
                      <ChainThrows
                        chainThrows={character.chainThrows}
                        name={characterName}
                      />
                    </Paper>
                  </Grid>
                ) : null}
                <Grid item xs={12}>
                  <Paper>
                    <WallCombos
                      wallCombos={character.wallCombos}
                      name={characterName}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper>
                    <ComboEnders enders={character.comboEnders} />
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CharacterDetails;
