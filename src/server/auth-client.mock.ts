import { fn } from "storybook/test";
import actual from "#auth/client";

export const authCall = fn((string: string) =>
  console.log(`authClient called -- ${string}`),
).mockName("authClient.mocked.authCall");

const getSession = fn(actual.getSession).mockName("authClient.getSession");

const signOut = fn(actual.signOut).mockName("authClient.signOut");
const signInEmail = fn(actual.signIn.email).mockName("authClient.signIn.email");

const signInSocial = fn(actual.signIn.social).mockName(
  "authClient.signIn.social",
);

const signInPasskey = fn(actual.signIn.passkey).mockName(
  "authClient.signIn.passkey",
);

const oneTap = fn(actual.oneTap).mockName("authClient.oneTap");

const authClient = {
  ...Object.keys(actual).filter(
    (key) =>
      key !== "getSession" &&
      key !== "signOut" &&
      key !== "signIn" &&
      key !== "oneTap",
  ),
  getSession,
  signOut,
  signIn: {
    email: signInEmail,
    social: signInSocial,
    passkey: signInPasskey,
  },
  oneTap,
};

export { type AuthTypes } from "#auth/client";

export default authClient;
