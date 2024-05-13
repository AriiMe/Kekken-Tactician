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

const Credits = () => {
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
          Credits
        </Typography>
        <Typography variant="body1" sx={paragraphStyle}>
          This new look to our website was made possible thanks to Komrad's
          contributions, our Front-end Developer. Feel free to reach out to him
          on Reddit{" "}
          <Link
            href="https://www.reddit.com/user/KomradDaddy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            u/KomradDaddy
          </Link>{" "}
          or on discord{" "}
          <span
            style={{
              color: "#c62828",
            }}
          >
            @ komrad_ali_2019
          </span>
          .
        </Typography>

        <Typography variant="body1" sx={paragraphStyle}>
          Massive thanks to{" "}
          <Link
            href="https://www.reddit.com/user/natayaway/"
            target="_blank"
            rel="noopener noreferrer"
          >
            u/natayaway
          </Link>{" "}
          ,{" "}
          <Link
            href="https://www.reddit.com/user/cantbelieveudonethi5/"
            target="_blank"
            rel="noopener noreferrer"
          >
            u/cantbelieveudonethi5
          </Link>{" "}
          for the Amazing Icons. And a big thanks to Applay for letting me Yoink
          their spreadsheets. Join{" "}
          <Link
            href="https://discord.gg/3c786SX3rj"
            target="_blank"
            rel="noopener noreferrer"
          >
            Applay's Discord
          </Link>{" "}
          and spam AriiMe brought me here in #general.
        </Typography>

        <Typography variant="body1" sx={paragraphStyle}>
          A MILLION THANKS to our Ko-Fi supporters{" "}
          <span
            style={{
              color: "#c62828",
            }}
          >
            Ballfondler{" "}
          </span>{" "}
          and{" "}
          <span
            style={{
              color: "#c62828",
            }}
          >
            Hosam
          </span> with your help, we can make this website better, by renting high quality serers and more!
        </Typography>
      </Box>
    </Container>
  );
};

export default Credits;
