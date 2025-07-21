"use client";

import posthog from "posthog-js";
import env from "#env";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type authClient from "./auth-client";

type userData = typeof authClient.$Infer.Session;

export function PostHogProvider({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData: userData | null;
}) {
  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false, // We capture pageviews manually
      capture_pageleave: true, // Enable pageleave capture
      capture_exceptions: true, // This enables capturing exceptions using Error Tracking, set to false if you don't want this
      debug: process.env.NODE_ENV === "development",
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView userData={userData} />
      {children}
    </PHProvider>
  );
}

function PostHogPageView({ userData }: { userData: userData | null }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      const search = searchParams.toString();
      if (search) {
        url += "?" + search;
      }
      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  useEffect(() => {
    // 👉 Check the sign-in status and user info,
    //    and identify the user if they aren't already
    if (userData && !posthog._isIdentified()) {
      // 👉 Identify the user
      posthog.identify(userData.user.id, {
        email: userData.user.email,
        name: userData.user.name,
        username: userData.user.username,
      });
    }

    if (!userData && posthog._isIdentified()) {
      posthog.reset();
    }
  }, [posthog, userData]);

  return null;
}

function SuspendedPostHogPageView({ userData }: { userData: userData | null }) {
  return (
    <Suspense fallback={null}>
      <PostHogPageView userData={userData} />
    </Suspense>
  );
}
