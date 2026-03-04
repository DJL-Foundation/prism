"use client";

import env from "#env";
import Maintanance from "~/components/maintanance";

export default function HomeUserPage() {
  return (
    <Maintanance
      debug={true}
      message={`/internal/home/user + ${env.NEXT_PUBLIC_HOST_URL}`}
    />
  );
}
