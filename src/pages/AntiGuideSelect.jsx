import { usePageData } from '../context/PageDataContext';
import { Button, Container, Grid, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCharacters } from "../utils/apiClient";

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
  const initialData = usePageData();
  const [characters, setCharacters] = useState(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState("");
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    if (!initialData) setLoading(true);
    setError("");

    getCharacters({ view: "summary", signal: controller.signal })
      .then((data) => {
        const filteredData = data.filter(
          (character) =>
            character.hasCounterGuide ||
            Array.isArray(character.counterSchema) &&
            character.counterSchema.length > 0
        );

        setCharacters(filteredData);
        setLoading(false);
      })
      .catch((requestError) => {
        if (requestError.name === "AbortError") return;
        console.error("Error fetching characters:", requestError);
        setError(
          "The Tekken 8 guide server could not be reached. It may still be waking up."
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [requestKey, initialData]);

  if (loading) {
    return (
      <Container sx={{ minHeight: "100vh", pt: 18, textAlign: "center" }}>
        <Typography>Loading anti-guides...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ minHeight: "100vh", pt: 18, textAlign: "center" }}>
        <Typography sx={{ mb: 2 }}>{error}</Typography>
        <Button variant="contained" onClick={() => setRequestKey((key) => key + 1)}>
          Try again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: "10rem", marginBottom: "5rem" }}>
      <h1
        style={{
          textAlign: "center",
          width: "100%",
          color: "#d42f2f",
          marginTop: "150px",
          marginBottom: "5rem",
          fontSize: "3rem",
        }}
      >
        Tekken 8 Matchup Guides
      </h1>
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
            <Link to={`/anti-guide/character/${character._id}`} aria-label={`${character.name} matchup guide`}><StyledImage
              src={character.image}
              alt={character.name}
              sx={{ objectPosition: "top" }}
            /></Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AntiGuideSelect;
