import { Resend } from "resend";
import { VerificationEmail } from "@/emails/VerificationEmail";
import { PasswordResetEmail } from "@/emails/PasswordResetEmail";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "SecureGate <noreply@yourdomain.com>";

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
): Promise<void> {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email/${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your SecureGate email",
    react: VerificationEmail({ name, verifyUrl }),
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string
): Promise<void> {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your SecureGate password",
    react: PasswordResetEmail({ name, resetUrl }),
  });
}
