import { Container } from "@mui/material";

const KomradEasterEgg = () => {
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
        <p>No mountain, no sea,</p>
        <p> No thing of this world</p>
        <p>Could keep us apart,</p>
        <p> Because this is not my world...</p>
        <p> You are</p>
        <p style={{ marginTop: "3rem", color: "#b01010" }}>
          {" "}
          - A certain Tanned Mommy
        </p>
      </div>
    </Container>
  );
};

export default KomradEasterEgg;
