import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

const UpdateRequest = () => {
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
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Request Character Updates
        </Typography>
        <Typography variant="body1" paragraph>
          Is your main character missing the latest combos? Do you feel like
          your favorite character needs more spotlight? We've got you covered!
        </Typography>
        <Typography variant="body1" paragraph>
          If you’d like to request an update or prioritize a character, you can
          reach out directly via Discord. Contact @ariime and let us know what
          you need. Your feedback and contributions help Tekken Tactician stay
          up-to-date and valuable for the entire community.
        </Typography>
        <Typography variant="body1" paragraph>
          Alternatively, you can show your support and help expedite character
          updates by donating to our Ko-fi page. Your support is greatly
          appreciated and helps us dedicate more resources to improve and expand
          our content faster.
        </Typography>
        <Typography variant="body1" paragraph>
          <Link
            href="https://ko-fi.com/ariime"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support on Ko-fi
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default UpdateRequest;
