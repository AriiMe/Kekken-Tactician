import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  styled,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Helmet } from "react-helmet";

const ContentBox = styled(Box)(({ theme }) => ({
  margin: "2rem auto",
  display: "flex",
  color: theme.palette.primary.main,
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
}));

const StrategyTitle = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  color: "#FFD700",
  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
  marginBottom: "1rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

const StrategyText = styled(Typography)(({ theme }) => ({
  fontSize: "2.2rem",
  fontWeight: "bold",
  color: "white",
  textShadow: "5px 6px 10px rgba(0,0,0,0.8)",
  margin: "8rem 0",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.3rem",
  },
}));

const StratRoulette = () => {
  const [strategies, setStrategies] = useState({ general: [], characters: {} });
  const [currentStrat, setCurrentStrat] = useState({
    title: "",
    description: "",
  });
  const [usedStrats, setUsedStrats] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState("");

  const fetchStrategies = async () => {
    try {
      const response = await fetch("/strats.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStrategies(data);
    } catch (error) {
      console.error("Error fetching strategies:", error);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const getRandomStrategy = () => {
    const generalStrats = strategies.general;
    const characterStrats =
      selectedCharacter && strategies.characters[selectedCharacter]
        ? strategies.characters[selectedCharacter]
        : [];

    const availableStrats = [...generalStrats, ...characterStrats];

    if (availableStrats.length === 0) {
      setCurrentStrat({ title: "", description: "No strategies available." });
      return;
    }

    const unusedStrats = availableStrats.filter(
      (strat) => !usedStrats.includes(strat)
    );
    if (unusedStrats.length === 0) {
      setUsedStrats([]);
      setCurrentStrat({
        title: "",
        description: "No more new strategies. Resetting...",
      });
      return;
    }

    const randomStrat =
      unusedStrats[Math.floor(Math.random() * unusedStrats.length)];
    setCurrentStrat(randomStrat);
    setUsedStrats([...usedStrats, randomStrat]);
  };

  const characterNames = Object.keys(strategies.characters)
    .map((char) => char.charAt(0).toUpperCase() + char.slice(1))
    .join(", ");

  return (
    <Box
      className="strat-roulette-container"
      sx={{
        pt: 9,
        pb: 0,
        minHeight: "100vh",
        mb: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Helmet>
        <title>
          Tekken 8 Strategy Roulette - Best Strategies for All Characters
        </title>
        <meta
          name="description"
          content={`Discover the best strategies for Tekken 8 with our Strategy Roulette. Get random, funny, and useful strategies for your favorite characters including ${characterNames}.`}
        />
        <meta
          name="keywords"
          content={`Tekken 8, Tekken 8 strategies, Tekken 8 combos, Tekken 8 tips, Kazuya strategies, Jin combos, Paul Phoenix moves, Devil Jin techniques, Tekken 8 tier list, Tekken 8 beginner guide, ${characterNames}.`}
        />
      </Helmet>
      <Container
        maxWidth="md"
        sx={{ width: "90%!important", margin: "0 auto" }}
      >
        <ContentBox>
          <Typography variant="h1" gutterBottom sx={{ fontSize: "2.6rem" }}>
            Tekken 8 Strategy Roulette
          </Typography>
          <StrategyTitle variant="h6" gutterBottom>
            {currentStrat.title}
          </StrategyTitle>
          <StrategyText variant="h6" gutterBottom>
            {currentStrat.description ||
              "Press the button to get a funny strategy!"}
          </StrategyText>
          <FormControl fullWidth sx={{ marginBottom: 3 }}>
            <InputLabel id="character-select-label">
              Select Character
            </InputLabel>
            <Select
              labelId="character-select-label"
              value={selectedCharacter}
              label="Select Character"
              onChange={(e) => setSelectedCharacter(e.target.value)}
            >
              <MenuItem value="">All Characters</MenuItem>
              {Object.keys(strategies.characters).map((char) => (
                <MenuItem key={char} value={char}>
                  {char.charAt(0).toUpperCase() + char.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={getRandomStrategy}
          >
            Get a Random Strategy
          </Button>
        </ContentBox>
      </Container>
    </Box>
  );
};

export default StratRoulette;
