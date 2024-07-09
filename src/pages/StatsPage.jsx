import React, { useEffect, useState } from "react";
import UserStats from "../components/UserStats";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const StatsPage = () => {
  const [userId, setUserId] = useState("");
  const [inputId, setInputId] = useState("");
  const [showMyStats, setShowMyStats] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("myUserId");
    if (storedUserId) {
      setShowMyStats(true);
    }
  }, []);

  const handleSearchUserId = () => {
    setUserId(inputId);
    setInputId("");
  };

  const handleShowMyStats = () => {
    const storedUserId = localStorage.getItem("myUserId");
    setUserId(storedUserId);
  };

  return (
    <Container sx={{ marginTop: "100px" }}>
      <Typography variant="h6">Enter User ID for Stats</Typography>
      <Box sx={{ display: "flex", marginBottom: "20px" }}>
        <TextField
          label="User ID"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          sx={{ marginRight: "10px" }}
        />
        <Button variant="contained" onClick={handleSearchUserId}>
          Search
        </Button>
      </Box>
      {showMyStats && (
        <Button
          variant="outlined"
          onClick={handleShowMyStats}
          sx={{ marginBottom: "20px" }}
        >
          My Stats
        </Button>
      )}
      {userId && <UserStats userId={userId} />}
    </Container>
  );
};

export default StatsPage;
