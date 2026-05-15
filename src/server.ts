import handler from "@tanstack/react-start/server-entry";
import { paraglideMiddleware } from "./paraglide/server";

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    // Prüfen, ob die Anfrage von einer der alten Domains kommt
    const forbiddenHosts = [
      "www.prism.djl.foundation",
    ];

    if (forbiddenHosts.includes(url.hostname)) {
      // Baue die neue URL mit dem gleichen Pfad und den gleichen Parametern
      const destination = `https://prism.djl.foundation${url.pathname}${url.search}`;

      return new Response(null, {
        status: 301,
        headers: {
          Location: destination,
        },
      });
    }

    // Wenn die Domain korrekt ist, normal fortfahren
    return paraglideMiddleware(req, () => handler.fetch(req));
  },

  // Handle Queue messages
  // @ts-expect-error - cloudflare queues
  async queue(batch, env, ctx) {
    for (const message of batch.messages) {
      console.log("Processing message:", message.body);
      message.ack();
    }
  },

  // Handle Cron Triggers
  // @ts-expect-error - cloudflare cron
  async scheduled(event, env, ctx) {
    console.log("Cron triggered:", event.cron);
  },
};
