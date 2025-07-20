"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Skeleton } from "~/components/ui/skeleton";
import { Settings, LogOut, Loader2 } from "lucide-react";
import UserAvatar from "./UserAvatar";
import authClient from "#auth/client";

type UserData = typeof authClient.$Infer.Session;

interface UserButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  userdata: UserData;
  showName?: boolean;
  modify?: {
    forceOpenState?: boolean;
  };
}

export default function UserButton({
  userdata,
  showName,
  modify = {},
  ...props
}: UserButtonProps) {
  const [isManaging, setIsManaging] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isOpen, setIsOpen] = useState(modify.forceOpenState ?? false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authClient.signOut();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          {showName && (
            <span className="text-sm font-medium text-foreground">
              {userdata.user.name}
            </span>
          )}
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full"
            {...props}
          >
            <UserAvatar
              src={userdata.user.image}
              name={userdata.user.username}
              className="h-10 w-10"
              modify={{
                userIconSize: "h-8 w-8",
              }}
            />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="flex items-center justify-start gap-2 p-4">
          <UserAvatar
            src={userdata.user.image}
            name={userdata.user.username}
            className="h-12 w-12"
            modify={{
              userIconSize: "h-7 w-7",
            }}
          />
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userdata.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              @{userdata.user.username}
            </p>
          </div>
        </div>
        <div className="grid gap-1 p-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            disabled={isManaging}
            onClick={() => {
              setIsManaging(true);
            }}
            asChild
          >
            <Link href="/account" prefetch>
              {isManaging ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Settings className="mr-2 h-4 w-4" />
              )}
              Manage account
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function UserButtonSkeleton({
  showName = false,
}: {
  showName?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {showName && <Skeleton className="h-4 w-[100px]" />}
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  );
}
