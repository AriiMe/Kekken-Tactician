import renderInputImage from "../utils/renderInputImage";
import "./HeatDash.css";
import PropTypes from "prop-types";

// heat dash explanation box

export const HeatDash = ({ heat }) => {
  return (
    <div className="heat-system combo-section">
      <h2 style={{ padding: "0 10px" }}>Max Damage combo enders with Heat</h2>
      <ul
        className="my-li"
        style={{
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <li>
          {renderInputImage(heat.engager)} {renderInputImage("~F")}{" "}
        </li>
        <li>{renderInputImage("heat")}</li>
        <li>{renderInputImage(heat.ender)}</li>
      </ul>
    </div>
  );
};

HeatDash.propTypes = {
  heat: PropTypes.shape({
    engager: PropTypes.string.isRequired,
    ender: PropTypes.string.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
};
