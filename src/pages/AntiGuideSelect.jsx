import { Container, Grid, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StyledImage = styled("img")({
  width: "125px",
  height: "125px",
  objectFit: "cover",
  borderRadius: "10px",
  border: "1px solid #a83e2d",
  transition: "transform 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.1)",
  },
});

const AntiGuideSelect = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    "Loading please wait..."
  );
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/characters`)
      .then((response) => response.json())
      .then((data) => {
        setCharacters(data);

        setLoading(false);
      })
      .catch((error) => console.error("Error fetching characters:", error));
  }, [apiUrl]);

  const handleCharacterNavigate = (id) => {
    console.log(id);
    navigate(`/anti-guide/character/${id}`)
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: "10rem", marginBottom: "5rem" }}>
      <h2
        style={{
          textAlign: "center",
          width: "100%",
          color: "#d42f2f",
          marginTop: "150px",
          marginBottom: "5rem",
          fontSize: "3rem",
        }}
      >
        Choose Your Nemises
      </h2>
      <Grid container rowSpacing={2}>
        {characters.map((character) => (
          <Grid
            item
            key={character._id}
            xs={6}
            sm={3}
            md={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StyledImage
              src={character.image}
              alt={character.name}
              onClick={() => handleCharacterNavigate(character._id)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AntiGuideSelect;
