import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  TextField,
  Tabs,
  Tab,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserStats = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [comparisonId, setComparisonId] = useState("");
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [mappings, setMappings] = useState({ characters: {}, ranks: {} });

  useEffect(() => {
    axios
      .get("/wank.json")
      .then((response) => {
        setMappings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching mappings:", error);
      });

    if (userId) {
      axios
        .get(`https://kekken-backend.onrender.com/stats/replays?id=${userId}`)
        .then((response) => {
          setUserData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    }
  }, [userId]);

  useEffect(() => {
    if (comparisonId) {
      axios
        .get(
          `https://kekken-backend.onrender.com/stats/replays?id=${comparisonId}`
        )
        .then((response) => {
          setComparisonData(Array.isArray(response.data) ? response.data : []);
        })
        .catch((error) => {
          console.error("Error fetching comparison data:", error);
          setComparisonData([]);
        });
    }
  }, [comparisonId]);

  const getCharacterName = (id) =>
    mappings.characters[id] || "Unknown Character";
  const getCharacterImageUrl = (id) => `/mains/${getCharacterName(id)}.png`;
  const getRankName = (id) => mappings.ranks[id] || "Unknown Rank";

  const handleSaveAsMe = () => {
    localStorage.setItem("myUserId", userId);
  };

  const handleCompareUserId = () => {
    axios
      .get(
        `https://kekken-backend.onrender.com/stats/replays?id=${comparisonId}`
      )
      .then((response) => {
        setComparisonData(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching comparison data:", error);
        setComparisonData([]);
      });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!userData) {
    return <Typography>No data available</Typography>;
  }
  const userIsCurrentUser = localStorage.getItem("myUserId") === userId;

  const userInfo = userData.find(
    (replay) =>
      replay.p1_polaris_id === userId || replay.p2_polaris_id === userId
  );

  const totalMatches = userData.length;
  const matchesWon = userData.filter(
    (match) =>
      (match.winner === 1 && match.p1_polaris_id === userId) ||
      (match.winner === 2 && match.p2_polaris_id === userId)
  ).length;
  const winRatio = ((matchesWon / totalMatches) * 100).toFixed(2);

  const characterWins = {};
  const characterLosses = {};

  userData.forEach((match) => {
    const isP1 = match.p1_polaris_id === userId;
    const opponentCharacterId = isP1 ? match.p2_chara_id : match.p1_chara_id;
    const wonMatch =
      (isP1 && match.winner === 1) || (!isP1 && match.winner === 2);

    if (wonMatch) {
      characterWins[opponentCharacterId] =
        (characterWins[opponentCharacterId] || 0) + 1;
    } else {
      characterLosses[opponentCharacterId] =
        (characterLosses[opponentCharacterId] || 0) + 1;
    }
  });

  const characterWinRatios = {};
  for (let charId in characterWins) {
    const totalFights =
      (characterWins[charId] || 0) + (characterLosses[charId] || 0);
    if (totalFights > 0) {
      characterWinRatios[charId] = (
        ((characterWins[charId] || 0) / totalFights) *
        100
      ).toFixed(2);
    }
  }

  const topWinRatios = Object.entries(characterWinRatios)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const bottomWinRatios = Object.entries(characterWinRatios)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  // Utility functions to calculate wins, losses, and ratios for a given user data
  const calculateStats = (data, userId) => {
    const totalMatches = data.length;
    const matchesWon = data.filter((match) => {
      const isP1 = match.p1_polaris_id === userId;
      return (isP1 && match.winner === 1) || (!isP1 && match.winner === 2);
    }).length;
    const winRatio = ((matchesWon / totalMatches) * 100).toFixed(2);

    const characterWins = {};
    const characterLosses = {};

    data.forEach((match) => {
      const isP1 = match.p1_polaris_id === userId;
      const opponentCharacterId = isP1 ? match.p2_chara_id : match.p1_chara_id;
      const wonMatch =
        (isP1 && match.winner === 1) || (!isP1 && match.winner === 2);

      if (wonMatch) {
        characterWins[opponentCharacterId] =
          (characterWins[opponentCharacterId] || 0) + 1;
      } else {
        characterLosses[opponentCharacterId] =
          (characterLosses[opponentCharacterId] || 0) + 1;
      }
    });

    const characterWinRatios = {};
    for (let charId in characterWins) {
      const totalFights =
        (characterWins[charId] || 0) + (characterLosses[charId] || 0);
      if (totalFights > 0) {
        characterWinRatios[charId] = (
          ((characterWins[charId] || 0) / totalFights) *
          100
        ).toFixed(2);
      }
    }

    const topWinRatios = Object.entries(characterWinRatios)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    const bottomWinRatios = Object.entries(characterWinRatios)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3);

    return {
      totalMatches,
      matchesWon,
      winRatio,
      topWinRatios,
      bottomWinRatios,
      characterWins,
      characterLosses,
    };
  };

  const userStats = calculateStats(userData);
  const comparisonStats =
    Array.isArray(comparisonData) && comparisonData.length > 0
      ? calculateStats(comparisonData)
      : null;

  // Prepare chart data for both users
  const chartData = {
    labels: [
      ...new Set([
        ...Object.keys(userStats.characterWins || {}),
        ...Object.keys(userStats.characterLosses || {}),
        ...(comparisonStats
          ? Object.keys(comparisonStats.characterWins || {})
          : []),
        ...(comparisonStats
          ? Object.keys(comparisonStats.characterLosses || {})
          : []),
      ]),
    ],
    datasets: [
      {
        label: userIsCurrentUser ? "My Wins" : "User Wins",
        data: Object.values(userStats.characterWins || {}),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: userIsCurrentUser ? "My Losses" : "User Losses",
        data: Object.values(userStats.characterLosses || {}),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      ...(comparisonStats
        ? [
            {
              label: "Comparison Wins",
              data: Object.values(comparisonStats.characterWins || {}),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
              label: "Comparison Losses",
              data: Object.values(comparisonStats.characterLosses || {}),
              backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
          ]
        : []),
    ],
  };
  return (
    <Grid container spacing={2} sx={{ marginTop: "20px" }}>
      <Grid item xs={12}>
        <Card sx={{ display: "flex", padding: "20px" }}>
          <Box
            component="img"
            src={getCharacterImageUrl(
              userData[0].p1_polaris_id === userId
                ? userData[0].p1_chara_id
                : userData[0].p2_chara_id
            )}
            alt={getCharacterName(
              userData[0].p1_polaris_id === userId
                ? userData[0].p1_chara_id
                : userData[0].p2_chara_id
            )}
            sx={{ width: "200px", height: "200px", objectFit: "contain" }}
          />
          <CardContent sx={{ paddingLeft: "30px" }}>
            <Typography variant="h5" gutterBottom>
              User Info
            </Typography>
            <Typography>
              Name:{" "}
              {userData[0].p1_polaris_id === userId
                ? userData[0].p1_name
                : userData[0].p2_name}
            </Typography>
            <Typography>
              Most Used Character:{" "}
              {getCharacterName(
                userData[0].p1_polaris_id === userId
                  ? userData[0].p1_chara_id
                  : userData[0].p2_chara_id
              )}
            </Typography>
            <Typography>
              Rank:{" "}
              {getRankName(
                userData[0].p1_polaris_id === userId
                  ? userData[0].p1_rank
                  : userData[0].p2_rank
              )}
            </Typography>
            <Typography>
              Power:{" "}
              {userData[0].p1_polaris_id === userId
                ? userData[0].p1_power
                : userData[0].p2_power}
            </Typography>
            <Typography>
              Current Rating:{" "}
              {userData[0].p1_polaris_id === userId
                ? userData[0].p1_rating_before
                : userData[0].p2_rating_before}
            </Typography>
            <Typography>Polaris ID: {userId}</Typography>
            <Typography>Total Matches: {userData.length}</Typography>
            <Typography>
              Win Ratio:{" "}
              {(
                (userData.filter(
                  (match) =>
                    (match.p1_polaris_id === userId && match.winner === 1) ||
                    (match.p2_polaris_id === userId && match.winner === 2)
                ).length /
                  userData.length) *
                100
              ).toFixed(2)}
              %
            </Typography>
            {!localStorage.getItem("myUserId") && (
              <Button
                variant="contained"
                onClick={handleSaveAsMe}
                sx={{ marginTop: "10px" }}
              >
                This is Me
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>

      {userIsCurrentUser && (
        <Grid item xs={12}>
          <Box sx={{ display: "flex", marginBottom: "20px" }}>
            <TextField
              label="Compare with User ID"
              value={comparisonId}
              onChange={(e) => setComparisonId(e.target.value)}
              sx={{ marginRight: "10px" }}
            />
            <Button variant="contained" onClick={handleCompareUserId}>
              Compare
            </Button>
          </Box>
        </Grid>
      )}

      {comparisonData && (
        <Grid item xs={12}>
          <Card sx={{ display: "flex", padding: "20px", marginTop: "20px" }}>
            <Box
              component="img"
              src={getCharacterImageUrl(
                comparisonData[0].p1_polaris_id === comparisonId
                  ? comparisonData[0].p1_chara_id
                  : comparisonData[0].p2_chara_id
              )}
              alt={getCharacterName(
                comparisonData[0].p1_polaris_id === comparisonId
                  ? comparisonData[0].p1_chara_id
                  : comparisonData[0].p2_chara_id
              )}
              sx={{ width: "200px", height: "200px", objectFit: "contain" }}
            />
            <CardContent sx={{ paddingLeft: "30px" }}>
              <Typography variant="h5" gutterBottom>
                Comparison User Info
              </Typography>
              <Typography>
                Name:{" "}
                {comparisonData[0].p1_polaris_id === comparisonId
                  ? comparisonData[0].p1_name
                  : comparisonData[0].p2_name}
              </Typography>
              <Typography>
                Most Used Character:{" "}
                {getCharacterName(
                  comparisonData[0].p1_polaris_id === comparisonId
                    ? comparisonData[0].p1_chara_id
                    : comparisonData[0].p2_chara_id
                )}
              </Typography>
              <Typography>
                Rank:{" "}
                {getRankName(
                  comparisonData[0].p1_polaris_id === comparisonId
                    ? comparisonData[0].p1_rank
                    : comparisonData[0].p2_rank
                )}
              </Typography>
              <Typography>
                Power:{" "}
                {comparisonData[0].p1_polaris_id === comparisonId
                  ? comparisonData[0].p1_power
                  : comparisonData[0].p2_power}
              </Typography>
              <Typography>
                Current Rating:{" "}
                {comparisonData[0].p1_polaris_id === comparisonId
                  ? comparisonData[0].p1_rating_before
                  : comparisonData[0].p2_rating_before}
              </Typography>
              <Typography>Polaris ID: {comparisonId}</Typography>
              <Typography>Total Matches: {comparisonData.length}</Typography>
              <Typography>
                Win Ratio:{" "}
                {(
                  (comparisonData.filter(
                    (match) =>
                      (match.p1_polaris_id === comparisonId &&
                        match.winner === 1) ||
                      (match.p2_polaris_id === comparisonId &&
                        match.winner === 2)
                  ).length /
                    comparisonData.length) *
                  100
                ).toFixed(2)}
                %
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}

      <Grid item xs={12}>
        <Tabs value={tabValue} onChange={handleChange}>
          <Tab label="Latest Matches" />
          <Tab label="Character Win/Loss" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          {userData.slice(0, 50).map((match, index) => (
            <Card key={index} style={{ margin: "10px 0", padding: "10px" }}>
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "40%" }}
                >
                  <Box
                    component="img"
                    src={getCharacterImageUrl(match.p1_chara_id)}
                    alt={getCharacterName(match.p1_chara_id)}
                    sx={{ width: "70px", height: "70px", marginRight: "10px" }}
                  />
                  <Typography variant="subtitle1">
                    {match.p1_name} ({match.p1_power})
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ margin: "0 20px" }}>
                  VS
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "40%",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography variant="subtitle1">
                    {match.p2_name} ({match.p2_power})
                  </Typography>
                  <Box
                    component="img"
                    src={getCharacterImageUrl(match.p2_chara_id)}
                    alt={getCharacterName(match.p2_chara_id)}
                    sx={{ width: "70px", height: "70px", marginLeft: "10px" }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ color: match.winner === 1 ? "green" : "red" }}
                >
                  Winner: {match.winner === 1 ? match.p1_name : match.p2_name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6">
                Top 3 Characters You Have Issues With
              </Typography>
              {userStats.bottomWinRatios.map(([charId, ratio], index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Box
                    component="img"
                    src={getCharacterImageUrl(charId)}
                    alt={getCharacterName(charId)}
                    sx={{ width: "50px", height: "50px", marginRight: "10px" }}
                  />
                  <Typography display="inline" variant="body1">
                    Character: {getCharacterName(charId)}, Win Ratio: {ratio}%
                  </Typography>
                </Box>
              ))}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">
                Top 3 Characters You Have Highest Win Ratio
              </Typography>
              {userStats.topWinRatios.map(([charId, ratio], index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Box
                    component="img"
                    src={getCharacterImageUrl(charId)}
                    alt={getCharacterName(charId)}
                    sx={{ width: "50px", height: "50px", marginRight: "10px" }}
                  />
                  <Typography display="inline" variant="body1">
                    Character: {getCharacterName(charId)}, Win Ratio: {ratio}%
                  </Typography>
                </Box>
              ))}
            </Grid>
          </Grid>
          {comparisonStats && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6">
                    Comparison Top 3 Characters You Have Issues With
                  </Typography>
                  {comparisonStats.bottomWinRatios.map(
                    ([charId, ratio], index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <Box
                          component="img"
                          src={getCharacterImageUrl(charId)}
                          alt={getCharacterName(charId)}
                          sx={{
                            width: "50px",
                            height: "50px",
                            marginRight: "10px",
                          }}
                        />
                        <Typography display="inline" variant="body1">
                          Character: {getCharacterName(charId)}, Win Ratio:{" "}
                          {ratio}%
                        </Typography>
                      </Box>
                    )
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">
                    Comparison Top 3 Characters You Have Highest Win Ratio
                  </Typography>
                  {comparisonStats.topWinRatios.map(
                    ([charId, ratio], index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <Box
                          component="img"
                          src={getCharacterImageUrl(charId)}
                          alt={getCharacterName(charId)}
                          sx={{
                            width: "50px",
                            height: "50px",
                            marginRight: "10px",
                          }}
                        />
                        <Typography display="inline" variant="body1">
                          Character: {getCharacterName(charId)}, Win Ratio:{" "}
                          {ratio}%
                        </Typography>
                      </Box>
                    )
                  )}
                </Grid>
              </Grid>
            </>
          )}
          <Bar
            data={{
              labels: chartData.labels.map((charId) =>
                getCharacterName(charId)
              ),
              datasets: chartData.datasets,
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Character Win/Loss Ratio",
                },
              },
            }}
            height={100}
          />
        </TabPanel>
      </Grid>
    </Grid>
  );
};
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};
export default UserStats;
