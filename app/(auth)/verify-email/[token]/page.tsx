import { db } from "@/lib/db";
import { isTokenExpired } from "@/lib/tokens";
import { Alert } from "@/components/ui/Alert";
import Link from "next/link";

export const metadata = { title: "Verify email — SecureGate" };

export default async function VerifyEmailTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const verificationToken = await db.verificationToken.findUnique({ where: { token } });

  if (!verificationToken || isTokenExpired(verificationToken.expires)) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px] bg-[var(--md-sys-color-surface)] rounded-[var(--radius-lg)] shadow-[var(--elevation-1)] p-8 space-y-6">
          <h1 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)]">Verification failed</h1>
          <Alert variant="error">This verification link is invalid or has expired.</Alert>
          <p className="text-sm text-center text-[var(--md-sys-color-outline)]">
            <Link href="/verify-email" className="text-[var(--md-sys-color-primary)] font-medium hover:underline">
              Request a new verification email
            </Link>
          </p>
        </div>
      </main>
    );
  }

  await db.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  });

  await db.verificationToken.delete({ where: { token } });

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] bg-[var(--md-sys-color-surface)] rounded-[var(--radius-lg)] shadow-[var(--elevation-1)] p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)]">Email verified</h1>
          <p className="mt-1 text-sm text-[var(--md-sys-color-outline)]">Your account is now active.</p>
        </div>
        <Alert variant="success">Your email has been verified successfully.</Alert>
        <p className="text-center">
          <Link
            href="/login"
            className="text-sm text-[var(--md-sys-color-primary)] font-medium hover:underline"
          >
            Continue to sign in →
          </Link>
        </p>
      </div>
    </main>
  );
}
