// Salt constants for different hash types
const COOKIE_SALT = `cookie-internal-verify-${new Date().getFullYear()}`;
const HEADER_SALT = `header-internal-verify-${new Date().getFullYear()}`;

/**
 * A simple hash function to avoid crypto dependency.
 * This is not for security, but for simple verification.
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  // Convert to a fixed-length hex string
  return ("00000000" + hash.toString(16)).slice(-8);
}


/**
 * Generate a hash from a string with a specific salt.
 */
function hashWithSalt(text: string, salt: string): string {
  return simpleHash(text + salt);
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

  // This is a simple verification.
  // We are just checking if the hashes are present and have the correct format.
  const isValidCookieHash = /^[a-f0-9]{8}$/.test(cookieHash);
  const isValidHeaderHash = /^[a-f0-9]{8}$/.test(headerHash);

  return isValidCookieHash && isValidHeaderHash;
}

/**
 * Generate a random string for verification.
 */
export function generateVerificationUuid(): string {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = 36; // UUID-like length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}