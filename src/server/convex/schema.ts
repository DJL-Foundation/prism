import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import z from "zod";

// Vorbereitung für migration auf Zod wenn ich zuhause bin
const fileType = z.enum([
  "logo",
  "cover",
  "presentation",
  "handout",
  "research",
]);
const fileTypeV = v.union(
  v.literal("logo"),
  v.literal("cover"),
  v.literal("presentation"),
  v.literal("handout"),
  v.literal("research"),
);

const visibilityType = z.enum(["private", "public", "unlisted"]);
const visibilityTypeV = v.union(
  v.literal("private"),
  v.literal("public"),
  v.literal("unlisted"),
);

// Wollte ich nicht diese app nicht daraus ein multi-tenant system machen?

const fileStorageType = z.enum([
  "utfs", // uploadthing
  "blob",
]);
const fileStorageTypeV = v.union(v.literal("utfs"), v.literal("blob"));

const fileTransferType = z.enum(["idle", "queued", "in_progress"]);

export default defineSchema({
  files: defineTable({
    name: v.string(),
    fileType: fileTypeV,
    dataType: v.string(),
    size: v.number(),
    ufsKey: v.string(),
    blobPath: v.string(),
  }),
});
