import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Suspense } from "react";
import UserButton, { UserButtonSkeleton } from "../auth/UserButton";
import SignInButton from "../auth/SignInButton";
import { type AuthTypes } from "#auth/client";
import { motion, MotionConfig } from "motion/react";

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  assumeSignedIn: boolean; // For Suspense
  authData: AuthTypes.Session | null;
  beta: boolean; // Shows beta string
  print: boolean; // Print Styles and Full Text
  darkMode: boolean; // Dark mode toggle
}

export default function Header({
  assumeSignedIn,
  authData,
  beta = false,
  print = false,
  darkMode = false,
  ...props
}: HeaderProps) {
  if (print) {
    throw new Error("test");
  }
  return (
    <MotionConfig reducedMotion={print ? "always" : "user"}>
      <motion.header
        className={`bg-background ${print ? "border-b-2" : "border-b border-border"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="container mx-auto px-4 py-4 flex items-center justify-between"
          {...props}
        >
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2" prefetch>
              <div className="relative w-10 h-10">
                <Image
                  src={
                    darkMode
                      ? "/unclipped.svg"
                      : print
                        ? "/unclipped-noblur.svg"
                        : "/logo.png"
                  }
                  alt="Presentation Foundation Logo"
                  fill
                  className={`object-contain ${print ? "brightness-0" : ""}`}
                />
              </div>
              <span className="text-xl font-semibold">
                Presentation Foundation
              </span>
              {beta && (
                <span className="text-xl font-semibold">&lt;Beta&gt;</span>
              )}
              {print && (
                <span className="text-sm font-medium">
                  by The DJL Foundation
                </span>
              )}
            </Link>
          </div>

          {!print && (
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {assumeSignedIn && (
                <Button asChild>
                  <Link prefetch href="/manage">
                    Manage
                  </Link>
                </Button>
              )}

              <div className="relative h-10">
                <Suspense fallback={<NoAssumptionState />}>
                  <Suspense
                    fallback={
                      assumeSignedIn ? (
                        <UserButtonSkeleton />
                      ) : (
                        <SignInButton isLoading />
                      )
                    }
                  >
                    {authData ? (
                      <UserButton userdata={authData} />
                    ) : (
                      <SignInButton />
                    )}
                  </Suspense>
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </motion.header>
    </MotionConfig>
  );
}

function NoAssumptionState() {
  return <Skeleton className="w-32 h-10" />;
}
