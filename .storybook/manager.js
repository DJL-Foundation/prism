import { addons } from "storybook/manager-api";
import theme from "./presentation-foundation";

// Inject Geist font variables into the manager (main Storybook UI)
if (typeof document !== "undefined") {
  // Create style element to inject CSS variables
  const style = document.createElement("style");
  style.textContent = `
    :root {
      --font-geist-sans: "Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      --font-geist-mono: "Geist Mono", "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    
    @font-face {
      font-family: "Geist Sans";
      src: url("https://cdn.jsdelivr.net/npm/geist@1.4.2/dist/fonts/geist-sans/Geist-Regular.woff2") format("woff2");
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    
    @font-face {
      font-family: "Geist Sans";
      src: url("https://cdn.jsdelivr.net/npm/geist@1.4.2/dist/fonts/geist-sans/Geist-Medium.woff2") format("woff2");
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }
    
    @font-face {
      font-family: "Geist Sans";
      src: url("https://cdn.jsdelivr.net/npm/geist@1.4.2/dist/fonts/geist-sans/Geist-SemiBold.woff2") format("woff2");
      font-weight: 600;
      font-style: normal;
      font-display: swap;
    }
    
    @font-face {
      font-family: "Geist Mono";
      src: url("https://cdn.jsdelivr.net/npm/geist@1.4.2/dist/fonts/geist-mono/GeistMono-Regular.woff2") format("woff2");
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
  `;
  document.head.appendChild(style);

  // Apply font classes to body
  document.body.classList.add("font-sans");
  document.body.style.fontFamily = "var(--font-geist-sans)";
}

addons.setConfig({
  theme,
});
