import { type NextRequest, NextResponse } from "next/server";
import auth from "#auth";
import {
  generateVerificationUuid,
  generateVerificationHashes,
} from "~/lib/internal-verification";
// import { db } from "#db"; // Uncomment when org membership check is implemented

/**
 * Check if user has access to org home page
 * Redirects to appropriate page based on authentication and membership
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { orgSlug: string } },
) {
  const { orgSlug } = params;

  // Get session
  const authData = await auth.api.getSession({
    headers: request.headers,
  });

  if (!authData?.user) {
    // Not signed in - redirect to org profile page
    const response = NextResponse.redirect(
      new URL(`/internal/profile/org/${orgSlug}`, request.url),
    );

    // Set verification for the profile page
    const verificationUuid = generateVerificationUuid();
    const { cookieHash, headerHash } =
      generateVerificationHashes(verificationUuid);

    response.cookies.set("internal-verify", cookieHash, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
    });
    response.headers.set("x-internal-no-evict", headerHash);

    return response;
  }

  // TODO: Implement org membership check
  // For now, assume user has access to demonstrate the flow
  // const isMember = await isOrgMember(authData.user.id, orgSlug);
  const isMember = true; // Placeholder - replace with actual logic

  if (!isMember) {
    // Signed in but not a member - redirect to org profile page
    const response = NextResponse.redirect(
      new URL(`/internal/profile/org/${orgSlug}`, request.url),
    );

    // Set verification for the profile page
    const verificationUuid = generateVerificationUuid();
    const { cookieHash, headerHash } =
      generateVerificationHashes(verificationUuid);

    response.cookies.set("internal-verify", cookieHash, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
    });
    response.headers.set("x-internal-no-evict", headerHash);

    return response;
  }

  // Signed in and is member - redirect to org home page
  const response = NextResponse.redirect(
    new URL(`/internal/home/org/${orgSlug}`, request.url),
  );

  // Set verification for the home page
  const verificationUuid = generateVerificationUuid();
  const { cookieHash, headerHash } =
    generateVerificationHashes(verificationUuid);

  response.cookies.set("internal-verify", cookieHash, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60, // 1 hour
  });
  response.headers.set("x-internal-no-evict", headerHash);

  return response;
}

/**
 * Helper function to check org membership
 * TODO: Implement with actual database logic
 */
// async function isOrgMember(userId: string, orgSlug: string): Promise<boolean> {
//   const membership = await db.orgMembership.findFirst({
//     where: {
//       userId,
//       org: { slug: orgSlug },
//       status: 'active'
//     }
//   });
//   return !!membership;
// }
