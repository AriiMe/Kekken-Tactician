import { Box, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
  children,
}) => {
  return (
    <Box
      sx={{
        ...flexBaselineBetween,
        flexDirection: "column",
        padding: "0 10px",
        color: clr,
        ...styles
      }}
    >
      <Box sx={{ ...flexBaselineBetween, width: "100%" }}>
        <h2 style={{color: "#d42f2f"}}>{title}</h2>
        <div style={{ marginBottom: "10px" }}>
          <IconButton onClick={collapseFn}>
            {toggleState ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
      </Box>
      <Box
        style={{
          transition: "width 0.3s",
          overflowX: "auto",
          width: "100%",
          display: toggleState ? "none" : "block",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default CollapsableSection;
