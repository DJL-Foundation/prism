import chalk from "chalk";
import { headers, cookies } from "next/headers";
import { forbidden } from "next/navigation";
import { Logger } from "#logger";
import { verifyInternalAccess } from "~/lib/internal-verification";

const LayoutLogger = new Logger("InternalLayout", "debug", {
  customMethods: {
    getHeaders: {
      color: chalk.blueBright,
      type: "HEADERS",
    },
    verificationSuccess: {
      color: chalk.greenBright,
      type: "VERIFICATION",
    },
    verificationFailed: {
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
    LayoutLogger.c.verificationFailed(
      `Internal verification failed, redirecting to forbidden. Cookie: ${verificationCookie ? "present" : "missing"}, Header: ${verificationHeader ? "present" : "missing"}`,
    );
    LayoutLogger.end("Internal verification check completed");
    forbidden();
  }

  LayoutLogger.c.verificationSuccess("Internal verification passed");
  LayoutLogger.end("Internal verification check completed");

  return <>{children}</>;
}
