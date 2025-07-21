import type { StorybookConfig } from "@storybook/nextjs-vite";
import tailwindcss from "@tailwindcss/postcss";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    // Ensure PostCSS processes Tailwind properly
    config.css = {
      ...config.css,
      postcss: {
        plugins: [tailwindcss],
      },
    };

    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve?.alias,
        "#auth/client": "../src/server/auth-client.mock.ts",
        "../src/server/auth-client.ts": "../src/server/auth-client.mock.ts",
      };
    }
    return config;
  },
};
export default config;
