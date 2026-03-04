"use client";

import { useParams } from "next/navigation";
import Maintanance from "~/components/maintanance";

export default function ViewProPage() {
  const params = useParams();
  const shortname = params.shortname as string;
  return (
    <Maintanance debug={true} message={`/internal/view/pro/${shortname}`} />
  );
}
