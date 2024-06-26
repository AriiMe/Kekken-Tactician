import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

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
          About Tekken Tactician
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          Welcome to Tekken Tactician, a hobby project created by enthusiast for
          enthusiasts. My goal is to provide a comprehensive platform where
          players of all skill levels can come to learn and share different
          combos and strategies for their favorite characters in the Tekken
          series.
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          Whether you're a seasoned veteran looking to refine your playstyle or
          a new player trying to get the hang of the basics, Tekken Tactician is
          here to help. We believe in the spirit of community and the sharing of
          knowledge, so every contribution and feedback is valued as we strive
          to make this the ultimate resource for Tekken players around the
          globe.
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          Dive into our extensive database of combos, explore character-specific
          tactics, and take your game to the next level. Tekken Tactician is
          more than just a guide – it's a gateway to mastering the art of
          Tekken. The Page is still growing and I have many plans to upgrade
          this page so stay tuned! Every donation helps to keep the page
          running.{" "}
          <Link
            href="https://ko-fi.com/ariime"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support on Ko-fi
          </Link>{" "}
          or not I'm not your mom.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
