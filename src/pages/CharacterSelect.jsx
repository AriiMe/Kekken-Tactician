import { usePageData } from '../context/PageDataContext';
import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import UselessTipps from "../components/UselessTipps";
import { Box, IconButton, Link } from "@mui/material";
import { Link as ScrollLink, animateScroll } from "react-scroll";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { getCharacters } from "../utils/apiClient";
import { characterPath } from '../utils/seo';
import CharacterPortrait from '../components/CharacterPortrait';
import { getTekken8Portrait } from '../data/tekken8Portraits';

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

const paragraphStyle = {
  fontSize: "1.5rem",
  textAlign: "center",
  width: "70%",
  margin: "1.25rem auto",
  fontFamily: "Michroma",
  letterSpacing: "1px",
  lineHeight: "2",
  "@media (max-width: 1100px)": {
    fontSize: "1rem",
    width: "90%",
  },
};

const CharacterSelect = () => {
  const initialData = usePageData();
  const [characters, setCharacters] = useState(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [loadingMessage, setLoadingMessage] = useState(
    "Loading please wait..."
  );
  const [error, setError] = useState("");
  const [requestKey, setRequestKey] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [alphabet, setAlphabet] = useState(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => ({ letter, active: (initialData || []).some(c => c.name[0].toUpperCase() === letter) })));
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    if (!initialData) setLoading(true);
    setError("");
    setLoadingMessage("Loading please wait...");

    getCharacters({ view: "summary", signal: controller.signal })
      .then((data) => {
        setCharacters(data);

        const fullAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const newAlphabet = fullAlphabet.map((letter) => ({
          letter,
          active: data.some(
            (character) => character.name[0].toUpperCase() === letter
          ),
        }));
        setAlphabet(newAlphabet);
        setLoading(false);
      })
      .catch((requestError) => {
        if (requestError.name === "AbortError") return;
        console.error("Error fetching characters:", requestError);
        setError(
          "The Tekken 8 guide server could not be reached. It may be waking up—please try again."
        );
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [requestKey, initialData]);

  useEffect(() => {
    if (!loading) return undefined;

    const timer = setTimeout(() => {
      setLoadingMessage(
        "Sorry, free tier servers are sleeping. Try to reload."
      );
    }, 5000);

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  if (error) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          py: 16,
          textAlign: "center",
        }}
      >
        <Typography
          component="p"
          sx={{
            color: "#ff354d",
            fontFamily: "Inter, sans-serif",
            fontSize: ".72rem",
            fontWeight: 800,
            letterSpacing: ".14em",
            textTransform: "uppercase",
          }}
        >
          Tekken 8 · Connection issue
        </Typography>
        <Typography
          component="h1"
          sx={{
            color: "white",
            fontFamily: "Inter, sans-serif",
            fontSize: { xs: "2.35rem", sm: "3.4rem" },
            fontWeight: 900,
            letterSpacing: "-.05em",
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          The lab is between rounds
        </Typography>
        <Typography sx={{ color: "#aaa", fontFamily: "Inter, sans-serif" }}>
          {error}
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "center", mt: 2 }}>
          <Button variant="contained" onClick={() => setRequestKey((key) => key + 1)}>
            Try again
          </Button>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Back to games
          </Button>
        </Box>
      </Container>
    );
  }
  const filterCharactersByLetter = (letter) => {
    return characters.filter((character) =>
      character.name.toUpperCase().startsWith(letter)
    );
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 !important",
        marginBottom: "80px",
      }}
    >

      <h1
        style={{
          textAlign: "center",
          width: "100%",
          color: "#d42f2f",
          marginTop: "150px",
          fontSize: "clamp(2.4rem, 7vw, 3.2rem)",
          lineHeight: 1.1,
        }}
      >
        Tekken 8 Combos & Character Guides
      </h1>
      <Typography variant="body1" sx={paragraphStyle}>
        Let’s help{" "}
        <Link
          href="https://www.twitch.tv/mishimacomplex"
          target="_blank"
          rel="noopener noreferrer"
        >
          MishimaComplex
        </Link>{" "}
        and{" "}
        <Link
          href="https://www.twitch.tv/notmasood"
          target="_blank"
          rel="noopener noreferrer"
        >
          Masood
        </Link>{" "}
        grow on twitch!
      </Typography>

      <Container maxWidth="sm" sx={{ marginBottom: "3rem", marginTop: "2rem" }}>
        {alphabet.map(({ letter, active }) => (
          <ScrollLink
            key={letter}
            to={letter}
            smooth={true}
            duration={500}
            offset={-100}
            style={{
              pointerEvents: active ? "auto" : "none", // Disable pointer events for inactive letters
              opacity: active ? 1 : 0.4, // Grey out inactive letters
            }}
          >
            <IconButton
              sx={{
                fontSize: ".875rem",
                height: "35px",
                width: "35px",
                color: active ? "white" : "grey",
              }}
            >
              {letter}
            </IconButton>
          </ScrollLink>
        ))}
      </Container>

      <Typography
        variant="h5"
        component="h5"
        gutterBottom
        align="center"
        sx={{
          color: "rgba(212, 47, 47, 1)",
          maxWidth: "600px",
          transition: ".5s ease color",
          "&:hover": {
            color: "white",
          },
        }}
      >
        <UselessTipps />
      </Typography>

      <Container maxWidth="lg">
        {alphabet.map(({ letter }) => {
          // Make sure to destructure the letter and active properties
          const charactersWithLetter = filterCharactersByLetter(letter);
          if (charactersWithLetter.length > 0) {
            return (
              <div key={letter} id={letter}>
                <h2
                  style={{
                    borderBottom: "1px solid #c82427",
                    paddingBottom: "1rem",
                    margin: "5rem 0 2rem 0",
                  }}
                >
                  {letter}
                </h2>

                <Box sx={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
                  {charactersWithLetter.map((character) => (
                    <Tooltip
                      key={character.name}
                      title={character.name}
                      placement="top"
                    >
                      <ImagePaper
                        elevation={3}
                        component={RouterLink}
                        to={characterPath(character)}
                        aria-label={`${character.name} combos and guide`}
                      >
                        {getTekken8Portrait(character.image) ? (
                          <CharacterPortrait portrait={getTekken8Portrait(character.image)} name={character.name} />
                        ) : <StyledImage
                          src={character.image}
                          alt={character.name}
                          sx={{ objectPosition: "top", height: "13em" }}
                        />}
                      </ImagePaper>
                    </Tooltip>
                  ))}
                </Box>
              </div>
            );
          }
          return null;
        })}
      </Container>

      {showBackToTop && (
        <Button
          variant="contained"
          sx={{
            borderRadius: "100%",
            height: "60px",
            width: "60px",
            position: "fixed",
            bottom: "20px",
            right: "40px",
            background: "#d42f2f",
          }}
          onClick={() => animateScroll.scrollToTop()}
        >
          <ArrowUpwardIcon />
        </Button>
      )}

    </Container>
  );
};

export default CharacterSelect;
