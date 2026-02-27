import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

registerSW({
  onRegistered() {
    // Service worker registered; offline caching is now available after first load.
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
