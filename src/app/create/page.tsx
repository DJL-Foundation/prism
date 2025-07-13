import auth from "#auth";
import { redirect } from "next/navigation";
import { CreatePage } from "./core";
import type { Metadata } from "next";
import { headers } from "next/headers";

// TODO: Implement Metadata
export const metadata: Metadata = {
  title: "Create your Own Presentation on the Presentation Foundation",
  description:
    "Absolutely Free, No Sign Up Required, No Cloud Storage Required.",
  openGraph: {
    title: "Create your Own Presentation on the Presentation Foundation",
    description:
      "Absolutely Free, No Sign Up Required, No Cloud Storage Required.",
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    title: "Create your Own Presentation on the Presentation Foundation",
    description:
      "Absolutely Free, No Sign Up Required, No Cloud Storage Required.",
  },
  classification: "Public",
};

export default async function Page() {
  const authData = await auth.api.getSession({ headers: await headers() });
  if (!authData) {
    redirect("/login");
  }

  return <CreatePage userId={authData.user.id} />;
}
