import type { AuthConfig } from "convex/server";

const getIssuer = () => {
  if (process.env.BETTER_AUTH_ISSUER) {
    return process.env.BETTER_AUTH_ISSUER;
  }

  return "http://localhost:3000";
};

const issuer = getIssuer();

export default {
  providers: [
    {
      type: "customJwt",
      applicationID: "convex",
      issuer,
      jwks: `${issuer}/api/auth/jwks`,
      algorithm: "ES256",
    },
  ],
} satisfies AuthConfig;
