import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";
import { isTokenExpired } from "@/lib/tokens";

const schema = z.object({
  token: z.string().length(64),
  password: z.string().min(8).max(100),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const { token, password } = parsed.data;

    const resetToken = await db.passwordResetToken.findUnique({ where: { token } });

    if (!resetToken || isTokenExpired(resetToken.expires)) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired link" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    await db.user.update({
      where: { email: resetToken.email },
      data: { password: hashed },
    });

    await db.passwordResetToken.delete({ where: { token } });

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
