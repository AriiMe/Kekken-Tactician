import { Container } from "@mui/material";
import Construction from "../assets/construction.png";

const AntiGuideSelect = () => {
  return (
    <Container maxWidth="md" sx={{ height: "20vh" }}>
      <div
        style={{
          fontFamily: "Michroma",
          color: "white",
          marginTop: "250px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <img
          src={Construction}
          width={300}
          height={200}
          style={{ marginBottom: "3rem" }}
        />
        <p>This Page is Currently Under Construction</p>
        <p> We Will Add it Soon</p>
      </div>
    </Container>
  );
};

export default AntiGuideSelect;
