import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "./SignOutButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata = { title: "Dashboard — SecureGate" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (!session.user.emailVerified) redirect("/verify-email");

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] bg-[var(--md-sys-color-surface)] rounded-[var(--radius-lg)] shadow-[var(--elevation-1)] p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)]">Dashboard</h1>
            <p className="mt-1 text-sm text-[var(--md-sys-color-outline)]">You&apos;re securely signed in.</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="rounded-lg bg-[var(--md-sys-color-surface-variant)] px-4 py-4 space-y-1">
          <p className="text-sm font-medium text-[var(--md-sys-color-on-surface)]">{session.user.name}</p>
          <p className="text-sm text-[var(--md-sys-color-outline)]">{session.user.email}</p>
          <p className="text-xs text-[var(--md-sys-color-tertiary)] flex items-center gap-1 mt-1">
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path fillRule="evenodd" d="M10.97 4.97a.75.75 0 011.07 1.05l-3.99 4.99a.75.75 0 01-1.08.02L4.324 8.384a.75.75 0 111.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 01.02-.022z" clipRule="evenodd"/>
            </svg>
            Email verified
          </p>
        </div>

        <SignOutButton />
      </div>
    </main>
  );
}
