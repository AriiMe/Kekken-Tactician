import { Box, Container, Link, Typography } from "@mui/material";
import React from "react";
const paragraphStyle = {
  fontSize: "1rem",
  textAlign: "center",
  width: "71%",
  margin: "1rem auto",
  fontFamily: "Michroma",
  letterSpacing: "1px",
  lineHeight: "2",
  "@media (max-width: 1100px)": {
    fontSize: ".8rem",
    width: "90%",
  },
};
const NotFoundPage = () => {
  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
          pt: 20,
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
            margin: "0 auto 4rem",
            "@media (max-width: 1100px)": {
              fontSize: "2rem",
              width: "90%",
            },
          }}
        >
          wtf are you doing here?
        </Typography>
        <Typography variant="body1" paragraph sx={paragraphStyle}>
          You're not supposed to be here. Go back to the
          <Link href="/" rel="noopener noreferrer">
            {" "}
            main page
          </Link>
          .{" "}
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
