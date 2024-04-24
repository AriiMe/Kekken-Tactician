import React from "react";
import renderInputImage from "../utils/renderInputImage";

const Yoshi = () => {
  return (
    <div
      id="meme-yoshi"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "40%",
      }}
    >
      {renderInputImage("1+4")}
    </div>
  );
};

export default Yoshi;
