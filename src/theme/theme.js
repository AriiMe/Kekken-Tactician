import { createTheme } from "@mui/material/styles";

const tekkenTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c62828",
    },
    secondary: {
      main: "#ffca28",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#fff",
      secondary: "#eceff1",
    },
  },
});

export default tekkenTheme;
