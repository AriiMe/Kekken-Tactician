import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  styled,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
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
  fontSize: "2rem",
  color: "#FFD700",
  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
  marginBottom: "1rem",
  fontFamily: "Michroma",
  background: "#242424",
  padding: "1rem",
  borderLeft: "2px solid #c62828",
  borderRight: "2px solid #c62828",
  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

const StrategyText = styled(Typography)(({ theme }) => ({
  fontSize: "2.2rem",
  fontWeight: "bold",
  color: "white",
  textShadow: "5px 6px 10px rgba(0,0,0,0.8)",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.3rem",
  },
}));

const StratContainer = styled(Box)(({ theme }) => ({
  background: "#0c0c0c",
  border: "1px solid #c62828",
  borderRadius: "8px",
  width: "100%",
  margin: "2rem",
  padding: "2rem 0",
}));

const StratContentContainer = styled(Box)(({ theme }) => ({
  width: "80%",
  margin: "0 auto",
}));

const StratDurationAndDifficulty = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "60px",
  margin: " 2rem 0",
}));

const StratDuration = styled(Typography)(({ theme }) => ({
  color: "white",
  fontSize: "1.3rem",
  margin: 0,
  "& span": {
    fontFamily: "Michroma",
    color: "#c62828",
    marginRight: ".5rem",
  },
}));

const StratContent = () => {
  const [strategies, setStrategies] = useState({ general: [], characters: {} });
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [currentStrat, setCurrentStrat] = useState({
    title: "",
    description: "",
    difficulty: "",
    scope: "",
  });

  useEffect(() => {
    fetchStrategies();
  }, []);

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

  const handleCharacterChange = (event) => {
    setSelectedCharacter(event.target.value);
    setSelectedChallenge("");
    setCurrentStrat({ title: "", description: "", difficulty: "", scope: "" });
  };

  const handleChallengeChange = (event) => {
    setSelectedChallenge(event.target.value);
    const selectedStrat =
      (strategies.characters[selectedCharacter] || [])
        .concat(strategies.general)
        .find((strat) => strat.title === event.target.value) || {};
    setCurrentStrat(selectedStrat);
  };

  return (
    <Box
      className="strat-content-container"
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
        <title>Content Creator Strategy Selector</title>
        <meta
          name="description"
          content="Select and display strategies for content creation."
        />
      </Helmet>
      <Container
        maxWidth="lg"
        sx={{ width: "90%!important", margin: "3rem auto 0" }}
      >
        <ContentBox>
          <Typography
            variant="h1"
            gutterBottom
            sx={{ fontSize: "2.6rem", fontFamily: "Michroma" }}
          >
            Tekken 8 Strat Roulette
          </Typography>

          <StratContainer>
            <StratContentContainer>
              {currentStrat.title && (
                <>
                  <StrategyTitle variant="h6" gutterBottom>
                    {currentStrat.title}
                  </StrategyTitle>
                  <StratDurationAndDifficulty>
                    {currentStrat.scope && (
                      <StratDuration variant="h5" gutterBottom>
                        <span> Duration:</span>
                        {currentStrat.scope === "round"
                          ? "One Round"
                          : currentStrat.scope === "match"
                          ? "Whole Match"
                          : "Only Once"}
                      </StratDuration>
                    )}
                    {currentStrat.difficulty && (
                      <Chip
                        label={currentStrat.difficulty}
                        color={
                          currentStrat.difficulty === "easy"
                            ? "success"
                            : currentStrat.difficulty === "medium"
                            ? "warning"
                            : "error"
                        }
                        sx={{
                          "& .MuiChip-label": {
                            minWidth: "100px",
                            fontSize: "1.3rem",
                          },
                        }}
                      />
                    )}
                  </StratDurationAndDifficulty>
                  <StrategyText variant="h6" gutterBottom>
                    {currentStrat.description}
                  </StrategyText>
                </>
              )}
            </StratContentContainer>
          </StratContainer>
        </ContentBox>
        <Typography
          variant="h1"
          gutterBottom
          sx={{ fontSize: "2.6rem", fontFamily: "Michroma" }}
        >
          Content Creator Strategy Selector
        </Typography>
        <FormControl fullWidth sx={{ marginBottom: 3, marginTop: "1rem" }}>
          <InputLabel id="character-select-label">Select Character</InputLabel>
          <Select
            labelId="character-select-label"
            value={selectedCharacter}
            label="Select Character"
            onChange={handleCharacterChange}
          >
            <MenuItem value="">All Characters</MenuItem>
            {Object.keys(strategies.characters).map((char) => (
              <MenuItem key={char} value={char}>
                {char.charAt(0).toUpperCase() + char.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedCharacter && (
          <FormControl fullWidth sx={{ marginBottom: 3 }}>
            <InputLabel id="challenge-select-label">
              Select Challenge
            </InputLabel>
            <Select
              labelId="challenge-select-label"
              value={selectedChallenge}
              label="Select Challenge"
              onChange={handleChallengeChange}
            >
              {(strategies.characters[selectedCharacter] || [])
                .concat(strategies.general)
                .map((strat) => (
                  <MenuItem key={strat.title} value={strat.title}>
                    {strat.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
      </Container>
    </Box>
  );
};

export default StratContent;
