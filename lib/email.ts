import { Resend } from "resend";
import { VerificationEmail } from "@/emails/VerificationEmail";
import { PasswordResetEmail } from "@/emails/PasswordResetEmail";

const FROM = "SecureGate <noreply@yourdomain.com>";

function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
): Promise<void> {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email/${token}`;

  await getResend().emails.send({
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

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Reset your SecureGate password",
    react: PasswordResetEmail({ name, resetUrl }),
  });
}
