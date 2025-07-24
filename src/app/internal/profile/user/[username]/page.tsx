"use client";

import { useParams } from "next/navigation";
import Maintanance from "~/components/maintanance";

export default function ProfileUserPage() {
  const params = useParams();
  const username = params.username as string;
  return (
    <Maintanance debug={true} message={`/internal/profile/user/${username}`} />
  );
}
