import { readdirSync, statSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// Path configurations
const APP_DIR = "./src/app";
const PUBLIC_DIR = "./public";
const OUTPUT_FILE = "./src/lib/routes.generated.ts";
const ROUTE_MATCHERS_FILE = "./src/lib/route-matchers.ts";
const FORBIDDEN_TEMPLATE = "../src/lib/forbidden.template.ts";
const BYPASS_TEMPLATE = "../src/lib/bypass.template.ts";

interface RouteInfo {
  path: string;
  isPage: boolean;
  isLayout: boolean;
  isApi: boolean;
  isDynamic: boolean;
  segments: string[];
  category?: string;
}

/**
 * Create route-matchers.ts file if it doesn't exist
 */
function ensureRouteMatchersFile(): void {
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

  const routeMatchersExists = existsSync(ROUTE_MATCHERS_FILE);
  if (!routeMatchersExists) {
    writeFileSync(ROUTE_MATCHERS_FILE, content, "utf8");
    console.log(`✅ Created route matchers lib file: ${ROUTE_MATCHERS_FILE}`);
  }
}
/**
 * Recursively scan the public directory to get all static assets
 */
function scanPublicDirectory(dir: string, basePath = ""): string[] {
  const publicPaths: string[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Recurse into subdirectories
        const newPath = basePath ? `${basePath}/${entry}` : `/${entry}`;
        publicPaths.push(...scanPublicDirectory(fullPath, newPath));
      } else if (stat.isFile()) {
        // Add file path
        const filePath = basePath ? `${basePath}/${entry}` : `/${entry}`;
        publicPaths.push(filePath);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not scan public directory ${dir}:`, error);
  }

  return publicPaths;
}

/**
 * Recursively scan the app directory and extract all routes
 */
function scanAppDirectory(
  dir: string,
  basePath = "",
  category?: string,
): RouteInfo[] {
  const routes: RouteInfo[] = [];

  try {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Handle route groups (folders in parentheses)
        if (entry.startsWith("(") && entry.endsWith(")")) {
          // Route groups don't affect the URL path but define a category
          const categoryName = entry.slice(1, -1); // Remove parentheses
          routes.push(...scanAppDirectory(fullPath, basePath, categoryName));
        } else {
          // Regular folder - becomes part of the URL
          const newPath = basePath ? `${basePath}/${entry}` : `/${entry}`;
          routes.push(...scanAppDirectory(fullPath, newPath, category));
        }
      } else if (stat.isFile()) {
        // Check if it's a route file
        const isPage =
          entry === "page.tsx" || entry === "page.ts" || entry === "page.js";
        const isLayout =
          entry === "layout.tsx" ||
          entry === "layout.ts" ||
          entry === "layout.js";
        const isApi =
          entry === "route.tsx" || entry === "route.ts" || entry === "route.js";

        if (isPage || isLayout || isApi) {
          const segments = basePath.split("/").filter(Boolean);
          const isDynamic = segments.some(
            (segment) => segment.startsWith("[") && segment.endsWith("]"),
          );

          routes.push({
            path: basePath || "/",
            isPage,
            isLayout,
            isApi,
            isDynamic,
            segments,
            category,
          });
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dir}:`, error);
  }

  return routes;
}

/**
 * Extract static route segments that could conflict with usernames
 */
function extractStaticPaths(routes: RouteInfo[]): string[] {
  const staticPaths = new Set<string>();

  for (const route of routes) {
    // Only consider routes that are pages or APIs (not just layouts)
    if (!route.isPage && !route.isApi) continue;

    // Extract first segment of static routes
    const firstSegment = route.segments[0];
    if (firstSegment && !firstSegment.startsWith("[")) {
      staticPaths.add(firstSegment);
    }

    // Also add full static paths for more specific matching
    if (!route.isDynamic && route.path !== "/") {
      staticPaths.add(route.path.substring(1)); // Remove leading slash
    }
  }

  return Array.from(staticPaths).sort();
}

/**
 * Generate category arrays and route matchers
 */
function generateCategoryData(routes: RouteInfo[]): {
  categories: Map<string, string[]>;
  categorizedRoutes: Map<string, RouteInfo[]>;
} {
  const categories = new Map<string, string[]>();
  const categorizedRoutes = new Map<string, RouteInfo[]>();

  for (const route of routes) {
    if (route.category && route.isPage) {
      // Add to category path arrays
      if (!categories.has(route.category)) {
        categories.set(route.category, []);
        categorizedRoutes.set(route.category, []);
      }

      categories.get(route.category)!.push(route.path);
      categorizedRoutes.get(route.category)!.push(route);
    }
  }

  // Sort paths within each category
  for (const [category, paths] of categories) {
    categories.set(category, paths.sort());
  }

  return { categories, categorizedRoutes };
}

/**
 * Load forbidden names from template file
 */
async function loadForbiddenTemplate(): Promise<string[]> {
  try {
    // Import the template file using dynamic import
    const templateModule = (await import(FORBIDDEN_TEMPLATE)) as {
      forbiddenNamesTemplate: string[];
    };
    return templateModule.forbiddenNamesTemplate || [];
  } catch (error) {
    console.warn(
      "Could not load forbidden template, using empty array:",
      error,
    );
    return [];
  }
}

/**
 * Load bypass routes from template file
 */
async function loadBypassTemplate(): Promise<string[]> {
  try {
    // Import the template file using dynamic import
    const templateModule = (await import(BYPASS_TEMPLATE)) as {
      bypassRoutesTemplate: string[];
    };
    return templateModule.bypassRoutesTemplate || [];
  } catch (error) {
    console.warn("Could not load bypass template, using empty array:", error);
    return [];
  }
}

/**
 * Generate route matcher function
 */
function generateRouteMatcherFunction(): string {
  return `
import { createRouteMatcher } from "~/lib/route-matchers";

export function isStaticRoute(pathname: string): boolean {
  const cleanPath = pathname.startsWith("/") ? pathname.substring(1) : pathname;
  const firstSegment = cleanPath.split("/")[0];
  if (!firstSegment) return false;
  return (STATIC_ROUTES as readonly string[]).includes(firstSegment) || (STATIC_ROUTES as readonly string[]).includes(cleanPath);
}
`.trim();
}

/**
 * Generate category route matchers
 */
function generateCategoryMatchers(categories: Map<string, string[]>): string {
  let categoryContent = "";

  // Generate category arrays
  for (const [category, paths] of categories) {
    const categoryVarName = `${category}Routes`;
    categoryContent += `\n/**\n * Routes in the (${category}) category\n */\nexport const ${categoryVarName} = [\n`;
    categoryContent += paths.map((path) => `  "${path}"`).join(",\n");
    categoryContent += `\n] as const;\n`;
  }

  // Generate category route matchers
  for (const [category, paths] of categories) {
    const matcherName = `is${category.charAt(0).toUpperCase() + category.slice(1)}Route`;
    categoryContent += `\n/**\n * Route matcher for ${category} routes\n */\nexport const ${matcherName} = createRouteMatcher([\n`;
    categoryContent += paths
      .map((path) => `  "${path}(.*)"${path === "/" ? " // Root route" : ""}`)
      .join(",\n");
    categoryContent += `\n]);\n`;
  }

  return categoryContent;
}

/**
 * Generate the output file
 */
async function generateRoutesFile(routes: RouteInfo[]): Promise<void> {
  const staticPaths = extractStaticPaths(routes);
  const forbiddenTemplate = await loadForbiddenTemplate();
  const bypassTemplate = await loadBypassTemplate();
  const publicPaths = scanPublicDirectory(PUBLIC_DIR);
  const { categories } = generateCategoryData(routes);

  const allForbiddenNames = Array.from(
    new Set([...staticPaths, ...forbiddenTemplate]),
  ).sort();

  const allBypassPaths = Array.from(
    new Set([...publicPaths, ...bypassTemplate]),
  ).sort();

  // Add public paths to the ALL_PATHS array for comprehensive route tracking
  const allPaths = Array.from(new Set([...staticPaths, ...publicPaths])).sort();

  // Extract first segments from all paths for intelligent route matching
  const firstSegments: string[] = Array.from(
    new Set(
      allPaths
        .filter(
          (path) => typeof path === "string" && path && !path.startsWith("/"),
        )
        .map((path) => path.split("/")[0])
        .filter(
          (segment) =>
            typeof segment === "string" && segment && segment.length > 0,
        ) as string[],
    ),
  ).sort();

  // Ensure route-matchers.ts lib file exists
  ensureRouteMatchersFile();

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
  }`,
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

  writeFileSync(OUTPUT_FILE, content, "utf8");
  console.log(`✅ Generated routes file: ${OUTPUT_FILE}`);
  console.log(`📊 Found ${routes.length} routes`);
  console.log(
    `🗂️  Found ${categories.size} categories: ${Array.from(categories.keys()).join(", ")}`,
  );
  console.log(`🚫 Generated ${allForbiddenNames.length} forbidden names`);
  console.log(`📁 Static routes: ${staticPaths.join(", ")}`);
  console.log(`🔄 Bypass routes: ${allBypassPaths.length} routes`);
  console.log(`📋 Public assets: ${publicPaths.length} files`);
}

/**
 * Main execution
 */
async function main() {
  console.log("🔍 Scanning app directory for routes...");

  const routes = scanAppDirectory(APP_DIR);

  if (routes.length === 0) {
    console.error("❌ No routes found. Check if APP_DIR is correct:", APP_DIR);
    process.exit(1);
  }

  await generateRoutesFile(routes);

  console.log("✅ Route matchers generated successfully!");
  console.log(
    "💡 Import from: import { isUserProfile, forbiddenNames } from '~/lib/routes.generated'",
  );
}

export function runRouteMatcherGeneration() {
  main().catch((error) => {
    console.error("Error generating route matchers:", error);
    process.exit(1);
  });
}

// Run the script
runRouteMatcherGeneration();
