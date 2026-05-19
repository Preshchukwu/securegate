"use client";

import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export type AuthView = "login" | "signup" | "forgot";

const meta: Record<AuthView, { title: string; subtitle: string }> = {
  login:  { title: "Welcome back",     subtitle: "Sign in to your account" },
  signup: { title: "Create account",   subtitle: "Get started with SecureGate" },
  forgot: { title: "Forgot password?", subtitle: "Enter your email to receive a reset link" },
};

interface AuthCardProps {
  initialView?: AuthView;
  resetSuccess?: boolean;
}

export function AuthCard({ initialView = "login", resetSuccess }: AuthCardProps) {
  const [view, setView] = useState<AuthView>(initialView);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--md-sys-color-background)]">
      <div className="w-full max-w-[440px]">
        {/* Theme toggle — top right of page */}
        <div className="flex justify-end mb-3">
          <ThemeToggle />
        </div>

        <div className="bg-[var(--md-sys-color-surface)] rounded-[var(--radius-lg)] shadow-[var(--elevation-1)] p-8">
          {/* Animated content area — key forces remount + re-animation on view change */}
          <div key={view} className="auth-form-enter space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)]">
                {meta[view].title}
              </h1>
              <p className="mt-1 text-sm text-[var(--md-sys-color-outline)]">
                {meta[view].subtitle}
              </p>
            </div>

            {view === "login"  && <LoginForm  onSwitch={setView} resetSuccess={resetSuccess} />}
            {view === "signup" && <SignUpForm  onSwitch={setView} />}
            {view === "forgot" && <ForgotPasswordForm onSwitch={setView} />}
          </div>
        </div>
      </div>
    </main>
  );
}
