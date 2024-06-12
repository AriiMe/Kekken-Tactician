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
  Badge,
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
  margin: "6rem 0",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.3rem",
  },
}));

const pointsMap = {
  easy: 5,
  medium: 10,
  hard: 15,
};

const deductionMap = {
  easy: 14,
  medium: 10,
  hard: 5,
};

const StratRoulette = () => {
  const [strategies, setStrategies] = useState({ general: [], characters: {} });
  const [currentStrat, setCurrentStrat] = useState({
    title: "",
    description: "",
    difficulty: "",
    scope: "",
  });
  const [usedStrats, setUsedStrats] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [points, setPoints] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [highestStreak, setHighestStreak] = useState(null);

  useEffect(() => {
    fetchStrategies();
    const savedStreak = localStorage.getItem("highestStreak");
    if (savedStreak !== null) {
      setHighestStreak(parseInt(savedStreak, 10));
    }
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
    setGameStarted(true);
  };

  const handleSuccess = () => {
    setPoints(points + pointsMap[currentStrat.difficulty]);
    checkEndGame();
  };

  const handleFailure = () => {
    setPoints(points - deductionMap[currentStrat.difficulty]);
    checkEndGame();
  };

  const checkEndGame = () => {
    if (
      usedStrats.length >=
      strategies.general.length +
        (selectedCharacter
          ? strategies.characters[selectedCharacter].length
          : 0)
    ) {
      if (points > highestStreak) {
        setHighestStreak(points);
        localStorage.setItem("highestStreak", points);
      }
      setGameEnded(true);
    } else {
      getRandomStrategy();
    }
  };

  const resetGame = () => {
    setCurrentStrat({
      title: "",
      description: "",
      difficulty: "",
      scope: "",
    });
    setUsedStrats([]);
    setSelectedCharacter("");
    setPoints(0);
    setGameStarted(false);
    setGameEnded(false);
  };

  const characterNames = Object.keys(strategies.characters)
    .map((char) => char.charAt(0).toUpperCase() + char.slice(1))
    .join(", ");

  const getPunishment = (points) => {
    if (points >= 600)
      return "God-tier performance! Chat, drop 10 gifted subs and shower this legend with praise!";
    if (points >= 500)
      return "Wow, you're on fire! Chat, drop 5 gifted subs for this amazing performance!";
    if (points >= 400)
      return "Incredible job! Treat yourself to a nice meal. Chat, you know what to do!";
    if (points >= 300)
      return "Fantastic! Stay hydrated, drink some water, and maybe chat should think about those 3 gifted subs after you do 5 squats!";
    if (points >= 200)
      return "Wack! Drop 20 squats and let the chat know how 'fun' it is.";
    if (points >= 100)
      return "Mid-tier performance. Do 20 Sit ups and don't forget to thank chat for watching this mediocrity!";
    if (points >= 50)
      return "Could be better ngl, now do 15 push ups and let chat roast you for it!";
    if (points >= 0)
      return "Awful stuff! Make an apology video and post it on Twitter.";
    if (points >= -25)
      return "Timeout 3 random viewers and let them know it's because of your poor performance!";
    if (points >= -50)
      return "Git Gud scrub. Hand over your controller to someone in chat oh and do 30 Jumping Jacks.";
    if (points < -50)
      return "Uninstall Tekken 8 or let your Twitch chat decide your punishment. Chat Destroy them!";

    return "Uninstall Tekken 8 or let your Twitch chat decide your punishment. Chat Destroy them!";
  };

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
          {highestStreak !== null && (
            <Typography variant="h5" gutterBottom>
              Highest Streak: {highestStreak} points
            </Typography>
          )}
          {!gameEnded && (
            <>
              <StrategyTitle variant="h6" gutterBottom>
                {currentStrat.title}
              </StrategyTitle>
              {currentStrat.scope && (
                <Typography
                  variant="h5"
                  sx={{ color: "royalblue" }}
                  gutterBottom
                >
                  Duration:{" "}
                  {currentStrat.scope === "round"
                    ? "One Round"
                    : currentStrat.scope === "match"
                    ? "Whole Match"
                    : "Only Once"}
                </Typography>
              )}
              {currentStrat.difficulty && (
                <Badge
                  badgeContent={currentStrat.difficulty}
                  color={
                    currentStrat.difficulty === "easy"
                      ? "success"
                      : currentStrat.difficulty === "medium"
                      ? "warning"
                      : "error"
                  }
                  sx={{
                    "& .MuiBadge-badge": {
                      minWidth: "100px",
                      height: "30px",
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      marginTop: "1rem",
                    },
                  }}
                />
              )}
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
                  disabled={gameStarted}
                >
                  <MenuItem value="">All Characters</MenuItem>
                  {Object.keys(strategies.characters).map((char) => (
                    <MenuItem key={char} value={char}>
                      {char.charAt(0).toUpperCase() + char.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
          {!gameStarted && (
            <Button
              variant="contained"
              color="primary"
              onClick={getRandomStrategy}
            >
              Get a Random Strategy
            </Button>
          )}
          {gameStarted && !gameEnded && (
            <>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSuccess}
                >
                  Succeeded
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleFailure}
                >
                  Failed
                </Button>
              </Box>
              <Typography variant="h5" gutterBottom>
                Current Points: {points}
              </Typography>
            </>
          )}
          {gameEnded && (
            <>
              <Typography variant="h5" sx={{ color: "white" }} gutterBottom>
                Current Points: {points}
              </Typography>
              <StrategyText variant="h4" gutterBottom>
                {getPunishment(points)}
              </StrategyText>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: 1 }}
                onClick={resetGame}
              >
                Retry
              </Button>
            </>
          )}
        </ContentBox>
      </Container>
    </Box>
  );
};

export default StratRoulette;
