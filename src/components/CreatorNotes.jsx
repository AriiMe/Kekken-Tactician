import { useState } from "react";
import { Box, Typography } from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { FaTwitch, FaDiscord } from "react-icons/fa";
import XIcon from "@mui/icons-material/X";
import renderInputImage from "../utils/renderInputImage";
import Link from "@mui/material/Link";
import "./CreatorNotes.css"; // Import the CSS file
import CollapsableSection from "./CollapsableSection";
import PropTypes from "prop-types";

const primaryRed = { color: "rgba(212, 47, 47, 1)" };
const creatorSocialIconStyling = {
  fontSize: "1.125rem",
  marginLeft: ".5rem",
  marginBottom: "-.2rem",
  // ...primaryRed,
};

const renderSocialMediaIcon = (icon) => {
  switch (icon) {
    case "youtube":
      return <YouTubeIcon sx={creatorSocialIconStyling} />;
    case "twitch":
      return <FaTwitch sx={creatorSocialIconStyling} />;
    case "twitter":
      return <XIcon sx={creatorSocialIconStyling} />;
    case "discord":
      return <FaDiscord sx={creatorSocialIconStyling} />;
    default:
      return null;
  }
};

// Function to aggregate notes by title
const aggregateNotesByTitle = (notes) => {
  const aggregatedNotes = {};

  notes.forEach((note) => {
    if (!aggregatedNotes[note.title]) {
      aggregatedNotes[note.title] = [];
    }
    aggregatedNotes[note.title].push({
      move: note.move || "",
      content: note.content || "",
    });
  });

  return aggregatedNotes;
};

const CreatorNotes = ({ creatorNotes }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Aggregate notes by title
  const aggregatedNotes = aggregateNotesByTitle(creatorNotes.notes);
  return (
    <div className="creator-notes">

      <CollapsableSection
        title="Creator Notes"
        toggleState={isCollapsed}
        collapseFn={toggleCollapse}
        clr="rgba(212, 47, 47, 1)"
      >
        <Box className="author-info">
          <Link
            href={creatorNotes.socialMediaLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <Box
              className="author-name"
              sx={{
                fontFamily: "Michroma",
                color: "white",
                display: "flex",
                marginBottom: "2rem ",
              }}
            >
              <span>Those notes were brought to you by: </span>
              <Box
                sx={{
                  ...primaryRed,
                  display: "flex",
                  alignItems: "center",
                  "&:hover": { color: "white" },
                }}
              >
                {renderSocialMediaIcon(creatorNotes.socialMediaIcon)}{" "}
                {creatorNotes.author}.
              </Box>
            </Box>
          </Link>
        </Box>
        <Box sx={{ marginBottom: "3rem" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontFamily: "Michroma",
              ...primaryRed,
              marginBottom: "1em",
            }}
          >
            Staple Combo:
          </Typography>
          <Box className="combo-container">
            {creatorNotes.stapleCombo.map((move, index) => (
              <Box key={index} className="combo-move">
                {index > 0 && renderInputImage('into')}
                {renderInputImage(move)}
              </Box>
            ))}
          </Box>
        </Box>
        {Object.keys(aggregatedNotes).map((title, index) => (
          <Box key={index} className="note">
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontFamily: "Michroma",
                ...primaryRed,
              }}
            >
              {title}
            </Typography>
            {aggregatedNotes[title].map((note, idx) => (
              <Box key={idx} className="note">
                {note.move && (
                  <Box className="move-info">
                    <Typography
                      variant="subtitle1"
                      className="move-title"
                      sx={{
                        fontFamily: "Michroma",
                      }}
                    >
                      Move:
                    </Typography>
                    {renderInputImage(note.move)}
                  </Box>
                )}
                {note.content && (
                  <Typography
                    className="note-content"
                    sx={{
                      fontFamily: "Inter",
                      letterSpacing: ".5px",
                      fontSize: "1.1rem",
                      lineHeight: "1.5em",
                    }}
                  >
                    {note.content}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </CollapsableSection>
    </div>
  );
};

CreatorNotes.propTypes = {
  creatorNotes: PropTypes.shape({
    author: PropTypes.string.isRequired,
    notes: PropTypes.arrayOf(PropTypes.object).isRequired,
    socialMediaIcon: PropTypes.string,
    socialMediaLink: PropTypes.string.isRequired,
    stapleCombo: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
};

export default CreatorNotes;
