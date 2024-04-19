import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const ImagePaper = styled(Paper)(({ theme }) => ({
  width: "200px", // Fixed width
  height: "200px", // Fixed height
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  background: theme.palette.background.paper,
  boxShadow: "0 0 8px rgba(0, 0, 255, 0.5)",
  "&:hover": {
    boxShadow: "0 0 15px rgba(0, 0, 255, 0.7)",
    cursor: "pointer",
  },
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden", // Important for maintaining the zoom effect inside the container
  display: "flex",
  alignItems: "center", // Center align the images vertically
  justifyContent: "center", // Center align the images horizontally
}));

const StyledImage = styled("img")({
  width: "100%", // Ensures the image fills the container's width
  height: "100%", // Ensures the image fills the container's height
  objectFit: "cover", // Maintain aspect ratio, crop if necessary
  transition: "transform 0.3s ease", // Smooth transition for zoom
  "&:hover": {
    transform: "scale(1.1)", // Slight zoom on hover
  },
});

const CharacterSelect = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/characters`)
      .then((response) => response.json())
      .then((data) => {
        setCharacters(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching characters:", error));
  }, [apiUrl]);

  const handleCharacterSelect = (characterId) => {
    navigate(`/character/${characterId}`);
  };
  if (loading) {
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

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 !important",
      }}
    >
      <Helmet>
        <title>Tekken 8 Character Guide</title>
        <meta
          name="description"
          content="Explore and learn about all Tekken 8 characters, their combos, cheat sheets,strategies, and tips to improve your gameplay."
        />
        <meta
          name="keywords"
          content={characters
            .map(
              (character) =>
                `${character.name},Tekken 8 ${character.name}, ${character.name} combos, ${character.name} strategy,${character.name} guide,${character.name} cheat sheet, ${character.name} punishers, ${character.name} combos, ${character.name} wall combos, ${character.name} frame data, ${character.name} tier list, Tekken 8 combos, Tekken 8 DLC, How to play Tekken 8`
            )
            .join(", ")}
        />
      </Helmet>
      <h1 style={{ textAlign: "center", width: "100%" }}>
        Pick your Character
      </h1>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {characters.map((character) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={character._id}>
            <Tooltip title={character.name} placement="top">
              <ImagePaper
                elevation={3}
                onClick={() => handleCharacterSelect(character._id)}
              >
                <StyledImage src={character.image} alt={character.name} />
              </ImagePaper>
            </Tooltip>
          </Grid>
        ))}
      </Grid>

      <Button
        color="inherit"
        component={Link}
        to="/update-request"
        sx={{ mt: 2, display: "block", mx: "auto" }}
      >
        Your Character not here?
      </Button>
    </Container>
  );
};

export default CharacterSelect;
