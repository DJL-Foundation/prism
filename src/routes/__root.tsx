import type { QueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { scan } from "react-scan";
import * as m from "#p";
import { initLenis } from "~/lib/lenis";
import NoiseOverlay from "../components/NoiseOverlay";
import { NotFoundPage } from "~/components/404";
import { ServerErrorPage } from "~/components/500";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { getLocale } from "~/paraglide/runtime";
import appCss from "../styles.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", getLocale());
    }
  },

  notFoundComponent: NotFoundPage,
  errorComponent: ServerErrorPage,

  head: () => {
    const siteUrl = "https://prism.djl.foundation";
    const title = m.site_title_full();
    const description = m.site_description();
    const ogImage = `${siteUrl}/og-image.png`;

    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title,
        },
        {
          name: "description",
          content: description,
        },
        // Open Graph
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: description,
        },
        {
          property: "og:url",
          content: siteUrl,
        },
        {
          property: "og:image",
          content: ogImage,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:site_name",
          content: title,
        },
        {
          property: "og:locale",
          content: "de_DE",
        },
        // Twitter Card
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:title",
          content: title,
        },
        {
          name: "twitter:description",
          content: description,
        },
        {
          name: "twitter:image",
          content: ogImage,
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "canonical",
          href: siteUrl,
        },
      ],
    };
  },

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    scan({ enabled: import.meta.env.DEV });
    initLenis();
  }, []);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DJL Foundation",
    url: "https://djl.foundation",
    logo: "https://djl.foundation/logo.png",
    description:
      "Träger von Bildungsveranstaltungen in Informatik, Robotik und IT für Jugendliche",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Stade",
      addressCountry: "DE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@djl.foundation",
      contactType: "General Inquiries",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Prism-Presentations",
    url: "https://prism.djl.foundation",
    description: "SaaS Presentations Hosting, finanzierung der DJL Foundation",
    inLanguage: "de",
  };

  return (
    <html lang={getLocale()}>
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="dark">
        <NoiseOverlay />
        <main data-transition-container>{children}</main>
        <Scripts />
      </body>
    </html>
  );
}
