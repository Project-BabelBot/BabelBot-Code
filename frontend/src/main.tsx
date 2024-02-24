import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import theme from "./theme.tsx";
import { Provider } from "react-redux";
import { store } from "./state/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
