/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { type NextConfig } from "next";
import "./src/env.js";

const config: NextConfig = {
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "848t5ajmid.ufs.sh",
  //       pathname: "/f/*",
  //     },
  //     {
  //       protocol: "https",
  //       hostname: "arvdoawqez6yhriu.public.blob.vercel-storage.com",
  //     },
  //   ],
  // },
  experimental: {
    useCache: true,
    authInterrupts: true,
  },
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/:path*",
        destination: "/api/2well2know/:path*",
      },
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://eu.i.posthog.com/decide",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

import withVercelToolbar from "@vercel/toolbar/plugins/next";

const toolBarConfig = withVercelToolbar()(config);

import { withBotId } from "botid/next/config";

const botIdConfig = withBotId(toolBarConfig);

export default botIdConfig;
