import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { z } from "zod";

const resendSchema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = resendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const { email } = parsed.data;
    const user = await db.user.findUnique({ where: { email } });

    // Always return success — do not reveal whether email exists
    if (user && !user.emailVerified) {
      try {
        const token = generateToken();
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        await db.verificationToken.upsert({
          where: { identifier: email },
          create: { identifier: email, token, expires },
          update: { token, expires },
        });

        await sendVerificationEmail(email, token, user.name);
      } catch {
        console.error("[verify-email] Failed to resend for:", email);
      }
    }

    return NextResponse.json({
      success: true,
      message: "If an unverified account exists, a new verification email has been sent.",
    });
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
