import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#637AB9",
      light: "#4FB7B3",
    },
    background: {
      default: "#0f1224",
      paper: "#1b1f3b",
    },
    text: {
      primary: "#e5e7eb",
      secondary: "#9ca3af",
    },
  },
});
