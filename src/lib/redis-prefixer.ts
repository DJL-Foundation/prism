import { type Redis, type SetCommandOptions } from "@upstash/redis";

export default function withPrefix(prefix: string, redisClient: Redis): Redis {
  return {
    ...redisClient,
    get: (key: string) => redisClient.get(`${prefix}${key}`),
    set: (
      key: string,
      value: string | number | boolean | object,
      options?: SetCommandOptions,
    ) => redisClient.set(`${prefix}${key}`, value, options),
    del: (key: string) => redisClient.del(`${prefix}${key}`),
    exists: (key: string) => redisClient.exists(`${prefix}${key}`),
    expire: (key: string, seconds: number) =>
      redisClient.expire(`${prefix}${key}`, seconds),
    ttl: (key: string) => redisClient.ttl(`${prefix}${key}`),
  } as Redis;
}
