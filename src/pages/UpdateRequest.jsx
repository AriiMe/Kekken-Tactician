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
          If you see a scrub wrote combos for your main, let me know! I'll
          gladly update the combos. Reach out to @ariime on Discord and tell me
          what you need. Your feedback and contributions help Tekken Tactician
          stay fresh and valuable for the entire community.
        </Typography>
        <Typography variant="body1" paragraph>
          Alternatively, if you want to show some love and help me work faster,
          consider donating to my Ko-fi page. Your support is greatly
          appreciated and helps me dedicate more resources to improve and expand
          the content. As a bonus the performance of the site will be
          drastically improved.
        </Typography>
        <Typography variant="body1" paragraph>
          Only people with massive PP donate on
          <Link
            href="https://ko-fi.com/ariime"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Ko-fi!
          </Link>{" "}
          Supercharge the updates and turbocharge the server performance. Your
          contribution is the secret sauce(268161)!
        </Typography>
      </Box>
    </Container>
  );
};

export default UpdateRequest;
