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
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ImagePaper = styled(Paper)(({ theme }) => ({
  width: "200px", // Fixed width
  height: "200px", // Fixed height
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  background: theme.palette.background.paper,
  boxShadow: "0 0 8px rgba(212, 47, 47, 0.5)",
  "&:hover": {
    boxShadow: "0 0 15px rgba(212, 47, 47, 0.7)",
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
  const [loadingMessage, setLoadingMessage] = useState(
    "Loading please wait..."
  );
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingMessage(
        "Sorry, free tier servers are sleeping. Try to reload."
      );
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleCharacterSelect = (characterName, characterId) => {
    navigate(
      `/character/combos/${characterName
        .split(" ")
        .join("-")
        .toLowerCase()}-combos/${characterId}`
    );
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
        {loadingMessage}
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
        marginTop: "100px",
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
      <h1
        style={{
          textAlign: "center",
          width: "100%",
          color: "#d42f2f",
          marginTop: isTabletOrMobile ? "350px" : "0px",
        }}
      >
        Pick your Character
      </h1>

      <Grid
        container
        spacing={2}
        justifyContent="flex-start"
        alignItems="center"
      >
        {characters.map((character) => (
          <Grid item xs={6} sm={6} md={4} lg={3} key={character._id}>
            <Tooltip title={character.name} placement="top">
              <ImagePaper
                elevation={3}
                onClick={() =>
                  handleCharacterSelect(character.name, character._id)
                }
              >
                <StyledImage src={character.image} alt={character.name} />
              </ImagePaper>
            </Tooltip>
          </Grid>
        ))}
        <Grid item xs={6} sm={6} md={4} lg={3}>
          <Tooltip title="Yoshi" placement="top">
            <ImagePaper elevation={3} onClick={() => navigate("/yoshi")}>
              <StyledImage
                src="https://media.discordapp.net/attachments/761706637223919659/1232697163344252999/Ebi4cTBWAAUHvZ9.jpg?ex=662a6632&is=662914b2&hm=880a46e5273f4d7338fd7e7a10aeb0a8d3faddab1313f6145bf52abf427cf54f&=&format=webp&width=1140&height=847"
                alt="Yoshi"
              />
            </ImagePaper>
          </Tooltip>
        </Grid>
      </Grid>

      <Button
        color="inherit"
        component={Link}
        to="/update-request"
        sx={{
          mt: 2,
          display: "block",
          mx: "auto",
          "&:hover": {
            color: "rgba(212, 47, 47, 1)",
          },
        }}
      >
        Your Main Character is not here?
      </Button>
    </Container>
  );
};

export default CharacterSelect;
