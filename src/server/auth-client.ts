import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  oneTapClient,
  usernameClient,
  organizationClient,
  jwtClient,
} from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";
import env from "#env";
import { ac, user, proUser, admin } from "./permisions";

const authClient = createAuthClient({
  plugins: [
    jwtClient(),
    usernameClient(),
    passkeyClient(),
    oneTapClient({
      clientId: env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID,

      autoSelect: true,
      cancelOnTapOutside: true,
      context: "signin",
    }),
    adminClient({
      ac,
      roles: {
        admin,
        user,
        proUser,
      },
    }),
    organizationClient(),
  ],
});

export namespace AuthTypes {
  export type Session = (typeof authClient)["$Infer"]["Session"];
  export type ActiveOrganization =
    (typeof authClient)["$Infer"]["ActiveOrganization"];
  export type Invitation = (typeof authClient)["$Infer"]["Invitation"];
  export type Member = (typeof authClient)["$Infer"]["Member"];
  export type Organization = (typeof authClient)["$Infer"]["Organization"];
  export type Passkey = (typeof authClient)["$Infer"]["Passkey"];
  export type Team = (typeof authClient)["$Infer"]["Team"];
}

export default authClient;
