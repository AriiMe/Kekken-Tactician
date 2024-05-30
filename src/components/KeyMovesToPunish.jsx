import { Box } from "@mui/material";
import CollapsableSection from "./CollapsableSection";
import { useState } from "react";

const KeyMovesToPunish = ({ keyMovesArr }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  console.log(keyMovesArr);
  return (
    <Box>
      <CollapsableSection
        title={"Key Moves To Punish:"}
        toggleState={isCollapsed}
        collapseFn={toggleCollapse}
        styles={{ padding: "0" }}
      >
        hi bish
      </CollapsableSection>
    </Box>
  );
};

export default KeyMovesToPunish;
