// Template for additional forbidden usernames/shortnames
// These will be combined with automatically detected routes

export const forbiddenNamesTemplate = [
  // Generic forbidden names
  "admin",
  "root",
  "system",
  "null",
  "undefined",
  "test",
  "demo",
  "example",

  // Common services
  "www",
  "mail",
  "email",
  "ftp",
  "blog",
  "shop",
  "store",
  "help",
  "support",
  "docs",
  "cdn",
  "static",
  "assets",

  // Social/Auth related
  "login",
  "logout",
  "register",
  "signup",
  "signin",
  "auth",
  "oauth",
  "sso",

  // App specific
  "presentation",
  "presentations",
  "slide",
  "slides",
  "deck",
  "decks",

  // Common usernames to avoid
  "user",
  "guest",
  "anonymous",
  "public",
  "private",

  // Platform reserved
  "api",
  "app",
  "mobile",
  "web",
  "site",
  "home",
  "index",

  // Security
  "secure",
  "ssl",
  "cert",
  "key",
  "secret",
] as const;
