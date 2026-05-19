import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validations";
import { generateToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { applyForgotPasswordRateLimit } from "@/lib/rate-limit";

const SUCCESS_RESPONSE = {
  success: true,
  message: "If an account exists, a reset link has been sent.",
};

export async function POST(req: Request) {
  const limited = await applyForgotPasswordRateLimit(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const { email } = parsed.data;
    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      try {
        const token = generateToken();
        const expires = new Date(Date.now() + 60 * 60 * 1000);

        await db.passwordResetToken.deleteMany({ where: { email } });
        await db.passwordResetToken.create({ data: { email, token, expires } });

        await sendPasswordResetEmail(email, token, user.name);
      } catch {
        console.error("[forgot-password] Failed to send reset email for:", email);
      }
    }

    return NextResponse.json(SUCCESS_RESPONSE);
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
