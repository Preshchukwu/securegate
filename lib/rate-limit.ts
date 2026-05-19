import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Window = `${number} ${"ms" | "s" | "m" | "h" | "d"}`;

function isConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function makeLimiter(requests: number, window: Window) {
  let instance: Ratelimit | null = null;
  return () => {
    if (!isConfigured()) return null;
    if (!instance) {
      instance = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(requests, window),
        analytics: false,
      });
    }
    return instance;
  };
}

const getLoginLimiter = makeLimiter(5, "10 m");
const getForgotPasswordLimiter = makeLimiter(3, "15 m");

export function getRateLimitResponse(reset: number): Response {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);
  const minutes = Math.ceil(retryAfter / 60);
  return Response.json(
    {
      success: false,
      error: `Too many attempts. Try again in ${minutes} minute${minutes !== 1 ? "s" : ""}.`,
    },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

export function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
}

export async function applyLoginRateLimit(req: Request): Promise<Response | null> {
  const limiter = getLoginLimiter();
  if (!limiter) return null;
  const { success, reset } = await limiter.limit(getClientIp(req));
  return success ? null : getRateLimitResponse(reset);
}

export async function applyForgotPasswordRateLimit(req: Request): Promise<Response | null> {
  const limiter = getForgotPasswordLimiter();
  if (!limiter) return null;
  const { success, reset } = await limiter.limit(getClientIp(req));
  return success ? null : getRateLimitResponse(reset);
}
