import { fn } from "storybook/test";
import actual from "#auth/client";

const getSession = fn(actual.getSession).mockName("authClient.getSession");

const signOut = fn(actual.signOut).mockName("authClient.signOut");

const authClient = {
  ...actual,
  getSession,
  signOut,
};

export default authClient;
