import { Box, Container, Link, styled, Typography } from "@mui/material";
import { siteLinks } from "../data/siteLinks";

const StyledPolicyTitle = styled(Typography)(() => ({
  fontFamily: "Michroma",
  color: "#c62828",
  marginTop: "2em",
}));

const Privacy = () => (
  <Container sx={{ margin: "150px auto 80px" }} maxWidth="md">
    <StyledPolicyTitle variant="h4" gutterBottom>
      Privacy Policy
    </StyledPolicyTitle>
    <Typography variant="body1" paragraph>
      Last updated September 10, 2026. This page explains the services and local
      preferences used when you visit TEKKTICIAN.
    </Typography>
    <StyledPolicyTitle variant="h5" gutterBottom>
      Analytics
    </StyledPolicyTitle>
    <Typography variant="body1" paragraph>
      We use{" "}
      <Link href="https://umami.is/privacy" target="_blank" rel="noopener noreferrer">
        Umami Analytics
      </Link>{" "}
      and{" "}
      <Link
        href="https://vercel.com/docs/analytics/privacy-policy"
        target="_blank"
        rel="noopener noreferrer"
      >
        Vercel Web Analytics
      </Link>{" "}
      to understand page traffic, devices and general usage. Their standard
      analytics products are designed to provide anonymous or aggregated data
      without third-party tracking cookies. Vercel Speed Insights also measures
      page performance so we can find slow or unstable experiences.
    </Typography>
    <StyledPolicyTitle variant="h5" gutterBottom>
      Advertising technology
    </StyledPolicyTitle>
    <Typography variant="body1" paragraph>
      The site includes Google AdSense code. Google states that AdSense may use
      cookies or similar technology to serve and measure advertising, depending
      on your region, browser and consent settings. You can review or change
      personalized-ad choices in{" "}
      <Link
        href="https://adssettings.google.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Google Ads Settings
      </Link>
      .
    </Typography>
    <StyledPolicyTitle variant="h5" gutterBottom>
      Preferences stored on your device
    </StyledPolicyTitle>
    <Typography variant="body1" paragraph>
      TEKKTICIAN uses browser local storage to remember your input-display mode,
      icon-color preference and whether you dismissed the privacy notice. These
      values stay on your device unless you clear your browser storage.
    </Typography>
    <StyledPolicyTitle variant="h5" gutterBottom>
      How the data helps
    </StyledPolicyTitle>
    <Box component="ul" sx={{ lineHeight: 1.8, marginTop: 0 }}>
      <li>Measure loading times and page stability.</li>
      <li>Understand which guides and tools are used most.</li>
      <li>Find navigation problems and technical errors.</li>
      <li>Improve the site without building individual visitor profiles.</li>
    </Box>
    <StyledPolicyTitle variant="h5" gutterBottom>
      Questions
    </StyledPolicyTitle>
    <Typography variant="body1" paragraph>
      For questions about privacy or the services used by TEKKTICIAN, contact us
      through the{" "}
      <Link
        href={siteLinks.discord}
        target="_blank"
        rel="noopener noreferrer"
      >
        Discord server
      </Link>
      .
    </Typography>
  </Container>
);

export default Privacy;
