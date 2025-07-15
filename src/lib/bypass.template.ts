// Template for additional bypass routes
// These will be combined with automatically detected public assets

export const bypassRoutesTemplate = [
  // API routes that should bypass auth
  "/api/og",
  "/api/og/*",
  "/api/uploadthing",
  "/api/uploadthing/*",
  "/api/trpc",
  "/api/trpc/*",
  "/api/cron",
  "/api/cron/*",
  "/api/mcp",
  "/api/mcp/*",
  "/api/2well2know",
  "/api/2well2know/*",

  // Health checks and monitoring
  "/health",
  "/status",
  "/ping",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",

  // Next.js internal routes
  "/_next",
  "/_next/*",
  "/_vercel",
  "/_vercel/*",

  // Development tools
  "/__nextjs_original-stack-frame",

  // Sentry
  "/api/sentry-tunnel",
] as const;
