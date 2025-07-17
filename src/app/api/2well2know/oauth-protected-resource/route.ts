import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const origin = new URL(req.url).origin;
  return Response.json(
    {
      resource: `${origin}`,
      authorization_servers: [`${origin}`],
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "mcp-protocol-version, Content-Type",
      },
    },
  );
}
