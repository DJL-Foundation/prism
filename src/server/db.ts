import { type Prisma, PrismaClient } from "@prisma/client";
import { readReplicas } from "@prisma/extension-read-replicas";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import env from "#env";
import { Redis, type SetCommandOptions } from "@upstash/redis";
import { defaultLogLevel, Logger } from "~/lib/logging";
import chalk from "chalk";

const dbLogger = new Logger("DB", defaultLogLevel, {
  customMethods: {
    "db.query": {
      color: chalk.blue,
      type: "QUERY",
    },
    "db.mutation": {
      color: chalk.green,
      type: "MUTATION",
    },
    "db.error": {
      color: chalk.red,
      type: "ERROR",
    },
    "cache.hit": {
      color: chalk.yellow,
      type: "CACHE:HIT",
    },
    "cache.miss": {
      color: chalk.magenta,
      type: "CACHE:MISS",
    },
    "cache.error": {
      color: chalk.red,
      type: "CACHE:ERROR",
    },
  },
});

const cacheLayer = new Redis({
  url: env.DB_CACHE_KV_REST_API_URL,
  token: env.DB_CACHE_KV_REST_API_TOKEN,
});

// Wrapper to add key prefix since Upstash doesn't support it natively
const cacheLayerWithPrefix = {
  ...cacheLayer,
  get: (key: string) =>
    cacheLayer.get(`@foundation/presentation-foundation&${key}`),
  set: (
    key: string,
    value: string | number | boolean | object,
    options?: SetCommandOptions,
  ) =>
    cacheLayer.set(
      `@foundation/presentation-foundation&${key}`,
      value,
      options,
    ),
  del: (key: string) =>
    cacheLayer.del(`@foundation/presentation-foundation&${key}`),
  exists: (key: string) =>
    cacheLayer.exists(`@foundation/presentation-foundation&${key}`),
  expire: (key: string, seconds: number) =>
    cacheLayer.expire(`@foundation/presentation-foundation&${key}`, seconds),
  ttl: (key: string) =>
    cacheLayer.ttl(`@foundation/presentation-foundation&${key}`),
} as Redis;

const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
  models: [
    {
      model: "User",
      cacheKey: "user$",
    },
    {
      model: "Session",
      cacheKey: "session$",
    },
    {
      model: "Account",
      cacheKey: "account$",
    },
    {
      model: "presentations",
      cacheKey: "presentation$",
    },
    {
      model: "files",
      cacheKey: "file$",
    },
    {
      model: "Organization",
      cacheKey: "organization$",
    },
    {
      model: "Member",
      cacheKey: "member$",
    },
  ],
  storage: {
    type: "redis",
    options: {
      // @ts-expect-error Mismatching Redis Versions, but compatible
      client: cacheLayerWithPrefix,
      invalidation: { referencesTTL: 300 },
      log: {
        info: (message: string) => dbLogger.info(message),
        error: (message: string) =>
          dbLogger.custom("db.error", "ERROR", message),
        warn: (message: string) => dbLogger.warn(message),
        debug: (message: string) => dbLogger.debug(message),
      },
    },
  },
  cacheTime: 300,
  excludeMethods: ["count", "groupBy"],
  onHit: (key) => {
    dbLogger.custom("cache.hit", "CACHE:HIT", `Cache hit for key: ${key}`);
  },
  onMiss: (key) => {
    dbLogger.custom("cache.miss", "CACHE:MISS", `Cache miss for key: ${key}`);
  },
  onError: (key) => {
    dbLogger.custom(
      "cache.error",
      "CACHE:ERROR",
      `Cache error for key: ${key}`,
    );
  },
});

const replicaUrls = [env.DB_READ1_STRING, env.DB_READ2_STRING];

const prismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

prismaClient.$on("query", (e) => {
  dbLogger.custom(
    "db.query",
    "QUERY",
    `${e.query} -- ${e.params} (${e.duration}ms)`,
  );
});

prismaClient.$on("error", (e) => {
  dbLogger.custom("db.error", "ERROR", e.message);
});

prismaClient.$on("info", (e) => {
  dbLogger.info(e.message);
});

prismaClient.$on("warn", (e) => {
  dbLogger.warn(e.message);
});

prismaClient.$use(cacheMiddleware);

const db = prismaClient.$extends(
  readReplicas({
    url: replicaUrls,
  }),
);

export { db };
