import React from "react";
import { Container, Typography, Link } from "@mui/material";

const Privacy = () => (
  <Container sx={{ marginTop: "150px" }}>
    <Typography variant="h4" gutterBottom>
      Privacy Policy
    </Typography>
    <Typography variant="body1" paragraph>
      We value your privacy and are committed to protecting your personal data.
      This Privacy Policy will inform you about how we handle your personal data
      when you visit our website.
    </Typography>
    <Typography variant="h5" gutterBottom>
      What Data We Collect
    </Typography>
    <Typography variant="body1" paragraph>
      We use Umami Analytics to understand how visitors interact with our
      website. Umami does not use cookies and does not collect personal data.
      All data is anonymized and used solely to improve website performance and
      user experience.
    </Typography>
    <Typography variant="h5" gutterBottom>
      How We Use Your Data
    </Typography>
    <Typography variant="body1" paragraph>
      The anonymized data collected through Umami Analytics helps us to:
      <ul>
        <li>To check how are the loading times and performance</li>
        <li>Improve our website’s performance and user experience</li>
        <li>Understand which pages are most popular</li>
        <li>Identify and fix technical issues</li>
      </ul>
    </Typography>
    <Typography variant="h5" gutterBottom>
      Your Rights
    </Typography>
    <Typography variant="body1" paragraph>
      You have the right to:
      <ul>
        <li>
          Request access to your data, but remember since it is anonymized, we
          cannot provide an exact match.
        </li>
        <li>
          Request deletion of your data; however, as the data is anonymized, we
          cannot identify individual records to delete. The data get's cleared
          on a yearly basis.
        </li>
      </ul>
      For any concerns or questions about your data privacy, please contact us
      at our{" "}
      <Link
        href="https://discord.gg/d2Czp4Kj75"
        target="_blank"
        rel="noopener noreferrer"
      >
        {" "}
        Discord server
      </Link>
      .
    </Typography>
  </Container>
);

export default Privacy;
