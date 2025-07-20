import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import authClient from "#auth/client";
import { Skeleton } from "../ui/skeleton";
import { Suspense } from "react";
import UserButton, { UserButtonSkeleton } from "../auth/UserButton";
import SignInButton from "../auth/SignInButton";
// import authClient from "#auth/client";
// import { use } from "react";

type userData = typeof authClient.$Infer.Session;

interface HeaderProps {
  assumeSignedIn?: boolean | undefined; // For Suspense
  authData?: userData | null;
}

export default function Header({ assumeSignedIn, authData }: HeaderProps) {
  return (
    <header className="bg-background border-b print:border-none">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center space-x-2 print:no-underline print:text-foreground"
            prefetch
          >
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="Presentation Foundation Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold">
              Presentation Foundation
            </span>
            <span className="hidden print:block print:text-xl font-semibold">
              by DJL
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4 print:hidden">
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
      </div>
    </header>
  );
}

function NoAssumptionState() {
  return <Skeleton className="w-32 h-10" />;
}
