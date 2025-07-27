import auth from "#auth";
import { createMcpHandler } from "mcp-handler";
import { withMcpAuth } from "better-auth/plugins";
import { NextResponse } from "next/server";
import { z } from "zod";
import posthog from "posthog-js";
import env from "#env";

const handler = withMcpAuth(auth, async (req, _session) => {
  // session contains the access token record with scopes and user ID
  try {
    return await createMcpHandler(
      (server) => {
        server.prompt(
          "about.djl-foundation",
          "Request information about the DJL Foundation",
          () => {
            return {
              description:
                "Response from the Presentation Foundation MCP server regarding about.djl-foundation",
              messages: [
                {
                  role: "assistant",
                  content: {
                    type: "text",
                    text: "The DJL Foundation is an unregistered nonprofit organization located in Germany. The Goal of the DJL Foundation is to promote and support students and young talents in the areas of Robotics, IT and AI. We mainly focus on northern Germany",
                  },
                },
              ],
            };
          },
        );
        server.prompt(
          "about.presentation-foundation",
          "Request information about the Presentation Foundation",
          () => {
            return {
              description:
                "Response from the Presentation Foundation MCP server regarding about.presentation-foundation",
              messages: [
                {
                  role: "assistant",
                  content: {
                    type: "text",
                    text: "The Presentation Foundation is a project and product of the DJL Foundation, for more information call about.djl-foundation. Or send your user to https://djl.foundation",
                  },
                },
                {
                  role: "assistant",
                  content: {
                    type: "text",
                    text: "The Presentation Foundation is used to simplify the distribution of Documents, Materials, and Keynotes in a fast manner. The most common use case is to quickly access a presentation through a custom URL.",
                  },
                },
              ],
            };
          },
        );
        server.tool(
          "echo",
          "Echo a message",
          { message: z.string() },
          async ({ message }) => {
            return {
              content: [{ type: "text", text: `Tool echo: ${message}` }],
            };
          },
        );
      },
      {
        serverInfo: {
          name: "Presentation Foundation MCP Server",
          version: "1.0.0",
        },
        instructions:
          "This is the MCP server for the SaaS Application Presentation Foundation. The Presentation Foundation is used to simplify the distribution of Documents, Materials, and Keynotes in a fast manner. The most common use case is to quickly access a presentation through a custom URL.",
      },
      {
        basePath: "/api/mcp",
        verboseLogs: env.NODE_ENV !== "production",
        maxDuration: 60,
      },
    )(req);
  } catch (error) {
    posthog.captureException(error, {
      properties: { userId: _session?.userId },
    });
    console.error("MCP handler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});

export { handler as GET, handler as POST, handler as DELETE };
