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
import {
  Container,
  FormControlLabel,
  Popover,
  styled,
  Switch,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
//----------------------------------------------------------

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));
//----------------------------------------------------------

function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));
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
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: "center",
        // background: "#331a16",
        // minHeight: "100%",
      }}
    >
      <List
        sx={{
          display: "flex",
          gap: "20px",
          flexDirection: "column",
          padding: "2rem 0",
        }}
      >
        <ListItem disablePadding>
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                minHeight: "100px",
                minWidth: "100px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "flex-start",
                flexDirection: "column",
                padding: "0 1rem",
                gap: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span>Icons:</span>
                <FormControlLabel
                  control={<IOSSwitch sx={{ m: 1 }} />}
                  checked={displayMode === "icons"}
                  onClick={handleDisplayModeChange}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span>Colors:</span>
                <FormControlLabel
                  control={<IOSSwitch sx={{ m: 1 }} />}
                  checked={selected}
                  onClick={handleColorModeChange}
                />
              </Box>
            </Box>
          </Box>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/combo-generator">
            <span style={{ fontFamily: "Michroma" }}>Combo Generator</span>
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
            sx={{ mr: 2, display: { md: "none" }, color: "#c82427" }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: ".78rem" }}>
            <Typography
              variant="h6"
              component="div"
              onClick={() => navigate("/")}
              sx={
                isMdScreen
                  ? {
                      color: "#c82427",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                      fontFamily: "Michroma",
                      "&:hover": {
                        color: "white",
                      },
                    }
                  : {
                      color: "#c82427",
                      cursor: "pointer",
                      fontSize: "1.25rem",
                      marginRight: "1rem",
                      fontFamily: "Michroma",
                      "&:hover": {
                        color: "white",
                      },
                    }
              } // Ensures it takes up space and aligns links to the right
            >
              Tekken Tactician
            </Typography>
            {isMdScreen && (
              <Typography
                variant="body1"
                component="div"
                onClick={() => navigate("/combo-generator")}
                sx={{
                  color: "#a32a2d",
                  cursor: "pointer",
                  fontSize: ".7em",
                  fontFamily: "Michroma",
                  "&:hover": {
                    color: "white",
                  },
                }}
              >
                Combo Maker
              </Typography>
            )}
            <Typography
              variant="body1"
              component="div"
              sx={{
                color: "#a32a2d",
                cursor: "pointer",
                fontSize: ".7rem",
                fontFamily: "Michroma",
                "&:hover": {
                  color: "white",
                },
              }}
              onClick={() => navigate("/anti-guide")}
            >
              Anti Guide
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
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
            {window.location.pathname.includes("/character/combos/") ||
            window.location.pathname.includes("/combo-generator") ? (
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
                      alignItems: "flex-start",
                      flexDirection: "column",
                      padding: "0 1rem",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <span>Icons:</span>
                      <FormControlLabel
                        control={<IOSSwitch sx={{ m: 1 }} />}
                        checked={displayMode === "icons"}
                        onClick={handleDisplayModeChange}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <span>Colors:</span>
                      <FormControlLabel
                        control={<IOSSwitch sx={{ m: 1 }} />}
                        checked={selected}
                        onClick={handleColorModeChange}
                      />
                    </Box>
                  </Box>
                </Popover>
              </Box>
            ) : null}

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
