import type { Preview } from "@storybook/nextjs-vite";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    docs: {
      codePanel: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true, // Disable default backgrounds since we're using our own theme system
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light", left: "☀️" },
          { value: "dark", title: "Dark", left: "🌙" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? "light";

      // Apply theme to document body and html
      if (typeof document !== "undefined") {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        if (theme === "dark") {
          htmlElement.classList.add("dark");
          bodyElement.classList.add("dark");
        } else {
          htmlElement.classList.remove("dark");
          bodyElement.classList.remove("dark");
        }

        // Update background color based on theme
        if (theme === "dark") {
          bodyElement.style.backgroundColor = "hsl(230, 60%, 4%)";
          bodyElement.style.color = "hsl(231, 88%, 91%)";
        } else {
          bodyElement.style.backgroundColor = "hsl(230, 60%, 96%)";
          bodyElement.style.color = "hsl(231, 87%, 9%)";
        }
      }

      return Story();
    },
  ],
};

export default preview;
