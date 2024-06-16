import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Button,
  Box,
} from "@mui/material";
import "./RankingList.css";

const RankingList = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(
          `${process.env.PUBLIC_URL}/rankings.json`
        );
        const playersData = response.data;

        // Sort players by points in descending order and assign rankings
        const sortedPlayers = playersData
          .sort((a, b) => b.points - a.points)
          .map((player, index) => ({
            ...player,
            ranking: index + 1,
          }));

        setPlayers(sortedPlayers);
      } catch (error) {
        console.error("Error fetching players data", error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="ranking-list-container">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <h2>Player Leaderboards</h2>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ranking</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Video</TableCell>
              <TableCell>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.name}>
                <TableCell>#{player.ranking}</TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell>
                  <Link
                    href={player.vodUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch
                  </Link>
                </TableCell>
                <TableCell>{player.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        href="https://discord.gg/9Y2uuNgXuf"
        target="_blank"
        sx={{ mt: 2, width: "100%" }}
      >
        Publish your VOD and points
      </Button>
    </div>
  );
};

export default RankingList;
