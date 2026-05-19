import { db } from "@/lib/db";
import { isTokenExpired } from "@/lib/tokens";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Alert } from "@/components/ui/Alert";
import Link from "next/link";

export const metadata = { title: "Reset password — SecureGate" };

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const resetToken = await db.passwordResetToken.findUnique({ where: { token } });
  const isValid = resetToken && !isTokenExpired(resetToken.expires);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] bg-[var(--md-sys-color-surface)] rounded-[var(--radius-lg)] shadow-[var(--elevation-1)] p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)]">Reset password</h1>
          <p className="mt-1 text-sm text-[var(--md-sys-color-outline)]">Choose a new password for your account.</p>
        </div>

        {isValid ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="space-y-4">
            <Alert variant="error">
              This reset link is invalid or has expired.
            </Alert>
            <p className="text-sm text-center text-[var(--md-sys-color-outline)]">
              <Link href="/forgot-password" className="text-[var(--md-sys-color-primary)] font-medium hover:underline">
                Request a new reset link
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
