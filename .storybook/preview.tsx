import type { Preview } from "@storybook/nextjs-vite";
import "../src/styles/globals.css";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { Toaster } from "~/components/ui/sonner";

type Theme = "light" | "dark";

type ThemeContextType = {
  setTheme: (theme: Theme) => void;
  getTheme: () => Theme;
  theme: Theme;
  updateTheme: (theme: Theme) => void;
};

const updateTheme = (theme: Theme) => {
  if (typeof document !== "undefined") {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    if (theme === "dark") {
      htmlElement.classList.add("dark");
      bodyElement.classList.add("dark");
      bodyElement.style.backgroundColor = "hsl(230, 60%, 4%)";
      bodyElement.style.color = "hsl(231, 88%, 91%)";
    } else {
      htmlElement.classList.remove("dark");
      bodyElement.classList.remove("dark");
      bodyElement.style.backgroundColor = "hsl(230, 60%, 96%)";
      bodyElement.style.color = "hsl(231, 87%, 9%)";
    }
  }
};

const ThemeContext = createContext<ThemeContextType>({
  setTheme: () => void 0,
  getTheme: () => "light",
  theme: "light",
  updateTheme,
});

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

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
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
      const globalTheme: Theme = (context.globals.theme as Theme) ?? "light";
      const [currentTheme, setCurrentTheme] = useState<Theme>(globalTheme);

      const setTheme = (theme: Theme) => {
        setCurrentTheme(theme);
        context.globals.theme = theme;
        updateTheme(theme);
      };

      const getTheme = () => currentTheme;

      // Update theme when global theme changes
      useEffect(() => {
        if (globalTheme !== currentTheme) {
          setCurrentTheme(globalTheme);
          updateTheme(globalTheme);
        }
      }, [globalTheme, currentTheme]);

      // Apply theme on initial render
      useEffect(() => {
        updateTheme(currentTheme);
      }, [currentTheme]);

      return (
        <ThemeContext.Provider
          value={{ setTheme, getTheme, theme: currentTheme, updateTheme }}
        >
          <Story />
        </ThemeContext.Provider>
      );
    },
    (Story) => (
      <>
        <Toaster />
        <Story />
      </>
    ),
  ],
};

export const useTheme = () => useContext(ThemeContext);

// Helper decorator for print mode simulation in individual stories
export const withPrintMode = (print = false) => {
  const Internal = (Story: () => ReactNode, _context: unknown) => {
    const { getTheme, setTheme } = useTheme();

    useEffect(() => {
      if (print) {
        const oldTheme = getTheme();
        setTheme("light");

        // Cleanup function to restore theme when component unmounts or print changes
        return () => {
          setTheme(oldTheme);
        };
      }
    }, [getTheme, setTheme]);

    return <Story />;
  };

  Internal.displayName = "WithPrintModeDecorator";
  return Internal;
};

export default preview;
