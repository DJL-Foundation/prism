import configuration from "../../content-collections.ts";
import { GetTypeByName } from "@content-collections/core";

export type Page = GetTypeByName<typeof configuration, "pages">;
export declare const allPages: Array<Page>;

export type HeroImage = GetTypeByName<typeof configuration, "hero-images">;
export declare const heroImage: HeroImage;

export {};
