import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "@shopify/app-bridge-react";
import createApp from "@shopify/app-bridge";
import App from "./App";
import "./index.css";

// Get shop origin from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const shopOrigin = urlParams.get("shop");

const appConfig = {
  apiKey: "5e21e18ebc5840b283ebf345c78acd0e", // Replace with your actual API key
  shopOrigin: shopOrigin,
  forceRedirect: true, // Ensures the app loads inside Shopify admin
};

const shopifyApp = createApp(appConfig);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider config={shopifyApp}>
      <App />
    </Provider>
  </StrictMode>
);
