import posthog from "posthog-js";
import { PostHogProvider as BasePostHogProvider } from "@posthog/react";
import type { ReactNode } from "react";

if (typeof window !== "undefined" && import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || "/ingest",
    person_profiles: "identified_only",
    ui_host:
      import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com",
    capture_pageview: true,
    capture_exceptions: true,
    debug: false,
    defaults: "2026-01-30",
  });
}

interface PostHogProviderProps {
  children: ReactNode;
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
  return <BasePostHogProvider client={posthog}>{children}</BasePostHogProvider>;
}
