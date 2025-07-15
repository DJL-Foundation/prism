import chalk from "chalk";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Logger } from "~/lib/logging";

const LayoutLogger = new Logger("InternalLayout", "debug", {
  customMethods: {
    "get-headers": {
      color: chalk.blueBright,
      type: "HEADERS",
    },
    "header-found": {
      color: chalk.greenBright,
      type: "EVICT HEADER",
    },
    "header-not-found": {
      color: chalk.redBright,
      type: "EVICT HEADER",
    },
  },
});

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  LayoutLogger.start("Checking internal headers");

  const headerList = await headers();
  const internalHeader = headerList.get("x-internal-no-evict");

  if (internalHeader !== "true") {
    LayoutLogger.custom(
      "header-not-found",
      "Internal header not found, redirecting",
      "",
    );
    LayoutLogger.end("Internal header check completed");
    redirect("/");
  }

  LayoutLogger.custom("header-found", "Internal header found, proceeding", "");

  LayoutLogger.end("Internal header check completed");

  return <>{children}</>;
}
