import { Box, Button, Container, Grid, Link, Typography } from "@mui/material";

const footerContent = [
  {
    text: "Request an Update",
    link: "/update-request",
    isExternal: false,
  },
  {
    text: "About",
    link: "/about",
    isExternal: false,
  },
  {
    text: "Support On KO-FI",
    link: "https://ko-fi.com/ariime",
    isExternal: true,
  },
];

const Footer = () => {
  return (
    <Box
      sx={{
        background: "#161616",
        width: "100%",
        marginTop: "5rem",
        padding: "1rem 0",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box>
          <Button
            variant="contained"
            sx={{ fontWeight: "700", background: "#852728" }}
          >
            Your Main Is Not Here?
          </Button>
        </Box>
        <Grid
          container
          sx={{ margin: "2rem auto" }}
          columnSpacing={2}
          rowSpacing={2}
        >
          {footerContent.map((item) => (
            <Grid
              item
              key={item.link}
              xs={12}
              sm={6}
              md={4}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Link href={item.link} target="_blank" style={{ color: "white" }}>
                {item.text}
              </Link>
            </Grid>
          ))}
        </Grid>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Michroma",
          }}
        >
          This Website Is NOT Associated with Bandai Namco
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;