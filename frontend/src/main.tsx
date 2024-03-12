import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import theme from "./theme.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
