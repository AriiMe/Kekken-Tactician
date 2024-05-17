import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Box, Typography, Avatar } from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { FaTwitch, FaDiscord } from "react-icons/fa";
import XIcon from "@mui/icons-material/X";
import CollapsableTitle from "./CollapsableTitle";
import renderInputImage from "../utils/renderInputImage";
import Link from "@mui/material/Link";
import "./CreatorNotes.css"; // Import the CSS file

const renderSocialMediaIcon = (icon) => {
  switch (icon) {
    case "youtube":
      return <YouTubeIcon sx={{ fontSize: "2.5rem" }} />;
    case "twitch":
      return <FaTwitch sx={{ fontSize: "2.5rem" }} />;
    case "twitter":
      return <XIcon sx={{ fontSize: "2.5rem" }} />;
    case "discord":
      return <FaDiscord sx={{ fontSize: "2.5rem" }} />;
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
          >
            <Typography
              variant="h6"
              className="author-name"
              sx={{ fontFamily: "Michroma", color: "rgba(212, 47, 47, 1)" }}
            >
              {creatorNotes.author}
            </Typography>
          </Link>
          <Link
            href={creatorNotes.socialMediaLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Avatar
              sx={{
                bgcolor: "transparent",
                color: "rgba(212, 47, 47, 1)",
              }}
            >
              {renderSocialMediaIcon(creatorNotes.socialMediaIcon)}
            </Avatar>
          </Link>
        </Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            fontFamily: "Michroma",
            color: "rgba(212, 47, 47, 1)",
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
        {Object.keys(aggregatedNotes).map((title, index) => (
          <Box key={index} className="note">
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", fontFamily: "Michroma" }}
            >
              {title}
            </Typography>
            {aggregatedNotes[title].map((note, idx) => (
              <Box key={idx} className="note">
                {note.move && (
                  <Box className="move-info">
                    <Typography
                      variant="subtitle2"
                      className="move-title"
                      sx={{ fontFamily: "Michroma" }}
                    >
                      Move:
                    </Typography>
                    {renderInputImage(note.move)}
                  </Box>
                )}
                {note.content && (
                  <Typography
                    className="note-content"
                    sx={{ fontFamily: "Michroma" }}
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
