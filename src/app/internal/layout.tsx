import chalk from "chalk";
import { headers, cookies } from "next/headers";
import { forbidden } from "next/navigation";
import { Logger } from "~/lib/logging";
import { verifyInternalAccess } from "~/lib/internal-verification";

const LayoutLogger = new Logger("InternalLayout", "debug", {
  customMethods: {
    "get-headers": {
      color: chalk.blueBright,
      type: "HEADERS",
    },
    "verification-success": {
      color: chalk.greenBright,
      type: "VERIFICATION",
    },
    "verification-failed": {
      color: chalk.redBright,
      type: "VERIFICATION",
    },
  },
});

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  LayoutLogger.start("Checking internal verification");

  const headerList = await headers();
  const cookieStore = await cookies();

  const verificationHeader = headerList.get("x-internal-no-evict") ?? undefined;
  const verificationCookie = cookieStore.get("internal-verify")?.value;

  // Verify that both cookie and header are present and valid
  if (!verifyInternalAccess(verificationCookie, verificationHeader)) {
    LayoutLogger.custom(
      "verification-failed",
      "Internal verification failed, redirecting to forbidden",
      `Cookie: ${verificationCookie ? "present" : "missing"}, Header: ${verificationHeader ? "present" : "missing"}`,
    );
    LayoutLogger.end("Internal verification check completed");
    forbidden();
  }

  LayoutLogger.custom(
    "verification-success",
    "Internal verification passed",
    "",
  );
  LayoutLogger.end("Internal verification check completed");

  return <>{children}</>;
}
