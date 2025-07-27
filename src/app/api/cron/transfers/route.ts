import env from "#env";
import { type NextRequest, NextResponse } from "next/server";
import { api } from "~/trpc/server";

export async function GET(req: NextRequest) {
  if (
    process.env.NODE_ENV !== "development" &&
    req.headers.get("Authorization") !== `Bearer ${env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await api.files.transfers.run();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Transfer cron failed", err);
    return new NextResponse("Cron failed", { status: 500 });
  }
}
