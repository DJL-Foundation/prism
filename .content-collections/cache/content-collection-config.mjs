// content-collections.ts
import {
  defineCollection,
  defineConfig,
  defineParser,
  defineSingleton
} from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { parse as parseToml } from "@iarna/toml";
import { z } from "zod";
import remarkGfm from "remark-gfm";
var tomlParser = defineParser((content) => parseToml(content));
var pages = defineCollection({
  name: "pages",
  directory: "content/pages",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    content: z.string().optional()
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm]
    });
    return {
      ...document,
      slug: document._meta.path,
      mdx
    };
  }
});
var heroimages = defineSingleton({
  name: "hero-images",
  filePath: "content/hero/images.toml",
  parser: tomlParser,
  schema: z.object({
    images: z.array(
      z.object({
        src: z.string(),
        credit: z.string().optional()
      })
    )
  })
});
var content_collections_default = defineConfig({
  content: [pages, heroimages]
});
export {
  content_collections_default as default
};
