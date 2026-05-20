import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { VerificationEmail } from "@/emails/VerificationEmail";
import { PasswordResetEmail } from "@/emails/PasswordResetEmail";

const FROM = `"SecureGate" <${process.env.SMTP_USER}>`;

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
): Promise<void> {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email/${token}`;
  const html = await render(VerificationEmail({ name, verifyUrl }));

  await getTransporter().sendMail({
    from: FROM,
    to: email,
    subject: "Verify your SecureGate email",
    html,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string
): Promise<void> {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;
  const html = await render(PasswordResetEmail({ name, resetUrl }));

  await getTransporter().sendMail({
    from: FROM,
    to: email,
    subject: "Reset your SecureGate password",
    html,
  });
}
