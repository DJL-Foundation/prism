import { type NextMiddleware, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import {
  isAuth,
  isManagement,
  isLegal,
  isOrgManagement,
  isFreePresentation,
  isUserProfile,
  isProPresentation,
  isOrgRedirect,
  isSettingsRoute,
  isManageRoute,
  isRootRoute,
  isBypass,
  forbiddenNames,
} from "~/lib/routes.generated";
import { middlewareCustomLogger } from "~/lib/logging";
import {
  generateVerificationUuid,
  generateVerificationHashes,
} from "~/lib/internal-verification";

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

// Forbidden User and Shortnames:
/**
 * - /.well-known
 * - /favicon.ico
 * - /robots.txt
 * - /sitemap.xml
 * - /forbidden
 * - /404
 * - /500
 * - /_error
 * - /_app
 * - /_document
 * - /_middleware
 * - /_static
 * - /sign-in
 * - /sign-up
 * - /pricing
 * - /waitlist
 * - /profile
 * - /terms
 * - /privacy
 * - /manage
 * - /edit
 * - /create
 * - /org
 * - /settings
 * - /select
 * - /hero
 * - /home
 * - /view
 * - /layout
 * - /_internal
 * - /_next
 * - /api
 * - /trpc
 */

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

function customRouter(): NextMiddleware {
  return async (request) => {
    const {
      pathname,
      hostname: originalHostname,
      searchParams,
    } = request.nextUrl;
    let effectiveHostname = originalHostname;

    middlewareCustomLogger.start("Processing request");
    middlewareCustomLogger.info(
      `Incoming request: Original Hostname=${originalHostname}, Pathname=${pathname}, SearchParams=${searchParams.toString()}`,
    );

    // Fast bypass for static assets and specified routes
    if (isBypass(request)) {
      middlewareCustomLogger.debug(
        `Bypass route matched for: ${pathname}, passing through instantly`,
      );
      middlewareCustomLogger.end("Request bypassed");
      return NextResponse.next();
    }

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
      middlewareCustomLogger.debug(
        `No routing pattern matched for: ${pathname}, passing through`,
      );
      middlewareCustomLogger.end("Request passed through");
      return NextResponse.next();
    }

    // Determine the base origin for external redirects.
    const protocol = request.nextUrl.protocol;
    const port = request.nextUrl.port ? ":" + request.nextUrl.port : "";
    middlewareCustomLogger.debug(
      `Request Protocol=${protocol}, Port=${port}, Original Hostname=${originalHostname}`,
    );

    let redirectBaseOrigin: string;

    if (isDev(originalHostname)) {
      middlewareCustomLogger.info(
        `DX: Detected development or preview environment.`,
      );
      redirectBaseOrigin = `${protocol}://${originalHostname}${port}`;
      middlewareCustomLogger.debug(
        `DX: Redirect Base Origin set to ${redirectBaseOrigin}`,
      );

      const subdomainParam = searchParams.get("subdomain");
      middlewareCustomLogger.debug(
        `DX: Subdomain parameter from search params: ${subdomainParam}`,
      );

      if (subdomainParam) {
        middlewareCustomLogger.info(
          `DX: Simulating subdomain: ${subdomainParam}`,
        );
        effectiveHostname = `${subdomainParam}.pr.djl.foundation`;
      } else {
        middlewareCustomLogger.info(
          `DX: No subdomain param, defaulting effective hostname to main domain.`,
        );
        effectiveHostname = `pr.djl.foundation`;
      }

      middlewareCustomLogger.debug(
        `DX: Effective Hostname for logic = ${effectiveHostname}`,
      );
      middlewareCustomLogger.info(`DX: Exiting DX logic`);
    } else {
      redirectBaseOrigin = request.nextUrl.origin;
      middlewareCustomLogger.debug(
        `Production: Redirect Base Origin set to ${redirectBaseOrigin} (request origin)`,
      );
    }

    // Simple cookie-based auth check using Better Auth's recommended approach
    const sessionCookie = getSessionCookie(request);
    const isSignedIn = !!sessionCookie;

    middlewareCustomLogger.custom(
      "auth-check",
      "CHECKING",
      `Session cookie exists: ${isSignedIn}`,
    );

    // Handle basic redirects first
    if (isOrgRedirect(request)) {
      middlewareCustomLogger.info("Handling /org redirect");
      const targetUrl = new URL("/settings", redirectBaseOrigin);
      targetUrl.search = request.nextUrl.search;
      middlewareCustomLogger.success(
        `Redirecting /org to /settings: ${targetUrl.toString()}`,
      );
      middlewareCustomLogger.end("Request handled - redirect");
      return NextResponse.redirect(targetUrl);
    }

    // Handle management routes - require auth
    if (isManagement(request)) {
      middlewareCustomLogger.info("Handling Management route: protecting.");
      if (!isSignedIn) {
        middlewareCustomLogger.warn(
          "No session found, redirecting to /sign-in",
        );
        const targetUrl = new URL("/sign-in", redirectBaseOrigin);
        targetUrl.search = request.nextUrl.search;
        middlewareCustomLogger.end("Request handled - auth redirect");
        return NextResponse.redirect(targetUrl);
      }
    }

    // Handle org subdomain logic
    if (isOrg(effectiveHostname)) {
      middlewareCustomLogger.info("Handling custom domains/orgs (rewrites)");
      if (pathname === "/") {
        middlewareCustomLogger.info("Org root path");
        const orgSlugFromEffectiveHostname = effectiveHostname.split(".")[0];

        if (isSignedIn) {
          // Redirect to check route to verify org membership
          const targetUrl = new URL(
            `/api/internal/org-check/${orgSlugFromEffectiveHostname}`,
            redirectBaseOrigin,
          );
          targetUrl.search = request.nextUrl.search;
          middlewareCustomLogger.success(
            `Redirecting to org membership check: ${targetUrl.toString()}`,
          );
          middlewareCustomLogger.end("Request handled - org check redirect");
          return NextResponse.redirect(targetUrl);
        } else {
          // Not signed in users see profile page
          const response = NextResponse.rewrite(
            new URL(
              `/internal/profile/org/${orgSlugFromEffectiveHostname}`,
              request.url,
            ),
          );
          middlewareCustomLogger.custom(
            "rewrite",
            "REWRITE",
            `Rewriting to /internal/profile/org: ${response.url}`,
          );
          setInternalVerification(response);
          middlewareCustomLogger.end("Request handled - rewrite");
          return response;
        }
      } else if (isUserProfile(request)) {
        middlewareCustomLogger.info("Org presentation path");
        const shortname = pathname.substring(1);
        middlewareCustomLogger.debug(`Extracted shortname: ${shortname}`);
        if (forbiddenNames.includes(shortname)) {
          middlewareCustomLogger.warn(
            "Shortname is forbidden, rewriting to /forbidden",
          );
          middlewareCustomLogger.end("Request handled - forbidden");
          return NextResponse.rewrite(new URL("/forbidden", request.url));
        }
        const orgSlugFromEffectiveHostname = effectiveHostname.split(".")[0];
        const response = NextResponse.rewrite(
          new URL(
            `/internal/view/org/${orgSlugFromEffectiveHostname}/${shortname}`,
            request.url,
          ),
        );
        middlewareCustomLogger.custom(
          "rewrite",
          "REWRITE",
          `Rewriting to /internal/view/org: ${response.url}`,
        );
        setInternalVerification(response);
        middlewareCustomLogger.end("Request handled - rewrite");
        return response;
      }
    }

    // Handle user profile routes
    if (isUserProfile(request)) {
      middlewareCustomLogger.custom(
        "route-match",
        "ROUTING",
        "Handling User Profile route",
      );
      const username = pathname.substring(1);
      middlewareCustomLogger.debug(`Extracted username: ${username}`);
      if (forbiddenNames.includes(username)) {
        middlewareCustomLogger.warn(
          "Username is forbidden, rewriting to /forbidden",
        );
        middlewareCustomLogger.end("Request handled - forbidden");
        return NextResponse.rewrite(new URL("/forbidden", request.url));
      }

      const response = NextResponse.rewrite(
        new URL(`/internal/profile/user/${username}`, request.url),
      );
      middlewareCustomLogger.custom(
        "rewrite",
        "REWRITE",
        `Rewriting to /internal/profile/user: ${response.url}`,
      );
      setInternalVerification(response);
      middlewareCustomLogger.end("Request handled - rewrite");
      return response;
    }

    // Handle free tier routes
    if (isFreePresentation(request)) {
      middlewareCustomLogger.custom(
        "route-match",
        "ROUTING",
        "Handling Free Presentation route",
      );
      const parts = pathname.split("/");
      const username = parts[1];
      const shortname = parts[2];
      middlewareCustomLogger.debug(
        `Extracted username: ${username}, shortname: ${shortname}`,
      );

      if (
        (username && forbiddenNames.includes(username)) ||
        (shortname && forbiddenNames.includes(shortname))
      ) {
        middlewareCustomLogger.warn(
          "Username or shortname is forbidden, rewriting to /forbidden",
        );
        middlewareCustomLogger.end("Request handled - forbidden");
        return NextResponse.rewrite(new URL("/forbidden", request.url));
      }
      const response = NextResponse.rewrite(
        new URL(`/internal/view/free/${username}/${shortname}`, request.url),
      );
      middlewareCustomLogger.custom(
        "rewrite",
        "REWRITE",
        `Rewriting to /internal/view/free: ${response.url}`,
      );
      setInternalVerification(response);
      middlewareCustomLogger.end("Request handled - rewrite");
      return response;
    }

    // Handle pro tier routes
    if (isProPresentation(request)) {
      middlewareCustomLogger.custom(
        "route-match",
        "ROUTING",
        "Handling Pro Presentation route",
      );
      const shortname = pathname.substring(2); // Remove leading /!
      middlewareCustomLogger.debug(`Extracted shortname: ${shortname}`);
      if (forbiddenNames.includes(shortname)) {
        middlewareCustomLogger.warn(
          "Shortname is forbidden, rewriting to /forbidden",
        );
        middlewareCustomLogger.end("Request handled - forbidden");
        return NextResponse.rewrite(new URL("/forbidden", request.url));
      }
      const response = NextResponse.rewrite(
        new URL(`/internal/view/pro/${shortname}`, request.url),
      );
      middlewareCustomLogger.custom(
        "rewrite",
        "REWRITE",
        `Rewriting to /internal/view/pro: ${response.url}`,
      );
      setInternalVerification(response);
      middlewareCustomLogger.end("Request handled - rewrite");
      return response;
    }

    // Handle root route
    if (isRootRoute(request)) {
      middlewareCustomLogger.custom(
        "route-match",
        "ROUTING",
        "Handling Root Route (main domain)",
      );
      if (!isSignedIn) {
        const response = NextResponse.rewrite(
          new URL("/internal/hero/B2C", request.url),
        );
        middlewareCustomLogger.custom(
          "rewrite",
          "REWRITE",
          `Rewriting to /internal/hero/B2C: ${response.url}`,
        );
        setInternalVerification(response);
        middlewareCustomLogger.end("Request handled - rewrite");
        return response;
      }
      const response = NextResponse.rewrite(
        new URL(`/internal/home/user`, request.url),
      );
      middlewareCustomLogger.custom(
        "rewrite",
        "REWRITE",
        `Rewriting to /internal/home/user: ${response.url}`,
      );
      setInternalVerification(response);
      middlewareCustomLogger.end("Request handled - rewrite");
      return response;
    }

    middlewareCustomLogger.end("Request completed - next");
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
