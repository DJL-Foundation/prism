"use client";

import { useParams } from "next/navigation";
import Maintanance from "~/components/maintanance";

export default function ViewFreePage() {
  const params = useParams();
  const username = params.username as string;
  const shortname = params.shortname as string;
  return (
    <Maintanance
      debug={true}
      message={`/internal/view/free/${username}/${shortname}`}
    />
  );
}
