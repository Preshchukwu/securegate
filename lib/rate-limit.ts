import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createLimiter(requests: number, window: `${number} ${"ms" | "s" | "m" | "h" | "d"}`) {
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: false,
  });
}

export const loginLimiter = createLimiter(5, "10 m");
export const forgotPasswordLimiter = createLimiter(3, "15 m");

export function getRateLimitResponse(reset: number): Response {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);
  const minutes = Math.ceil(retryAfter / 60);
  return Response.json(
    { success: false, error: `Too many attempts. Try again in ${minutes} minute${minutes !== 1 ? "s" : ""}.` },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

export function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
}
