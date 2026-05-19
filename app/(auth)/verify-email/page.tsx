"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Always show success
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] bg-[var(--md-sys-color-surface)] rounded-[var(--radius-lg)] shadow-[var(--elevation-1)] p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--md-sys-color-on-surface)]">Check your inbox</h1>
          <p className="mt-1 text-sm text-[var(--md-sys-color-outline)]">
            We sent a verification link to your email. The link expires in 15 minutes.
          </p>
        </div>

        {submitted ? (
          <Alert variant="success">
            If an unverified account exists, a new verification email has been sent.
          </Alert>
        ) : (
          <form onSubmit={handleResend} noValidate className="space-y-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="Didn't get the email? Enter your address to resend."
            />
            <Button type="submit" variant="secondary" loading={loading} className="w-full">
              Resend verification email
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
