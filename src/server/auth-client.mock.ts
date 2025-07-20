import { fn } from "storybook/test";
import actual from "#auth/client";

const getSession = fn(actual.getSession).mockName("authClient");

const authClient = {
  ...actual,
  getSession,
};

export default authClient;
