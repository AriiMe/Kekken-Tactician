import React, { useState, useContext, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useNavigate, Link } from "react-router-dom";
import { DisplayModeContext } from "../context/DisplayModeContext";
import { ColorModeContext } from "../context/ColorModeContext";
import { Container, Popover } from "@mui/material";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
//----------------------------------------------------------
//----------------------------------------------------------

function Navbar() {
  const navigate = useNavigate();
  const { colorMode, setColorMode } = useContext(ColorModeContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState(colorMode);
  const { displayMode, setDisplayMode } = useContext(DisplayModeContext);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "preferences-popover" : undefined;

  const handlePopoverClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleDisplayModeChange = () => {
    const newDisplayMode = displayMode === "icons" ? "notations" : "icons";
    setDisplayMode(newDisplayMode);
  };
  const handleColorModeChange = () => {
    const newColorMode = !colorMode;
    setColorMode(newColorMode);
    setSelected(newColorMode); // Use newColorMode directly
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    setSelected(colorMode);
  }, [colorMode, displayMode]);

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/combo-generator">
            <ListItemText primary="Combo Generator" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/update-request">
            <ListItemText primary="Request an Update" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/about">
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="https://ko-fi.com/ariime"
            target="_blank"
          >
            <ListItemText primary="Support on Ko-fi" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" sx={{ background: "#331a16" }}>
      <Container maxWidth="xl" sx={{ padding: ".6rem 0" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate("/")}
            sx={{
              flexGrow: 1,
              color: "#c82427",
              cursor: "pointer",
              fontSize: "1.6rem",
              fontFamily: "Michroma",
              "&:hover": {
                color: "white",
                // color: "rgba(212, 47, 47, 1)",
              },
            }} // Ensures it takes up space and aligns links to the right
          >
            Tekken Tactician
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", sm: "flex" },
              justifyContent: "flex-end",
            }}
          >
            {window.location.pathname.includes("/character/combos/") ||
            window.location.pathname.includes("/combo-generator") ? (
              <>
                <ToggleButtonGroup
                  value={displayMode === "icons" ? "icons" : null} // Ensures the toggle reflects the state
                  exclusive
                  onChange={handleDisplayModeChange}
                  aria-label="display mode"
                >
                  <ToggleButton
                    value="icons"
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "rgba(212, 47, 47, 1)", // Red when selected

                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(212, 47, 47, 0.8)", // Slightly lighter red on hover
                        },
                      },
                      fontSize: isMobile ? "0.7rem" : "1rem",
                      backgroundColor: displayMode !== "icons" ? "grey" : "", // Grey when not selected
                      color:
                        displayMode !== "icons"
                          ? "rgba(255, 255, 255, 0.7)"
                          : "", // Lower opacity white when not selected
                      "&:hover": {
                        boxShadow: "0 0 15px rgba(212, 47, 47, 1)", // Red shadow on hover
                        border: "1px solid rgba(212, 47, 47, 1)",
                        cursor: "pointer",
                      },
                    }}
                  >
                    {displayMode === "icons" ? "Icons: ON" : "Icons: OFF"}
                  </ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup
                  value={selected}
                  exclusive
                  onChange={handleColorModeChange}
                  aria-label="text color mode"
                >
                  <ToggleButton
                    key={selected ? "selected" : "not-selected"} // Change key based on selected state
                    value="colors"
                    selected={selected}
                    onChange={handleColorModeChange}
                    sx={{
                      fontSize: isMobile ? "0.7rem" : "1rem",
                      backgroundColor: selected
                        ? "gba(76, 175, 80, 1)"
                        : "grey", // Use "transparent" instead of ""
                      color: selected ? "" : "rgba(255, 255, 255, 0.7)",
                      "&.Mui-selected": {
                        backgroundColor: "rgba(76, 175, 80, 1)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(76, 175, 80, 0.8)",
                        },
                      },
                      "&:hover": {
                        boxShadow: "0 0 15px rgba(212, 47, 47, 1)",
                        border: "1px solid rgba(212, 47, 47, 1)",
                        cursor: "pointer",
                      },
                    }}
                    aria-label="color mode"
                  >
                    {selected ? "Colors: ON" : "Colors: OFF"}
                  </ToggleButton>
                </ToggleButtonGroup>
              </>
            ) : null}
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              justifyContent: "flex-end",
              gap: "20px",
            }}
          >
            {/* Aligns items to the right */}
            <IconButton
              href="https://google.com"
              sx={{
                "&:hover": {
                  color: "#c82427",
                },
              }}
            >
              <XIcon />
            </IconButton>
            <IconButton
              href="https://google.com"
              sx={{
                "&:hover": {
                  color: "#c82427",
                },
              }}
            >
              <YouTubeIcon />
            </IconButton>
            <IconButton
              href="https://google.com"
              sx={{
                "&:hover": {
                  color: "#c82427",
                },
              }}
            >
              <FacebookIcon />
            </IconButton>
            <Box sx={{ display: "flex" }}>
              <Button
                variant="contained"
                sx={{
                  fontSize: ".8rem",
                  fontWeight: 700,
                  marginLeft: "1.5rem",
                  borderRadius: "100px",
                }}
                onClick={handlePopoverClick}
              >
                Preferences
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Box
                  sx={{
                    minHeight: "100px",
                    minWidth: "100px",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Box>Colors:</Box>
                  <Box>Icons:</Box>
                </Box>
              </Popover>
            </Box>

            {/* <Button
              color="inherit"
              component={Link}
              to="/update-request"
              sx={{
                "&:hover": {
                  color: "rgba(212, 47, 47, 1)",
                },
              }}
            >
              Request an Update
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/about"
              sx={{
                "&:hover": {
                  color: "rgba(212, 47, 47, 1)",
                },
              }}
            >
              About
            </Button>
            <Button
              color="inherit"
              component="a"
              href="https://ko-fi.com/ariime"
              target="_blank"
              sx={{
                "&:hover": {
                  color: "rgba(212, 47, 47, 1)",
                },
              }}
            >
              Support on Ko-fi
            </Button> */}
          </Box>
          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
