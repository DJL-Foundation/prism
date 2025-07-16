import { create } from "storybook/theming";

export default create({
  base: "dark",

  // Typography - now using the injected Geist fonts
  fontBase: "var(--font-geist-sans)",
  fontCode: "var(--font-geist-mono)",

  brandTitle: "The Presentation Foundation",
  brandUrl: "https://pr.djl.foundation",
  brandTarget: "_self",

  // Colors
  colorPrimary: "hsl(230, 66%, 46%)", // --primary (dark)
  colorSecondary: "hsl(230, 73%, 28%)", // --secondary (dark)

  // UI - made darker to distinguish from preview
  appBg: "hsl(230, 60%, 2%)", // darker than preview
  appContentBg: "hsl(230, 60%, 2%)", // darker than preview
  appPreviewBg: "hsl(230, 60%, 4%)", // preview stays same
  appBorderColor: "hsl(230, 60%, 15%)", // slightly lighter border
  appBorderRadius: 8, // --radius (0.5rem)

  // Text colors
  textColor: "hsl(231, 88%, 85%)", // slightly dimmed text
  textInverseColor: "hsl(230, 60%, 4%)", // --background (dark)

  // Toolbar colors
  barTextColor: "hsl(231, 88%, 75%)", // dimmed toolbar text
  barSelectedColor: "hsl(230, 66%, 50%)", // slightly brighter primary
  barHoverColor: "hsl(230, 73%, 35%)", // slightly brighter secondary
  barBg: "hsl(230, 60%, 3%)", // slightly lighter than main bg

  // Form colors
  inputBg: "hsl(230, 60%, 6%)", // slightly lighter input bg
  inputBorder: "hsl(229, 61%, 25%)", // darker input border
  inputTextColor: "hsl(231, 88%, 85%)", // dimmed input text
  inputBorderRadius: 8, // --radius
});
