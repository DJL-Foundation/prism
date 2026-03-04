import { type NextRequest } from "next/server";

export function createRouteMatcher(patterns: string[]) {
  const regexes = patterns.map((pattern) => new RegExp(pattern));

  return (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    return regexes.some((regex) => regex.test(pathname));
  };
}

export function isStaticRoute(pathname: string): boolean {
  const cleanPath = pathname.startsWith("/") ? pathname.substring(1) : pathname;
  const firstSegment = cleanPath.split("/")[0];
  if (!firstSegment) return false;
  // Note: STATIC_ROUTES will be imported from routes.generated.ts
  // This is handled in the generated file to avoid circular imports
  return false;
}

/**
 * Common route patterns - these are manually maintained patterns
 * that complement the auto-generated category-based matchers
 */

export const isAuth = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/pricing(.*)",
  "/waitlist(.*)",
  "/profile(.*)",
]);

export const isManagement = createRouteMatcher([
  "/manage(.*)",
  "/edit/(.*)",
  "/create(.*)",
]);

export const isLegal = createRouteMatcher(["/terms(.*)", "/privacy(.*)"]);

export const isOrgManagement = createRouteMatcher([
  "/org/create(.*)",
  "/org/settings(.*)",
  "/profile/select(.*)",
]);

export const isOrgRedirect = createRouteMatcher(["/org"]);
export const isSettingsRoute = createRouteMatcher(["/settings"]);
export const isManageRoute = createRouteMatcher(["/manage"]);
export const isRootRoute = createRouteMatcher(["^/$"]);
