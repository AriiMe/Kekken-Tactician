import React, { useState, useContext } from "react";
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

function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { displayMode, setDisplayMode } = useContext(DisplayModeContext);

  // Update displayMode when the toggle button is clicked
  const handleDisplayModeChange = (event, newDisplayMode) => {
    if (newDisplayMode !== null) {
      setDisplayMode(newDisplayMode);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
    <AppBar position="fixed">
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
            cursor: "pointer",
            "&:hover": {
              color: "rgba(212, 47, 47, 1)",
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
          <ToggleButtonGroup
            value={displayMode}
            exclusive
            onChange={handleDisplayModeChange}
          >
            <ToggleButton
              value="icons"
              sx={{
                "&:hover": {
                  boxShadow: "0 0 15px rgba(212, 47, 47, 0.7)",
                  border: "1px solid rgba(212, 47, 47, 1)",
                  cursor: "pointer",
                },
              }}
            >
              Icons
            </ToggleButton>
            <ToggleButton
              value="notations"
              sx={{
                "&:hover": {
                  boxShadow: "0 0 15px rgba(212, 47, 47, 0.7)",
                  border: "1px solid rgba(212, 47, 47, 1)",
                  cursor: "pointer",
                },
              }}
            >
              Notations
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", sm: "flex" },
            justifyContent: "flex-end",
          }}
        >
          {" "}
          {/* Aligns items to the right */}
          <Button
            color="inherit"
            component={Link}
            to="/combo-generator"
            sx={{
              "&:hover": {
                color: "rgba(212, 47, 47, 1)",
              },
            }}
          >
            Create Combos
          </Button>
          <Button
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
          </Button>
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
    </AppBar>
  );
}

export default Navbar;
