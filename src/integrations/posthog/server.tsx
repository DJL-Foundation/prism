import { PostHog } from "posthog-node";
import { env } from "#env";

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogClient) {
    posthogClient = new PostHog(env.VITE_PUBLIC_POSTHOG_KEY, {
      host: env.VITE_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogClient;
}
