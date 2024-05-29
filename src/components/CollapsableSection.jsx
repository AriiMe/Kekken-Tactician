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
  children,
}) => {
  return (
    <Box
      sx={{
        ...flexBaselineBetween,
        flexDirection: "column",
        padding: "0 10px",
        color: clr,
      }}
    >
      <Box sx={{ ...flexBaselineBetween, width: "100%" }}>
        <h2>{title}</h2>
        <div style={{ marginBottom: "10px" }}>
          <IconButton onClick={collapseFn}>
            {toggleState ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
      </Box>
      <div
        style={{
          transition: "width 0.3s",
          overflowX: "auto",
          width: "100%",
          display: toggleState ? "none" : "block",
        }}
      >
        {children}
      </div>
    </Box>
  );
};

export default CollapsableSection;
