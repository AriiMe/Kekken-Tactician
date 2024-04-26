import React from "react";

import { Typography } from "@mui/material";

const Yoshi = () => {
  return (
    <div
      id="meme-yoshi"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <img
        src="/icons/1+4.webp"
        style={{ width: "200px", marginBottom: "30px" }}
        alt="1+4"
      />
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: "#d42f2f" }}
      >
        JK, it's loading please wait...
      </Typography>
    </div>
  );
};

export default Yoshi;
