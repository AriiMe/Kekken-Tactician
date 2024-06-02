// CharacterDetails.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Grid, styled } from "@mui/material";
import { Helmet } from "react-helmet";
import styles from "./AntiCharDetails.module.css";
import KeyMovesToPunish from "../components/KeyMovesToPunish";
import CounterStrategy from "../components/CounterStratigy";

const ContentBox = styled(Box)(({ theme }) => ({
  background: "#2a2a2a",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  padding: "0rem 2rem",
  margin: "2rem auto",
}));

const AntiCharDetails = () => {
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

  if (error) {
    return <Box>Error: {error.message || "An unknown error occurred"}</Box>;
  }

  if (!character) {
    return <Box>Character not found...</Box>;
  }

  const characterName = character.name.split(" ").join("-").toLowerCase();
  const antiChar = character.counterSchema[0];
  console.log(antiChar);

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

  const characterAntiGuideUrl = `https://www.tekkentactician.com//anti-guide/character/${characterId}`;

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
          Tekken {character.name} - Counter Play, Anti-Guide and more! - Tekken
          8
        </title>
        <link rel="canonical" href={characterAntiGuideUrl} />
        <meta property="og:url" content={characterAntiGuideUrl} />
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
      <Container
        maxWidth="2xl"
        sx={{ width: "90%!important", margin: "0 auto" }}
      >
        <Box className={styles.charPicContainer}>
          <h2>{character.name}</h2>
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
          <Grid item xs={12} md={6} className={styles.introBox}>
            <h3>Optimal Range ({character.name.split(" ")[0]})</h3>
            <p>{antiChar.effectiveRange}</p>
          </Grid>
          <Grid item xs={12} md={6} className={styles.introBox}>
            <h3>Weak Side</h3>
            <p>{antiChar.weakSide}</p>
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
