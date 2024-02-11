import createPalette from "@mui/material/styles/createPalette";
import createTheme from "@mui/material/styles/createTheme";

const palette = createPalette({
  primary: {
    main: "#012E47",
    light: "#26C8B9",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#FF7638",
  },
});

const theme = createTheme({ palette: palette });

export default theme;
