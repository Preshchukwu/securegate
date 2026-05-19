import { LoginForm } from "@/components/auth/LoginForm";
import { Alert } from "@/components/ui/Alert";

export const metadata = { title: "Sign in — SecureGate" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const { reset } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] bg-[var(--md-sys-color-surface)] rounded-[var(--radius-lg)] shadow-[var(--elevation-1)] p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)]">Welcome back</h1>
          <p className="mt-1 text-sm text-[var(--md-sys-color-outline)]">Sign in to your account</p>
        </div>
        {reset === "success" && (
          <Alert variant="success">Password updated. Sign in with your new password.</Alert>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
