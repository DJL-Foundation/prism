import { createFileRoute } from "@tanstack/react-router";
import * as m from "#p";
import { generateMetaTags, generateWebSiteSchema } from "~/lib/meta";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => {
    const title = m.site_title_full();
    const description = m.site_description();

    return {
      ...generateMetaTags({
        title,
        description,
        url: "/",
        type: "website",
      }),
      scripts: [generateWebSiteSchema()],
    };
  },
});

function HomePage() {
  return "hello";
}
