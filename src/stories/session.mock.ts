import type authClient from "#auth/client";

type userData = typeof authClient.$Infer.Session;

export const mockSessionData: userData = {
  user: {
    name: "Jack Ruder",
    email: "jack.ruder@example.com",
    image: "https://github.com/jack-ruder.jpg",
    username: "JackatDJL",
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
