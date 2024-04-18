import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

// Styled component using MUI's 'styled' utility

const ImagePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  background: theme.palette.background.paper,
  boxShadow: "0 0 8px rgba(0, 0, 255, 0.5)", // blue glow
  "&:hover": {
    boxShadow: "0 0 15px rgba(0, 0, 255, 0.7)", // stronger blue glow on hover
    cursor: "pointer",
  },
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  height: "160px", // slightly taller to accommodate the zoom without changing the paper size
  overflow: "hidden", // ensures the zoomed image doesn't overflow its container
}));

const StyledImage = styled("img")({
  width: "100%", // makes the image fill its container
  height: "100%", // makes the image fill its container
  objectFit: "cover", // maintain aspect ratio, crop if necessary
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)", // slight zoom on hover
  },
});

const CharacterSelect = () => {
  const [characters, setCharacters] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/characters`)
      .then((response) => response.json())
      .then((data) => setCharacters(data))
      .catch((error) => console.error("Error fetching characters:", error));
  }, [apiUrl]);

  const handleCharacterSelect = (characterId) => {
    navigate(`/character/${characterId}`);
  };

  return (
    <>
      <Container>
        <h1>Pick your idiot</h1>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {characters.map((character) => (
            <Tooltip title={character.name} key={character._id}>
              <Grid item xs={12} sm={6} md={4} lg={3} key={character._id}>
                <ImagePaper
                  elevation={3}
                  onClick={() => handleCharacterSelect(character._id)}
                >
                  <StyledImage src={character.image} alt={character.name} />
                </ImagePaper>
              </Grid>
            </Tooltip>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default CharacterSelect;
