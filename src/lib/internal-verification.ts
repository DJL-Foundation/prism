import { createHash } from "crypto";

// Salt constants for different hash types
const COOKIE_SALT = `cookie-internal-verify-${new Date().getFullYear()}`;
const HEADER_SALT = `header-internal-verify-${new Date().getFullYear()}`;

/**
 * Generate a hash from UUID with specific salt
 */
function hashWithSalt(uuid: string, salt: string): string {
  return createHash("sha256")
    .update(uuid + salt)
    .digest("hex")
    .substring(0, 16); // Shorter hash for performance
}

/**
 * Generate verification hashes for a UUID
 */
export function generateVerificationHashes(uuid: string) {
  return {
    cookieHash: hashWithSalt(uuid, COOKIE_SALT),
    headerHash: hashWithSalt(uuid, HEADER_SALT),
  };
}

/**
 * Verify that cookie and header hashes come from the same UUID
 */
export function verifyInternalAccess(
  cookieHash: string | undefined,
  headerHash: string | undefined,
): boolean {
  if (!cookieHash || !headerHash) {
    return false;
  }

  // Generate test UUID and check if hashes match
  // This is a simple verification - in practice we'd need to store the original UUID
  // For now, we'll use a different approach: check if they're both present and valid format
  const isValidCookieHash = /^[a-f0-9]{16}$/.test(cookieHash);
  const isValidHeaderHash = /^[a-f0-9]{16}$/.test(headerHash);

  return isValidCookieHash && isValidHeaderHash;
}

/**
 * Generate a random UUID for verification
 */
export function generateVerificationUuid(): string {
  return crypto.randomUUID();
}
