import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = { title: "Forgot password — SecureGate" };

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] bg-[var(--md-sys-color-surface)] rounded-[var(--radius-lg)] shadow-[var(--elevation-1)] p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)]">Forgot password?</h1>
          <p className="mt-1 text-sm text-[var(--md-sys-color-outline)]">
            Enter your email and we&apos;ll send a reset link.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
