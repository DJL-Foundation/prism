"use client";

import { useParams } from "next/navigation";
import Maintanance from "~/components/maintanance";

export default function ProfileOrgPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  return (
    <Maintanance debug={true} message={`/internal/profile/org/${orgSlug}`} />
  );
}
