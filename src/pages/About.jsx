import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { siteLinks } from "../data/siteLinks";

const paragraphStyle = {
  fontSize: "1rem",
  textAlign: "left",
  width: "70%",
  margin: "1.25rem auto",
  fontFamily: "Michroma",
  letterSpacing: "1px",
  lineHeight: "2",
  "@media (max-width: 1100px)": {
    fontSize: ".8rem",
    width: "90%",
  },
};

const About = () => {
  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          pt: 20,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            color: "rgba(212, 47, 47, 1)",
            fontFamily: "Michroma",
            width: "70%",
            margin: "0 auto 3rem",
            "@media (max-width: 1100px)": {
              fontSize: "2rem",
              width: "90%",
            },
          }}
        >
          About TEKKTICIAN
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          Welcome to TEKKTICIAN, formerly known as Tekken Tactician. This is the
          same community project under a new name, created by an enthusiast for
          enthusiasts. The goal is to give players of every skill level one
          practical place to learn and share combos, punishment and matchup
          strategies across the fighting games they love.
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          Whether you’re a seasoned veteran looking to refine your playstyle or
          a new player trying to get the hang of the basics, TEKKTICIAN is
          here to help. We believe in the spirit of community and the sharing of
          knowledge, so every contribution and feedback is valued as we strive
          to make this a genuinely useful resource for fighting-game players
          around the globe. Tekken 8 is the first live library, with more games
          joining it over time.
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          Dive into our extensive database of combos, explore character-specific
          tactics, and take your game to the next level. TEKKTICIAN is more than
          a move list: it is a growing, community-shaped lab for turning tech
          into a real gameplan. Every donation helps to keep the page
          running.{" "}
          <Link
            href={siteLinks.koFi}
            target="_blank"
            rel="noopener noreferrer"
          >
            Support on Ko-fi
          </Link>{" "}
          or not—I’m not your mom.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
