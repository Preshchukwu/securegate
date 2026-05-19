import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signUpSchema } from "@/lib/validations";
import { generateToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      // Do not reveal that the email exists
      return NextResponse.json(
        { success: false, error: "Registration failed. Please try again." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: { name, email, password: hashed },
    });

    try {
      const token = generateToken();
      const expires = new Date(Date.now() + 15 * 60 * 1000);

      await db.verificationToken.upsert({
        where: { identifier: email },
        create: { identifier: email, token, expires },
        update: { token, expires },
      });

      await sendVerificationEmail(email, token, name);
    } catch {
      // Email failure doesn't block registration
      console.error("[register] Failed to send verification email for:", user.id);
    }

    return NextResponse.json(
      { success: true, message: "Account created. Check your inbox to verify your email." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
