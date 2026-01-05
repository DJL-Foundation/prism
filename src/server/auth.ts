import "server-only";
import { betterAuth } from "better-auth";
import {
  oneTap,
  username,
  admin as adminPlugin,
  mcp,
  organization,
  haveIBeenPwned,
  oAuthProxy,
  openAPI,
} from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { prismaAdapter } from "better-auth/adapters/prisma";
import env from "#env";
import { forbiddenNames } from "../lib/constants";
import { ac, admin, proUser, user } from "./permisions";
import { nextCookies } from "better-auth/next-js";
import ms from "ms";
import argon2 from "argon2";
import withPrefix from "~/lib/redis-prefixer";
import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";
import posthog from "posthog-js";

const authSecondaryStorage = withPrefix(
  "@foundation/presentation-foundation&auth$",
  new Redis({
    url: env.DB_KV_KV_REST_API_URL,
    token: env.DB_KV_KV_REST_API_TOKEN,
  })
);

const auth = betterAuth({
  appName: "Presentation Foundation",
  baseURL: env.HOST_URL,
  basePath: "/api/auth",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  secondaryStorage: {
    get(key) {
      return authSecondaryStorage.get(key);
    },
    set(key, value, ttl) {
      return authSecondaryStorage.set(key, value).then(() => {
        const _ = authSecondaryStorage.expire(key, ttl ?? -1);
      });
    },
    delete(key) {
      return authSecondaryStorage.del(key).then(() => null);
    },
  },
  trustedOrigins: [env.HOST_URL],
  secret: env.BETTER_AUTH_SECRET,
  emailVerification: {
    sendVerificationEmail(data, request) {
      return Promise.resolve();
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: ms("1d") / 1000, // in Seconds
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    sendResetPassword(data, request) {
      return Promise.resolve();
    },
    resetPasswordTokenExpiresIn: ms("1h") / 1000, // in Seconds
    password: {
      hash(password) {
        return argon2.hash(password);
      },
      verify(data) {
        return argon2.verify(data.hash, data.password);
      },
    },
  },
  socialProviders: {
    github: {
      enabled: true,
      clientId: env.GITHUB_AUTH_CLIENT_ID,
      clientSecret: env.GITHUB_AUTH_CLIENT_SECRET,
    },
    google: {
      enabled: true,
      clientId: env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_AUTH_CLIENT_SECRET,
    },
  },
  plugins: [
    username({
      maxUsernameLength: 20,
      minUsernameLength: 3,
      usernameValidator(username) {
        if (forbiddenNames.includes(username)) {
          return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          return false;
        }
        return true;
      },
    }),
    passkey({
      rpID: "presentation-foundation",
      rpName: "The Presentation Foundation",
      origin: env.HOST_URL,
      authenticatorSelection: {
        authenticatorAttachment: "cross-platform", // Use platform for platform authenticators
        residentKey: "preferred", // Encourage credential storage but not mandatory
        userVerification: "preferred", // Encourage user verification but not mandatory
      },
    }),
    oneTap({
      clientId: env.GOOGLE_AUTH_CLIENT_ID,
    }),
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
        proUser,
      },
      impersonationSessionDuration: ms("1d") / 1000, // in Seconds
      defaultBanReason: "Spamming or abusive behavior",
      defaultBanExpiresIn: ms("30d") / 1000, // in Seconds
      bannedUserMessage:
        "You have been banned from this platform. If you believe this is a mistake, please contact support.",
    }),
    mcp({
      loginPage: "/sign-in",
    }),
    organization(),
    haveIBeenPwned(),
    oAuthProxy({
      productionURL: "pr.djl.foundation",
      currentURL: env.HOST_URL,
    }),
    openAPI(),
    nextCookies(),
  ],
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification(data, request) {
        return Promise.resolve();
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification(data, request) {
        return Promise.resolve();
      },
      beforeDelete(user, request) {
        return Promise.resolve();
      },
      afterDelete(user, request) {
        return Promise.resolve();
      },
    },
  },
  session: {
    expiresIn: ms("7d") / 1000, // in Seconds
    updateAge: ms("1d") / 1000, // in Seconds
    disableSessionRefresh: true,
    storeSessionInDatabase: true,
    cookieCache: {
      enabled: true,
      maxAge: ms("5min") / 1000, // in Seconds
    },
  },
  account: {
    updateAccountOnSignIn: true,
    accountLinking: {
      enabled: true,
      trustedProviders: ["email-password", "github", "google"],
      allowDifferentEmails: false,
      allowUnlinkingAll: false,
    },
  },
  verification: {
    disableCleanup: false,
  },
  rateLimit: {
    enabled: true,
    window: ms("10s") / 1000, // in Seconds
    max: 100, // Maximum requests per window
    storage: "secondary-storage",
  },
  advanced: {
    crossSubDomainCookies: { enabled: true, domain: "pr.djl.foundation" },
    cookiePrefix: "presentation-foundation$",
    database: {
      generateId(options) {
        return randomUUID();
      },
    },
  },
  onAPIError: {
    throw: true, // When Thrown Posthog should catch it
    onError(error, _ctx) {
      posthog.captureException(error, {
        properties: {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
      });
    },
  },
});

export default auth;
// export { auth };
