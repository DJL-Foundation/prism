import { type AuthTypes } from "#auth/client";

export const mockSessionData: AuthTypes.Session = {
  user: {
    name: "Max Mustermann",
    email: "max.mustermann@example.com",
    image: "https://github.com/max-mustermann.jpg",
    username: "MaxMustermann",
    id: "",
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    banned: undefined,
  },
  session: {
    id: "",
    token: "",
    userId: "",
    expiresAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
