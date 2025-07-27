import { createEnv } from "@t3-oss/env-nextjs";
// import { config } from "dotenv";
import { z } from "zod";

// IMPORTANT: To Load the env use (vercel env pull .env) / our db needs the .env not .env.local
// config({ path: ".env" });

const getBetterAuthUrl = () => {
  // Handle client-side
  if (typeof window !== "undefined" && window.location.host) {
    const protocol = window.location.protocol;
    return `${protocol}//${window.location.host}`;
  }

  // Handle server-side with Vercel environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Handle server-side with explicit HOST/PORT
  if (process.env.HOST || process.env.PORT) {
    const host = process.env.HOST || "localhost";
    const port = process.env.PORT || "3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    return `${protocol}://${host}${port !== "80" && port !== "443" ? `:${port}` : ""}`;
  }

  // Development fallback
  return "http://localhost:3000";
};
const hostUrl = getBetterAuthUrl();

process.env.BETTER_AUTH_URL = hostUrl;
process.env.HOST_URL = hostUrl;

// test
process.env.NEXT_PUBLIC_HOST_URL = hostUrl;

export const env = createEnv({
  server: {
    HOST_URL: z.string().url().default(hostUrl),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    LOG_LEVEL: z.enum(["off", "prod", "debug"]).default("prod").optional(),

    // File Storage
    UPLOADTHING_TOKEN: z.string(),
    // No Vercel Blob anymore

    // Cron Jobs
    CRON_SECRET: z.string(),

    // Database (NeonDB)
    DB_MAIN_STRING: z.url(),
    DB_MAIN_DIRECT_STRING: z.url(),
    DB_READ1_STRING: z.url(),
    DB_READ2_STRING: z.url(),

    // Database Cache Layer (using Upstash Redis)
    DB_KV_KV_URL: z.url(),
    DB_KV_KV_REST_API_READ_ONLY_TOKEN: z.string(),
    DB_KV_REDIS_URL: z.url(),
    DB_KV_KV_REST_API_TOKEN: z.string(),
    DB_KV_KV_REST_API_URL: z.url(),

    // Auth
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),
    GITHUB_AUTH_CLIENT_SECRET: z.string(),
    GITHUB_AUTH_CLIENT_ID: z.string(),
    GOOGLE_AUTH_CLIENT_ID: z.string(),
    GOOGLE_AUTH_CLIENT_SECRET: z.string(),
  },
  client: {
    // Analytics
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.url(),
    NEXT_PUBLIC_POSTHOG_PROJECT_ID: z.string(),

    // Auth
    NEXT_PUBLIC_HOST_URL: z.url(),
    NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID: z.string(), // ith this is for the one tap login
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_HOST_URL: process.env.NEXT_PUBLIC_HOST_URL,
    HOST_URL: process.env.HOST_URL,
    LOG_LEVEL: process.env.LOG_LEVEL,

    // File Storage
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,

    // Cron Jobs
    CRON_SECRET: process.env.CRON_SECRET,

    // Database (NeonDB)
    DB_MAIN_STRING: process.env.DB_MAIN_STRING,
    DB_MAIN_DIRECT_STRING: process.env.DB_MAIN_DIRECT_STRING,
    DB_READ1_STRING: process.env.DB_READ1_STRING,
    DB_READ2_STRING: process.env.DB_READ2_STRING,

    // Database Cache Layer (using Upstash Redis)
    DB_KV_KV_URL: process.env.DB_KV_KV_URL,
    DB_KV_KV_REST_API_READ_ONLY_TOKEN:
      process.env.DB_KV_KV_REST_API_READ_ONLY_TOKEN,
    DB_KV_REDIS_URL: process.env.DB_KV_REDIS_URL,
    DB_KV_KV_REST_API_TOKEN: process.env.DB_KV_KV_REST_API_TOKEN,
    DB_KV_KV_REST_API_URL: process.env.DB_KV_KV_REST_API_URL,

    // Analytics
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_POSTHOG_PROJECT_ID: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID,

    // Auth
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GITHUB_AUTH_CLIENT_ID: process.env.GITHUB_AUTH_CLIENT_ID,
    GITHUB_AUTH_CLIENT_SECRET: process.env.GITHUB_AUTH_CLIENT_SECRET,
    GOOGLE_AUTH_CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID,
    GOOGLE_AUTH_CLIENT_SECRET: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});

export default env;
