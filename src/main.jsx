import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";
import { store } from "./app/store";
import AppRoutes from "./routes/AppRoutes.jsx";
import BootstrapForBrowser from "./components/ui/bootstrapForBrowser.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BootstrapForBrowser />
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
