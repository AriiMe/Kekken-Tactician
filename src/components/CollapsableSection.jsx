import { Box, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PropTypes from "prop-types";

const flexBaselineBetween = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
};

const CollapsableSection = ({
  toggleState,
  collapseFn,
  title,
  clr,
  styles,
  contentStyles,
  children,
}) => {
  return (
    <Box
      sx={{
        ...flexBaselineBetween,
        flexDirection: "column",
        padding: "0 10px",

        color: clr,
        ...styles,
      }}
    >
      <Box sx={{ ...flexBaselineBetween, width: "100%" }}>
        <h2 style={{ color: "#d42f2f" }}>{title}</h2>
        <div style={{ marginBottom: "10px" }}>
          <IconButton onClick={collapseFn} aria-expanded={!toggleState}
            aria-label={`${toggleState ? "Expand" : "Collapse"} ${typeof title === "string" ? title : "section"}`}>
            {toggleState ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
      </Box>
      <Box
        style={{
          transition: "width 0.3s",
          overflowX: "auto",
          width: "100%",
          height: "fit-content",
          display: toggleState ? "none" : "block",
          ...contentStyles,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

CollapsableSection.propTypes = {
  toggleState: PropTypes.bool.isRequired,
  collapseFn: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
  clr: PropTypes.string,
  styles: PropTypes.object,
  contentStyles: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export default CollapsableSection;
