// #region Imports
import { type NextMiddleware, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import {
  isAuth,
  isManagement,
  isLegal,
  isOrgManagement,
  isOrgRedirect,
  isSettingsRoute,
  isManageRoute,
  isRootRoute,
} from "~/lib/route-matchers";
import {
  isFreePresentation,
  isUserProfile,
  isProPresentation,
  isBypass,
  forbiddenNames,
} from "~/lib/routes.generated";
import {
  generateVerificationUuid,
  generateVerificationHashes,
} from "~/lib/internal-verification";
import { defaultLogLevel, Logger } from "./lib/logging";
import chalk from "chalk";
// #endregion Imports

// #region Middleware Logger
const middlewareLogger = new Logger("Middleware", defaultLogLevel, {
  customMethods: {
    "auth-check": {
      color: chalk.magenta,
      type: "AUTH_STATE",
    },
    "route-match": {
      color: chalk.yellow,
      type: "ROUTING",
    },
    rewrite: {
      color: chalk.green,
      type: "REWRITE",
    },
  },
});
// #endregion Middleware Logger

// #region Idea
// Future Routing Structure
// Based on example routes
// example-org
// example-user

// oh villeicht kauf ich mir pr-fnd.de oder so weil ist kürzer als pr.djl.foundation

// zwischendurch idee dass die view seiten auf /view/[shortname] sind aber jetzt mit meinem script kann ich erstmal alle paths checken und dann einfach davon ausgehen das das ein userprofile ist

// pr.djl.foundation = root (intelligent routing for hero / home)
// pr.djl.foundation/{example-user}/{shortname} = presentation view for presentation "shortname" - Free Tier
// pr.djl.foundation/!{shortname} = presentation view for presentation "shortname" - Pro Tier
// pr.djl.foundation/{example-user} = user profile w/public presentations - intelligent routing (e.g. if auth().user == example-user redirect to /)
// example-org.pr.djl.foundation = organisation profile (if wanted) (intelligent routing for profile / org home) // Alias Org-Root
// example-org.pr.djl.foundation/{shortname} = organisation presentation view for presentation "shortname"+

// Integration für Custom Domains (Pro Org)
// e.g. subdomain.yourdomain.com (example: keynotes.hackclub-stade.de) // Need ideas on how to implement, maybe just a cname to pr.djl.foundation works? or does double cnames not work? e.g. customdomain.com -> pr.djl.foundation -> cname.vercel.com. or smth

// MOVING OF OF CLERK

// Needed Route List
/**
 * - (auth) // Same as Always // Below new stuff
 * - - /org/create // Root
 * - - /org redirects to /settings
 * - - /settings // User / Org Settings Page
 * - - /profile/select // Root / Org Clerk Selector
 * - (legal) // Same as Always
 * - (management) // Only Root / Org Root
 * - - /manage // Root / Org Root / is the main management and settings page for organisations on normal users redirects to /list 
 * - - /list // Root / Org Root / e.g. old /manage
 * - - /edit/{shortname} // Root / Org Root
 * - - /create // Root / Org Root
 * - - (hidden routing)
 * - - - /_internal/hero // Only Rootdomain!
 * - - - /_internal/home // Rootdomain / Org Rootdomain
 * - - - /_internal/view/[shortname] // Also gets rewritten from /[username]/[shortname] on free tier as well as subdomains and orgs subdomains /[shortname]
 * - - - /_internal/layout.ts // File that checks for a cookie or header from middleware to only pass through to the only rewritten targeted routes if the middleware actualy wanted that to happen

* - / // the root page.tsx // but thanks to middleware inaccessible
 */

// Thinking about implementing different tables for free tier and pro tier and orgs e.g. saved under (free = username/shortname, pro = shortname, org = orgSlug/shortname) but thats just an example on how to store the shortnames and usernames in the database, not how to route them

// Internal Route set
// All internal routes are wraped by a layout.tsx file that checks for a cookie or header from the middleware to only pass through to the only rewritten targeted routes if the middleware actualy wanted that to happen
/**
 *  - /_internal/hero/B2C // Hero Page for Root Domain
 *  - /_internal/hero/B2B // Possible advertising page for orgs in the future // disregarded for now
 *  - /_internal/home/user // Will Partial Prerender this page and just input the username and then fetch with trpc // homepage for users on the root domain,
 *  - /_internal/home/org/[orgSlug] // Will Partial Prerender this page and just input the orgSlug and then fetch with trpc // homepage for orgs on the root domain,
 *  - /_internal/profile/org/[orgSlug] // Org Public facing page, only presentaitons that are public e.g. example-org.pr.djl.foundation
 *  - /_internal/profile/user/[username] // User Profile Page, e.g. pr.djl.foundation/username
 *  - /_internal/view/free/[username]/[shortname] // Free Tier Presentation View, e.g. pr.djl.foundation/username/shortname
 *  - /_internal/view/pro/[shortname] // Pro Tier Presentation View, e.g. pr.djl.foundation/!shortname
 *  - /_internal/view/org/[orgSlug]/[shortname] // Org Presentation View, e.g. example-org.pr.djl.foundation/shortname
 */

// Route List: (current / old way)
/**
 * - (auth) // Mostly only root routes
 * - - /sign-in // Everywhere
 * - - /sign-up // Root
 * - - /pricing // Root
 * - - /waitlist // Root
 * - - /profile // Root
 * - (legal) // Root
 * - - /terms // Root
 * - - /privacy // Root
 * - (management) // Only Root / Org Root
 * - - /manage
 * - - /edit/{shortname}
 * - - /create
 * - / // Presentation View, Hero, Home and more...
 */
// #endregion Idea

// #region Helper Functions
function isOrg(hostname: string) {
  const baseDomain = ".pr.djl.foundation";
  return hostname.endsWith(baseDomain) && hostname !== `pr${baseDomain}`;
}

function isDev(hostname: string) {
  return hostname === "localhost" || hostname.endsWith(".vercel.app");
}

/**
 * Set verification cookie and header for internal routes
 */
function setInternalVerification(response: NextResponse): void {
  const verificationUuid = generateVerificationUuid();
  const { cookieHash, headerHash } =
    generateVerificationHashes(verificationUuid);

  // Set verification cookie (httpOnly for security)
  response.cookies.set("internal-verify", cookieHash, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
  });

  // Set verification header
  response.headers.set("x-internal-no-evict", headerHash);
}
// #endregion Helper Functions

// #region Custom Router
function customRouter(): NextMiddleware {
  return async (request) => {
    const {
      pathname,
      hostname: originalHostname,
      searchParams,
    } = request.nextUrl;
    let effectiveHostname = originalHostname;

    middlewareLogger.start("Processing request");
    middlewareLogger.info(
      `Incoming request: Original Hostname=${originalHostname}, Pathname=${pathname}, SearchParams=${searchParams.toString()}`,
    );

    // #region Bypass Logic
    // Fast bypass for static assets and specified routes
    if (isBypass(request)) {
      middlewareLogger.debug(
        `Bypass route matched for: ${pathname}, passing through instantly`,
      );
      middlewareLogger.end("Request bypassed");
      return NextResponse.next();
    }

    // #region Should Process
    // Check if this request matches any of our routing patterns that need auth
    const needsAuth =
      isManagement(request) ||
      isOrgManagement(request) ||
      isSettingsRoute(request) ||
      isManageRoute(request) ||
      isRootRoute(request) ||
      isOrg(effectiveHostname);

    // Check if this request matches any routing patterns (including those that don't need auth)
    const shouldProcess =
      needsAuth ||
      (isAuth(request) && !pathname.startsWith("/api/auth/")) ||
      isLegal(request) ||
      isFreePresentation(request) ||
      isUserProfile(request) ||
      isProPresentation(request) ||
      isOrgRedirect(request);

    // Fast exit if this request doesn't match any of our patterns
    if (!shouldProcess) {
      middlewareLogger.debug(
        `No routing pattern matched for: ${pathname}, passing through`,
      );
      middlewareLogger.end("Request passed through");
      return NextResponse.next();
    }

    // Determine the base origin for external redirects.
    const protocol = request.nextUrl.protocol;
    const port = request.nextUrl.port ? ":" + request.nextUrl.port : "";
    middlewareLogger.debug(
      `Request Protocol=${protocol}, Port=${port}, Original Hostname=${originalHostname}`,
    );

    let redirectBaseOrigin: string;

    // #region Development Logic
    if (isDev(originalHostname)) {
      middlewareLogger.info(`DX: Detected development or preview environment.`);
      redirectBaseOrigin = `${protocol}://${originalHostname}${port}`;
      middlewareLogger.debug(
        `DX: Redirect Base Origin set to ${redirectBaseOrigin}`,
      );

      const subdomainParam = searchParams.get("subdomain");
      middlewareLogger.debug(
        `DX: Subdomain parameter from search params: ${subdomainParam}`,
      );

      if (subdomainParam) {
        middlewareLogger.info(`DX: Simulating subdomain: ${subdomainParam}`);
        effectiveHostname = `${subdomainParam}.pr.djl.foundation`;
      } else {
        middlewareLogger.info(
          `DX: No subdomain param, defaulting effective hostname to main domain.`,
        );
        effectiveHostname = `pr.djl.foundation`;
      }

      middlewareLogger.debug(
        `DX: Effective Hostname for logic = ${effectiveHostname}`,
      );
      middlewareLogger.info(`DX: Exiting DX logic`);
    } else {
      redirectBaseOrigin = request.nextUrl.origin;
      middlewareLogger.debug(
        `Production: Redirect Base Origin set to ${redirectBaseOrigin} (request origin)`,
      );
    }

    // #region AuthData
    // Simple cookie-based auth check using Better Auth's recommended approach
    const sessionCookie = getSessionCookie(request);
    const isSignedIn = !!sessionCookie;

    middlewareLogger.custom(
      "auth-check",
      "CHECKING",
      `Session cookie exists: ${isSignedIn}`,
    );

    // #region Redirects
    // Handle basic redirects first
    if (isOrgRedirect(request)) {
      middlewareLogger.info("Handling /org redirect");
      const targetUrl = new URL("/settings", redirectBaseOrigin);
      targetUrl.search = request.nextUrl.search;
      middlewareLogger.success(
        `Redirecting /org to /settings: ${targetUrl.toString()}`,
      );
      middlewareLogger.end("Request handled - redirect");
      return NextResponse.redirect(targetUrl);
    }

    // #region Management Routes
    // Handle management routes - require auth
    if (isManagement(request)) {
      middlewareLogger.info("Handling Management route: protecting.");
      if (!isSignedIn) {
        middlewareLogger.warn("No session found, redirecting to /sign-in");
        const targetUrl = new URL("/sign-in", redirectBaseOrigin);
        targetUrl.search = request.nextUrl.search;
        middlewareLogger.end("Request handled - auth redirect");
        return NextResponse.redirect(targetUrl);
      }
    }

    // #region Organisations
    // Handle org subdomain logic
    if (isOrg(effectiveHostname)) {
      middlewareLogger.info("Handling custom domains/orgs (rewrites)");
      if (pathname === "/") {
        middlewareLogger.info("Org root path");
        const orgSlugFromEffectiveHostname = effectiveHostname.split(".")[0];

        // #region Org SignedIn
        if (isSignedIn) {
          // NOTE: THIS ISNT COMPLETELY IMPLEMENTED YET
          // Redirect to check route to verify org membership
          const targetUrl = new URL(
            `/api/internal/org-check/${orgSlugFromEffectiveHostname}`,
            redirectBaseOrigin,
          );
          targetUrl.search = request.nextUrl.search;
          middlewareLogger.success(
            `Redirecting to org membership check: ${targetUrl.toString()}`,
          );
          middlewareLogger.end("Request handled - org check redirect");
          return NextResponse.redirect(targetUrl);
        } else {
          // #region Org Profile
          // Not signed in users see profile page
          const response = NextResponse.rewrite(
            new URL(
              `/internal/profile/org/${orgSlugFromEffectiveHostname}`,
              request.url,
            ),
          );
          middlewareLogger.custom(
            "rewrite",
            "REWRITE",
            `Rewriting to /internal/profile/org: ${response.url}`,
          );
          setInternalVerification(response);
          middlewareLogger.end("Request handled - rewrite");
          return response;
        }
      } else if (isUserProfile(request)) {
        // #region Org Presentation
        middlewareLogger.info("Org presentation path");
        const shortname = pathname.substring(1);
        middlewareLogger.debug(`Extracted shortname: ${shortname}`);
        if (forbiddenNames.includes(shortname)) {
          middlewareLogger.warn(
            "Shortname is forbidden, rewriting to /forbidden",
          );
          middlewareLogger.end("Request handled - forbidden");
          return NextResponse.rewrite(new URL("/forbidden", request.url));
        }
        const orgSlugFromEffectiveHostname = effectiveHostname.split(".")[0];
        const response = NextResponse.rewrite(
          new URL(
            `/internal/view/org/${orgSlugFromEffectiveHostname}/${shortname}`,
            request.url,
          ),
        );
        middlewareLogger.custom(
          "rewrite",
          "REWRITE",
          `Rewriting to /internal/view/org: ${response.url}`,
        );
        setInternalVerification(response);
        middlewareLogger.end("Request handled - rewrite");
        return response;
      }
    }

    // #region User Profiles
    // Handle user profile routes
    if (isUserProfile(request)) {
      middlewareLogger.custom(
        "route-match",
        "ROUTING",
        "Handling User Profile route",
      );
      const username = pathname.substring(1);
      middlewareLogger.debug(`Extracted username: ${username}`);
      if (forbiddenNames.includes(username)) {
        middlewareLogger.warn("Username is forbidden, rewriting to /forbidden");
        middlewareLogger.end("Request handled - forbidden");
        return NextResponse.rewrite(new URL("/forbidden", request.url));
      }

      const response = NextResponse.rewrite(
        new URL(`/internal/profile/user/${username}`, request.url),
      );
      middlewareLogger.custom(
        "rewrite",
        "REWRITE",
        `Rewriting to /internal/profile/user: ${response.url}`,
      );
      setInternalVerification(response);
      middlewareLogger.end("Request handled - rewrite");
      return response;
    }

    // #region Free Tier Presentations
    // Handle free tier routes
    if (isFreePresentation(request)) {
      middlewareLogger.custom(
        "route-match",
        "ROUTING",
        "Handling Free Presentation route",
      );
      const parts = pathname.split("/");
      const username = parts[1];
      const shortname = parts[2];
      middlewareLogger.debug(
        `Extracted username: ${username}, shortname: ${shortname}`,
      );

      if (
        (username && forbiddenNames.includes(username)) ||
        (shortname && forbiddenNames.includes(shortname))
      ) {
        middlewareLogger.warn(
          "Username or shortname is forbidden, rewriting to /forbidden",
        );
        middlewareLogger.end("Request handled - forbidden");
        return NextResponse.rewrite(new URL("/forbidden", request.url));
      }
      const response = NextResponse.rewrite(
        new URL(`/internal/view/free/${username}/${shortname}`, request.url),
      );
      middlewareLogger.custom(
        "rewrite",
        "REWRITE",
        `Rewriting to /internal/view/free: ${response.url}`,
      );
      setInternalVerification(response);
      middlewareLogger.end("Request handled - rewrite");
      return response;
    }

    // #region Pro Tier Presentations
    // Handle pro tier routes
    if (isProPresentation(request)) {
      middlewareLogger.custom(
        "route-match",
        "ROUTING",
        "Handling Pro Presentation route",
      );
      const shortname = pathname.substring(2); // Remove leading /!
      middlewareLogger.debug(`Extracted shortname: ${shortname}`);
      if (forbiddenNames.includes(shortname)) {
        middlewareLogger.warn(
          "Shortname is forbidden, rewriting to /forbidden",
        );
        middlewareLogger.end("Request handled - forbidden");
        return NextResponse.rewrite(new URL("/forbidden", request.url));
      }
      const response = NextResponse.rewrite(
        new URL(`/internal/view/pro/${shortname}`, request.url),
      );
      middlewareLogger.custom(
        "rewrite",
        "REWRITE",
        `Rewriting to /internal/view/pro: ${response.url}`,
      );
      setInternalVerification(response);
      middlewareLogger.end("Request handled - rewrite");
      return response;
    }

    // #region ROOT ROUTE
    // Handle root route
    if (isRootRoute(request)) {
      middlewareLogger.custom(
        "route-match",
        "ROUTING",
        "Handling Root Route (main domain)",
      );
      // #region Root Domain Hero
      if (!isSignedIn) {
        const response = NextResponse.rewrite(
          new URL("/internal/hero/B2C", request.url),
        );
        middlewareLogger.custom(
          "rewrite",
          "REWRITE",
          `Rewriting to /internal/hero/B2C: ${response.url}`,
        );
        setInternalVerification(response);
        middlewareLogger.end("Request handled - rewrite");
        return response;
      }
      // #region Signed In User Home
      const response = NextResponse.rewrite(
        new URL(`/internal/home/user`, request.url),
      );
      middlewareLogger.custom(
        "rewrite",
        "REWRITE",
        `Rewriting to /internal/home/user: ${response.url}`,
      );
      setInternalVerification(response);
      middlewareLogger.end("Request handled - rewrite");
      return response;
    }

    middlewareLogger.end("Request completed - next");
    return NextResponse.next();
  };
}

export default customRouter();

export const config = {
  matcher: [
    // Skip Next.js internals (e.g., _next) and all static files.
    // The `[^?]*\\\\.(?:html?|css|js(?!on)|zip|webmanifest)` part ensures it runs
    // on paths that are not static files, unless they have a query parameter (like `?subdomain=`).
    "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|zip|webmanifest)).*)",
    // Always run for API and tRPC routes.
    "/(api|trpc)(.*)",
  ],
};
