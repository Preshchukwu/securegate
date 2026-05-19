"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Always show success — do not leak errors
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <Alert variant="success">
        If an account exists for that email, a reset link has been sent. Check your inbox.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        helperText="Enter the email associated with your account."
      />

      <Button type="submit" loading={loading} className="w-full">
        Send reset link
      </Button>

      <p className="text-center text-sm text-[var(--md-sys-color-outline)]">
        Remember your password?{" "}
        <Link href="/login" className="text-[var(--md-sys-color-primary)] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
