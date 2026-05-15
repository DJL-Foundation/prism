/**
 * Meta tag utilities for SEO and social media sharing
 */

import { m } from "#p";

export interface MetaTagsConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SITE_URL = "https://ewf-stade.de";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export function generateMetaTags(config: MetaTagsConfig) {
  const {
    title,
    description,
    url,
    image = DEFAULT_IMAGE,
    type = "website",
    author,
    publishedTime,
    modifiedTime,
  } = config;

  const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;

  return {
    meta: [
      // Basic meta tags
      { title },
      { name: "description", content: description },

      // Open Graph
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: fullUrl },
      { property: "og:image", content: image },
      { property: "og:type", content: type },
      { property: "og:site_name", content: m.site_title_full() },
      { property: "og:locale", content: "de_DE" },

      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },

      // Article-specific meta tags
      ...(type === "article" && author
        ? [{ name: "article:author", content: author }]
        : []),
      ...(type === "article" && publishedTime
        ? [{ property: "article:published_time", content: publishedTime }]
        : []),
      ...(type === "article" && modifiedTime
        ? [{ property: "article:modified_time", content: modifiedTime }]
        : []),
    ],
    links: [
      // Canonical URL
      { rel: "canonical", href: fullUrl },
    ],
  };
}

export function generateStructuredData(
  type: "WebSite" | "Article" | "Person",
  data: Record<string, unknown>,
) {
  const baseContext = {
    "@context": "https://schema.org",
    "@type": type,
  };

  return {
    type: "application/ld+json",
    children: JSON.stringify({ ...baseContext, ...data }),
  };
}

export function generateWebSiteSchema() {
  return generateStructuredData("WebSite", {
    name: "Erstwähler Forum 2026",
    description:
      "Schulübergreifende Großveranstaltung zur politischen Bildung in Stade",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });
}

export function generateArticleSchema(article: {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  url: string;
}) {
  return generateStructuredData("Article", {
    headline: article.headline,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    image: article.image,
    url: article.url,
    publisher: {
      "@type": "Organization",
      name: "Erstwähler Forum 2026",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  });
}

export function generatePersonSchema(person: {
  name: string;
  jobTitle: string;
  description: string;
  image: string;
  url: string;
  email?: string;
}) {
  return generateStructuredData("Person", {
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.description,
    image: person.image,
    url: person.url,
    ...(person.email ? { email: person.email } : {}),
    affiliation: {
      "@type": "Organization",
      name: "Erstwähler Forum 2026",
    },
  });
}

export const SITE_BASE_URL = SITE_URL;
