import { fn } from "storybook/test";
import actual from "#auth/client";

export const authCall = fn((string: string) =>
  console.log(`authClient called -- ${string}`),
).mockName("authClient.mocked.authCall");

const getSession = fn(actual.getSession).mockName("authClient.getSession");

const signOut = fn(actual.signOut).mockName("authClient.signOut");

const authClient = {
  ...Object.keys(actual).filter(
    (key) => key !== "getSession" && key !== "signOut",
  ),
  getSession,
  signOut,
};

export { type AuthTypes } from "#auth/client";

export default authClient;
