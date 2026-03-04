"use client";

import type React from "react";
import { ConvexReactClient, ConvexProviderWithAuth } from "convex/react";
import { useBetterAuthConvexAuth } from "~/lib/use-better-auth-convex";
import env from "~/env";

// Auto-detect Convex URL from environment or use provided URL
const getConvexUrl = () => {
  // If explicitly set, use it
  if (env.NEXT_PUBLIC_CONVEX_URL) {
    return env.NEXT_PUBLIC_CONVEX_URL;
  }

  // Otherwise try to get from Convex environment variable
  // This is set automatically by `npx convex dev`
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CONVEX_URL) {
    return process.env.NEXT_PUBLIC_CONVEX_URL;
  }

  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL not found. Please run 'npx convex dev' or set it manually in .env.local",
  );
};

const convex = new ConvexReactClient(getConvexUrl());

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

/**
 * Convex Provider with Better Auth integration
 * Provides authenticated Convex access using Better Auth JWTs
 */
export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useBetterAuthConvexAuth}>
      {children}
    </ConvexProviderWithAuth>
  );
}
