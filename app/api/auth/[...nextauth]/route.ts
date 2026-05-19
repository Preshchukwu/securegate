import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { applyLoginRateLimit } from "@/lib/rate-limit";
import { NextRequest } from "next/server";

const handler = NextAuth(authOptions);

export { handler as GET };

export async function POST(req: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  const params = await context.params;
  const [action, provider] = params.nextauth ?? [];

  // Only rate-limit credential sign-in
  if (action === "callback" && provider === "credentials") {
    const limited = await applyLoginRateLimit(req);
    if (limited) return limited;
  }

  return handler(req, context);
}
