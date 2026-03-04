import { drizzle } from "drizzle-orm/node-postgres";
import { withReplicas } from "drizzle-orm/pg-core";
import env from "#env";

const createConnectionString = (host: string) =>
  `postgres://${env.AUTHDB_USER}:${env.AUTHDB_PASSWORD}@${host}/${env.AUTHDB_DATABASE}?sslmode=require`;

const primaryDb = drizzle(createConnectionString(env.AUTHDB_WRITE));
const read1 = drizzle(createConnectionString(env.AUTHDB_READ_1));
const read2 = drizzle(createConnectionString(env.AUTHDB_READ_2));

export const db = withReplicas(primaryDb, [read1, read2]);
