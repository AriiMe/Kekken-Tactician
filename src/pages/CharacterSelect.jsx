import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { Helmet } from "react-helmet";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import UselessTipps from "../components/UselessTipps";
import { Box, IconButton, Modal } from "@mui/material";
import { Link as ScrollLink, animateScroll } from "react-scroll";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

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
  const theme = useTheme();
  const [characters, setCharacters] = useState([]);
  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    "Loading please wait..."
  );
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [alphabet, setAlphabet] = useState([]);
  const [activeLetters, setActiveLetters] = useState(new Set());
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/characters`)
      .then((response) => response.json())
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
        const activeSet = new Set(
          data.map((character) => character.name[0].toUpperCase())
        );
        setActiveLetters(activeSet);
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

  const handlePrivacyModalClose = () => {
    setPrivacyModalOpen(false);
    localStorage.setItem("privacyNoticeAccepted", "true");
  };

  useEffect(() => {
    if (!localStorage.getItem("privacyNoticeAccepted")) {
      setPrivacyModalOpen(true);
    }
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
          marginTop: "150px",
        }}
      >
        Pick your Character
      </h1>

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
        {alphabet.map(({ letter, active }) => {
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
                        onClick={() =>
                          handleCharacterSelect(character.name, character._id)
                        }
                      >
                        <StyledImage
                          src={character.image}
                          alt={character.name}
                          sx={{ objectPosition: "top", height: "13em" }}
                        />
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

      <Modal
        open={isPrivacyModalOpen}
        onClose={handlePrivacyModalClose}
        aria-labelledby="privacy-notice-title"
        aria-describedby="privacy-notice-description"
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            padding: 4,
            outline: "none",
            boxShadow: 5,
          }}
        >
          <Typography id="privacy-notice-title" variant="h6" component="h2">
            Privacy Notice
          </Typography>
          <Typography id="privacy-notice-description" sx={{ mt: 2 }}>
            We use Umami Analytics to understand how visitors interact with our
            website. Umami does not use cookies and does not collect personal
            data. All data is anonymized and used solely to improve website
            performance and user experience.
          </Typography>
          <Button
            onClick={handlePrivacyModalClose}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            I Understand
          </Button>
          <Button
            component="a"
            href="/privacy-policy"
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
          >
            Read Full Privacy Policy
          </Button>
        </Paper>
      </Modal>
    </Container>
  );
};

export default CharacterSelect;
