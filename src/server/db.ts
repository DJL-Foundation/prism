import { type Prisma, PrismaClient } from "@prisma/client";
import { readReplicas } from "@prisma/extension-read-replicas";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import env from "#env";
import { Redis, type SetCommandOptions } from "@upstash/redis";
import { defaultLogLevel, Logger } from "#logger";
import chalk from "chalk";
import withPrefix from "~/lib/redis-prefixer";

const dbLogger = new Logger("DB", defaultLogLevel, {
  customMethods: {
    dbQuery: {
      color: chalk.blue,
      type: "QUERY",
    },
    dbMutation: {
      color: chalk.green,
      type: "MUTATION",
    },
    dbError: {
      color: chalk.red,
      type: "ERROR",
    },
    cacheHit: {
      color: chalk.yellow,
      type: "CACHE:HIT",
    },
    cacheMiss: {
      color: chalk.magenta,
      type: "CACHE:MISS",
    },
    cacheError: {
      color: chalk.red,
      type: "CACHE:ERROR",
    },
  },
});

const cacheLayer = withPrefix(
  "@foundation/presentation-foundation&db-cache&",
  new Redis({
    url: env.DB_KV_KV_REST_API_URL,
    token: env.DB_KV_KV_REST_API_TOKEN,
  }),
);

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
      client: cacheLayer,
      invalidation: { referencesTTL: 300 },
      log: {
        info: (message: string) => dbLogger.info(message),
        error: (message: string) => dbLogger.c.dbError(message),
        warn: (message: string) => dbLogger.warn(message),
        debug: (message: string) => dbLogger.debug(message),
      },
    },
  },
  cacheTime: 300,
  excludeMethods: ["count", "groupBy"],
  onHit: (key) => {
    dbLogger.c.cacheHit(`Cache hit for key: ${key}`);
  },
  onMiss: (key) => {
    dbLogger.c.cacheMiss(`Cache miss for key: ${key}`);
  },
  onError: (key) => {
    dbLogger.c.cacheError(`Cache error for key: ${key}`);
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
  dbLogger.c.dbQuery(`${e.query} -- ${e.params} (${e.duration}ms)`);
});

prismaClient.$on("error", (e) => {
  dbLogger.c.dbError(e.message);
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
