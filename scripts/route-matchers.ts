import {
  Effect,
  Console,
  Array as EffectArray,
  String as EffectString,
  pipe,
  Data,
} from "effect";
import { FileSystem } from "@effect/platform";
import { Path } from "@effect/platform";
import { NodeContext, NodeRuntime } from "@effect/platform-node";

// #region Model
interface RouteInfo {
  readonly path: string;
  readonly isPage: boolean;
  readonly isLayout: boolean;
  readonly isApi: boolean;
  readonly isDynamic: boolean;
  readonly segments: readonly string[];
  readonly category?: string;
}

class FSError extends Data.TaggedError("FSError")<{
  readonly error: unknown;
}> {}

class TemplateError extends Data.TaggedError("TemplateError")<{
  readonly error: unknown;
}> {}
// #endregion

// #region Configuration
const APP_DIR = "./src/app";
const PUBLIC_DIR = "./public";
const OUTPUT_FILE = "./src/lib/routes.generated.ts";
const ROUTE_MATCHERS_FILE = "./src/lib/route-matchers.ts";
const FORBIDDEN_TEMPLATE_PATH = "../src/lib/forbidden.template.ts";
const BYPASS_TEMPLATE_PATH = "../src/lib/bypass.template.ts";
// #endregion

// #region Services
const scanPublicDirectory = (
  dir: string,
  basePath = ""
): Effect.Effect<string[], FSError, FileSystem.FileSystem | Path.Path> =>
  Effect.gen(function* (_) {
    const fs = yield* _(FileSystem.FileSystem);
    const path = yield* _(Path.Path);
    const entries = yield* _(
      fs.readDirectory(dir),
      Effect.mapError((error) => new FSError({ error }))
    );

    const results = yield* _(
      Effect.forEach(
        entries,
        (entry) => {
          const newPath = basePath ? `${basePath}/${entry}` : `/${entry}`;
          const fullPath = path.join(dir, entry);
          return Effect.gen(function* (_) {
            const stat = yield* _(
              fs.stat(fullPath),
              Effect.mapError((error) => new FSError({ error }))
            );
            if (stat.type === "Directory") {
              return yield* _(scanPublicDirectory(fullPath, newPath));
            }
            return [newPath];
          });
        },
        { concurrency: "inherit" }
      )
    );

    return EffectArray.flatten(results);
  });

const scanAppDirectory = (
  dir: string,
  basePath = "",
  category?: string
): Effect.Effect<RouteInfo[], FSError, FileSystem.FileSystem | Path.Path> =>
  Effect.gen(function* (_) {
    const fs = yield* _(FileSystem.FileSystem);
    const path = yield* _(Path.Path);
    const entries = yield* _(
      fs.readDirectory(dir),
      Effect.mapError((error) => new FSError({ error }))
    );

    const results = yield* _(
      Effect.forEach(
        entries,
        (entry) => {
          const fullPath = path.join(dir, entry);
          return Effect.gen(function* (_) {
            const stat = yield* _(
              fs.stat(fullPath),
              Effect.mapError((error) => new FSError({ error }))
            );
            if (stat.type === "Directory") {
              if (entry.startsWith("(") && entry.endsWith(")")) {
                const categoryName = entry.slice(1, -1);
                return yield* _(
                  scanAppDirectory(fullPath, basePath, categoryName)
                );
              }
              const newPath = basePath ? `${basePath}/${entry}` : `/${entry}`;
              return yield* _(scanAppDirectory(fullPath, newPath, category));
            }

            const isPage =
              entry.includes("page.tsx") ||
              entry.includes("page.ts") ||
              entry.includes("page.js");
            const isLayout =
              entry.includes("layout.tsx") ||
              entry.includes("layout.ts") ||
              entry.includes("layout.js");
            const isApi =
              entry.includes("route.tsx") ||
              entry.includes("route.ts") ||
              entry.includes("route.js");

            if (isPage || isLayout || isApi) {
              const segments = basePath.split("/").filter(Boolean);
              const isDynamic = segments.some(
                (s) => s.startsWith("[") && s.endsWith("]")
              );
              const route: RouteInfo = {
                path: basePath || "/",
                isPage,
                isLayout,
                isApi,
                isDynamic,
                segments,
                category,
              };
              return [route];
            }

            return [];
          });
        },
        { concurrency: "inherit" }
      )
    );

    return EffectArray.flatten(results);
  });
// #endregion

// #region Logic
const ensureRouteMatchersFile = () =>
  Effect.gen(function* (_) {
    const fs = yield* _(FileSystem.FileSystem);
    const content = `import { type NextRequest } from "next/server";

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
export const isRootRoute = createRouteMatcher(["^/$"]);`;

    const exists = yield* _(
      fs.exists(ROUTE_MATCHERS_FILE),
      Effect.mapError((error) => new FSError({ error }))
    );
    if (!exists) {
      yield* _(
        fs.writeFileString(ROUTE_MATCHERS_FILE, content),
        Effect.zipRight(
          Console.log(
            `✅ Created route matchers lib file: ${ROUTE_MATCHERS_FILE}`
          )
        ),
        Effect.mapError((error) => new FSError({ error }))
      );
    }
  });

const extractStaticPaths = (routes: readonly RouteInfo[]): readonly string[] =>
  pipe(
    routes,
    EffectArray.filter((route: RouteInfo) => route.isPage || route.isApi),
    EffectArray.flatMap((route: RouteInfo) => {
      const firstSegment = route.segments[0];
      const staticPaths: string[] = [];
      if (firstSegment && !firstSegment.startsWith("[")) {
        staticPaths.push(firstSegment);
      }
      if (!route.isDynamic && route.path !== "/") {
        staticPaths.push(route.path.substring(1));
      }
      return staticPaths;
    }),
    EffectArray.dedupe,
    (arr) => globalThis.Array.from(arr).sort()
  );

const generateCategoryData = (
  routes: readonly RouteInfo[]
): ReadonlyMap<string, readonly string[]> => {
  const categories = new Map<string, string[]>();
  for (const route of routes) {
    if (route.category && route.isPage) {
      if (!categories.has(route.category)) {
        categories.set(route.category, []);
      }
      categories.get(route.category)!.push(route.path);
    }
  }
  for (const [category, paths] of categories) {
    categories.set(category, globalThis.Array.from(paths).sort());
  }
  return categories;
};

const convertNextPathToRegex = (path: string): string => {
  // Special case for root-level optional catch-all, e.g., /[[...slug]]
  if (/^\/\[\[\.\.\..+?\]\]$/.test(path)) {
    return "^/.*$";
  }

  const regexString = path
    .split("/")
    .map((segment) => {
      if (segment.startsWith("[[...") && segment.endsWith("]]")) {
        // This is handled below as it affects the whole path from this point
        return segment;
      }
      if (segment.startsWith("[...") && segment.endsWith("]")) {
        return ".*"; // Matches everything from this point
      }
      if (segment.startsWith("[") && segment.endsWith("]")) {
        return "[^/]+"; // Matches one segment
      }
      return segment; // Static segment
    })
    .join("/");

  // Handle the optional catch-all `[[...]]` which makes the rest of the path optional
  const optionalCatchAllMarker = "/[[...";
  const optionalCatchAllIndex = regexString.indexOf(optionalCatchAllMarker);

  if (optionalCatchAllIndex !== -1) {
    const basePath = regexString.substring(0, optionalCatchAllIndex);
    // The base path itself can be a valid route, and anything after it is also valid.
    return `^${basePath}(?:/.*)?$`;
  }

  return `^${regexString}$`;
};

const loadTemplate = (
  path: string,
  templateKey: string
): Effect.Effect<readonly string[], TemplateError> =>
  Effect.tryPromise({
    try: () => import(path),
    catch: (error) => new TemplateError({ error }),
  }).pipe(
    Effect.map((mod: Record<string, unknown>) => {
      const value = mod[templateKey];
      return globalThis.Array.isArray(value) ? (value as string[]) : [];
    }),
    Effect.catchTag("TemplateError", (e) =>
      Console.warn(
        `Could not load template from ${path}, using empty array:`,
        e.error
      ).pipe(Effect.as<readonly string[]>([]))
    )
  );

const loadForbiddenTemplate = loadTemplate(
  FORBIDDEN_TEMPLATE_PATH,
  "forbiddenNamesTemplate"
);
const loadBypassTemplate = loadTemplate(
  BYPASS_TEMPLATE_PATH,
  "bypassRoutesTemplate"
);

const generateRouteMatcherFunction = (): string =>
  `
import { createRouteMatcher } from "~/lib/route-matchers";

export function isStaticRoute(pathname: string): boolean {
  const cleanPath = pathname.startsWith("/") ? pathname.substring(1) : pathname;
  const firstSegment = cleanPath.split("/")[0];
  if (!firstSegment) return false;
  return (STATIC_ROUTES as readonly string[]).includes(firstSegment) || (STATIC_ROUTES as readonly string[]).includes(cleanPath);
}
`.trim();

const generateCategoryMatchers = (
  categories: ReadonlyMap<string, readonly string[]>
): string => {
  let categoryContent = "";
  for (const [category, paths] of categories) {
    const categoryVarName = `${category}Routes`;
    categoryContent += `\n/**\n * Routes in the (${category}) category\n */\nexport const ${categoryVarName} = [\n`;
    categoryContent += globalThis.Array.from(paths)
      .map((path) => `  "${path}"`)
      .join(",\n");
    categoryContent += `\n] as const;\n`;

    const matcherName = `is${category.charAt(0).toUpperCase() + category.slice(1)}Route`;
    categoryContent += `\n/**\n * Route matcher for ${category} routes\n */\nexport const ${matcherName} = createRouteMatcher([\n`;
    categoryContent += globalThis.Array.from(paths)
      .map((path) => `  "${convertNextPathToRegex(path)}"`)
      .join(",\n");
    categoryContent += `\n]);\n`;
  }
  return categoryContent;
};

const generateRoutesFile = (
  routes: readonly RouteInfo[],
  publicPaths: readonly string[],
  forbiddenTemplate: readonly string[],
  bypassTemplate: readonly string[]
): Effect.Effect<void, FSError, FileSystem.FileSystem> =>
  Effect.gen(function* (_) {
    const fs = yield* _(FileSystem.FileSystem);
    const staticPaths = extractStaticPaths(routes);
    const categories = generateCategoryData(routes);

    const allForbiddenNames: readonly string[] = pipe(
      [...staticPaths, ...forbiddenTemplate],
      EffectArray.dedupe,
      (arr) => globalThis.Array.from(arr).sort()
    );

    const allBypassPaths: readonly string[] = pipe(
      [...publicPaths, ...bypassTemplate],
      EffectArray.dedupe,
      (arr) => globalThis.Array.from(arr).sort()
    );

    const allPaths: readonly string[] = pipe(
      [...staticPaths, ...publicPaths],
      EffectArray.dedupe,
      (arr) => globalThis.Array.from(arr).sort()
    );

    const firstSegments: readonly string[] = pipe(
      allPaths,
      EffectArray.filter(
        (path: string): path is string =>
          EffectString.isString(path) &&
          path.length > 0 &&
          !path.startsWith("/")
      ),
      EffectArray.map((path: string) => path.split("/")[0]),
      EffectArray.filter(
        (segment: string | undefined): segment is string =>
          EffectString.isString(segment) && segment.length > 0
      ),
      EffectArray.dedupe,
      (arr) => globalThis.Array.from(arr).sort()
    );

    const content = `// This file is auto-generated by scripts/route-matchers.ts
// Do not edit manually - run "bun scripts/route-matchers.ts" to regenerate

${generateRouteMatcherFunction()}

/**
 * All static routes extracted from /src/app directory
 */
export const STATIC_ROUTES = [
${staticPaths.map((path) => `  "${path}"`).join(",\n")}
] as const;

/**
 * All public asset paths from /public directory
 */
export const PUBLIC_PATHS = [
${publicPaths.map((path) => `  "${path}"`).join(",\n")}
] as const;

/**
 * All paths combined (static routes + public assets)
 */
export const ALL_PATHS = [
${allPaths.map((path) => `  "${path}"`).join(",\n")}
] as const;

/**
 * First segments from all paths - used for intelligent route matching
 */
export const FIRST_SEGMENTS = [
${firstSegments.map((segment) => `  "${segment}"`).join(",\n")}
] as const;

/**
 * Bypass routes that should instantly pass through middleware
 */
export const BYPASS_ROUTES = [
${allBypassPaths.map((path) => `  "${path}"`).join(",\n")}
] as const;

/**
 * All route information extracted from /src/app directory
 */
export const ALL_ROUTES = [
${routes
  .map(
    (route) => `  {
    path: "${route.path}",
    isPage: ${route.isPage},
    isLayout: ${route.isLayout},
    isApi: ${route.isApi},
    isDynamic: ${route.isDynamic},
    segments: [${route.segments.map((s) => `"${s}"`).join(", ")}],
    category: ${route.category ? `"${route.category}"` : "undefined"}
  }`
  )
  .join(",\n")}
] as const;

/**
 * Combined forbidden names: static routes + template forbidden names
 */
export const forbiddenNames = [
${allForbiddenNames.map((name) => `  "${name}"`).join(",\n")}
];

${generateCategoryMatchers(categories)}

/**
 * Bypass matcher - instantly passes through middleware
 */
export const isBypass = createRouteMatcher(BYPASS_ROUTES.map(route => 
  route.includes('*') ? route.replace('*', '(.*)') : route
));

/**
 * Dynamic route matchers that use FIRST_SEGMENTS for intelligent routing
 */
export const isProPresentation = createRouteMatcher(["/!([^/]+)"]);

export const isUserProfile = createRouteMatcher([
  "^/(?!" + FIRST_SEGMENTS.join("|") + ")([^/!]+)$"
]);

export const isFreePresentation = createRouteMatcher([
  "^/(?!" + FIRST_SEGMENTS.join("|") + ")([^/!]+)/([^/]+)$"
]);

// Legacy matchers for backwards compatibility
export const isPaidPresentation = isProPresentation;
export const isFreeTier = isFreePresentation;
export const isOrgPresentation = isUserProfile;
`;

    yield* _(
      fs.writeFileString(OUTPUT_FILE, content),
      Effect.zipRight(Console.log(`✅ Generated routes file: ${OUTPUT_FILE}`)),
      Effect.zipRight(Console.log(`📊 Found ${routes.length} routes`)),
      Effect.zipRight(
        Console.log(
          `🗂️  Found ${categories.size} categories: ${globalThis.Array.from(categories.keys()).join(", ")}`
        )
      ),
      Effect.zipRight(
        Console.log(`🚫 Generated ${allForbiddenNames.length} forbidden names`)
      ),
      Effect.zipRight(
        Console.log(`📁 Static routes: ${staticPaths.join(", ")}`)
      ),
      Effect.zipRight(
        Console.log(`🔄 Bypass routes: ${allBypassPaths.length} routes`)
      ),
      Effect.zipRight(
        Console.log(`📋 Public assets: ${publicPaths.length} files`)
      ),
      Effect.mapError((error) => new FSError({ error }))
    );
  });
// #endregion

// #region Main
const main = Effect.gen(function* (_) {
  yield* _(Console.log("🔍 Scanning app directory for routes..."));

  const scanResults = yield* _(
    Effect.all(
      [
        scanAppDirectory(APP_DIR),
        scanPublicDirectory(PUBLIC_DIR),
        loadForbiddenTemplate,
        loadBypassTemplate,
      ],
      { concurrency: "inherit" }
    )
  );

  const [routes, publicPaths, forbiddenTemplate, bypassTemplate] = scanResults;

  if (routes.length === 0) {
    return yield* _(
      Effect.fail(
        new Error(`❌ No routes found. Check if APP_DIR is correct: ${APP_DIR}`)
      )
    );
  }

  yield* _(ensureRouteMatchersFile());
  yield* _(
    generateRoutesFile(routes, publicPaths, forbiddenTemplate, bypassTemplate)
  );

  yield* _(Console.log("✅ Route matchers generated successfully!"));
  yield* _(
    Console.log(
      "💡 Import from: import { isUserProfile, forbiddenNames } from '~/lib/routes.generated'"
    )
  );
}).pipe(
  Effect.catchAll((error) =>
    Console.error("Error generating route matchers:", error)
  )
);

const AppLayer = NodeContext.layer;
const runnable = Effect.provide(main, AppLayer);

export function runRouteMatcherGeneration() {
  NodeRuntime.runMain(runnable);
}
// #endregion
