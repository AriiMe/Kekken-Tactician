import { useState } from "react";
import { Helmet } from "react-helmet";
import { Box, Typography } from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { FaTwitch, FaDiscord } from "react-icons/fa";
import XIcon from "@mui/icons-material/X";
import CollapsableTitle from "./CollapsableTitle";
import renderInputImage from "../utils/renderInputImage";
import Link from "@mui/material/Link";
import "./CreatorNotes.css"; // Import the CSS file

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

const CreatorNotes = ({ creatorNotes, name }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const description = `Notes from ${creatorNotes.author} for ${name} in Tekken 8. Learn the best combos, pressure tools, and strategies from experienced players.`;
  const keywords = [
    "Tekken 8",
    `${name} combos`,
    `${name} pressure tools`,
    `${creatorNotes.author} notes`,
    `${creatorNotes.author} combos`,
    `${creatorNotes.author} Tekken 8`,
    "Content creator notes",
    "Tekken 8 strategies",
    "Tekken 8 tips",
    "Tekken 8 combos",
    "Tekken 8 pressure tools",
  ].join(", ");
  // Aggregate notes by title
  const aggregatedNotes = aggregateNotesByTitle(creatorNotes.notes);
  return (
    <div className="creator-notes">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>

      <CollapsableTitle
        title="Creator Notes"
        toggleState={isCollapsed}
        collapseFn={toggleCollapse}
        clr="rgba(212, 47, 47, 1)"
      />

      <Box
        sx={{
          transition: "width 0.3s",
          marginLeft: "20px",
          overflowX: "auto",
          display: isCollapsed ? "none" : "block",
        }}
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
      </Box>
    </div>
  );
};

export default CreatorNotes;
