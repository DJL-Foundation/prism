"use client";

import { useCallback, useMemo } from "react";
import authClient from "~/server/auth-client";

/**
 * Hook to integrate Better Auth with Convex
 * This provides the auth state needed by ConvexProviderWithAuth
 */
export function useBetterAuthConvexAuth() {
  const { isPending, data: session } = authClient.useSession();

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      try {
        // TODO: Use forceRefreshToken to invalidate cached token if needed
        const { data, error } = await authClient.token();

        if (error) {
          console.error("Failed to fetch access token:", error);
          return null;
        }

        return data?.token ?? null;
      } catch (error) {
        console.error("Error fetching access token:", error);
        return null;
      }
    },
    [],
  );

  return useMemo(
    () => ({
      isLoading: isPending,
      isAuthenticated: !!session,
      fetchAccessToken,
    }),
    [isPending, session, fetchAccessToken],
  );
}
