import { redis } from "@/lib/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "5m"),
});
