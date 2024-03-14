import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import theme from "./theme.tsx";
import { Provider } from "react-redux";
import { store } from "./state/store.ts";

// TODO: Look into why React.Strictmode breaks app

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>
);
