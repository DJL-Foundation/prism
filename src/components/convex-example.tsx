"use client";

import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "~/server/convex/_generated/api";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function ConvexExample() {
  const { isLoading: isAuthLoading, isAuthenticated } = useConvexAuth();
  // @ts-expect-error - API types will be generated after running npx convex dev
  const currentUser = useQuery(api.messages.getCurrentUser);
  // @ts-expect-error - API types will be generated after running npx convex dev
  const messages = useQuery(api.messages.list);
  // @ts-expect-error - API types will be generated after running npx convex dev
  const sendMessage = useMutation(api.messages.send);

  if (isAuthLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Convex Auth Example</CardTitle>
          <CardDescription>Please sign in to use Convex features</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You need to be authenticated to access Convex data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Convex + Better Auth</CardTitle>
        <CardDescription>Successfully authenticated with Convex!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Current User</h3>
          {currentUser ? (
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p><span className="font-medium">Subject:</span> {currentUser.subject}</p>
              {currentUser.email && <p><span className="font-medium">Email:</span> {currentUser.email}</p>}
              {currentUser.name && <p><span className="font-medium">Name:</span> {currentUser.name}</p>}
            </div>
          ) : (
            <Skeleton className="h-20 w-full" />
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Messages</h3>
          {messages !== undefined ? (
            <>
              <p className="text-sm text-muted-foreground">
                {messages.length === 0 ? "No messages yet" : `${messages.length} messages`}
              </p>
              <Button onClick={async () => { try { await sendMessage({ body: "Hello from Convex!" }); } catch (error) { console.error("Failed to send message:", error); }}} size="sm" className="w-full">Send Test Message</Button>
            </>
          ) : (
            <Skeleton className="h-10 w-full" />
          )}
        </div>
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3">
          <p className="text-sm text-green-700 dark:text-green-300">✓ Convex authentication is working!</p>
        </div>
      </CardContent>
    </Card>
  );
}