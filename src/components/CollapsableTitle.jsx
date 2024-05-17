import { Box, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const CollapsableTitle = ({ toggleState, collapseFn, title, clr }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        padding: "0 10px",
        color: clr,
      }}
    >
      <h2>{title}</h2>
      <div style={{ marginBottom: "10px" }}>
        <IconButton onClick={collapseFn}>
          {toggleState ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
    </Box>
  );
};

export default CollapsableTitle;
