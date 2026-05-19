"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { AuthView } from "./AuthCard";

interface Props { onSwitch: (view: AuthView) => void }

export function ForgotPasswordForm({ onSwitch }: Props) {
  const firstRef = useRef<HTMLInputElement>(null);
  const [email,   setEmail]   = useState("");
  const [error,   setError]   = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { firstRef.current?.focus(); }, []);

  function validate(val: string): string {
    if (!val)                               return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address";
    return "";
  }

  function handleChange(val: string) {
    setEmail(val);
    if (touched) setError(validate(val));
  }

  function handleBlur() {
    setTouched(true);
    setError(validate(email));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate(email);
    if (err) { setError(err); setTouched(true); return; }

    setLoading(true);
    try {
      await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch { /* always show success */ } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4">
        <Alert variant="success">
          If an account exists for that email, a reset link has been sent. Check your inbox.
        </Alert>
        <p className="text-center text-sm text-[var(--md-sys-color-outline)]">
          <button
            type="button"
            onClick={() => onSwitch("login")}
            className="text-[var(--md-sys-color-primary)] font-medium hover:underline focus:outline-none"
          >
            Back to sign in
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input
        ref={firstRef}
        label="Email address"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        error={touched ? error : undefined}
        helperText="We'll send a reset link to this address."
      />

      <Button type="submit" loading={loading} className="w-full">Send reset link</Button>

      <p className="text-center text-sm text-[var(--md-sys-color-outline)]">
        Remember your password?{" "}
        <button
          type="button"
          onClick={() => onSwitch("login")}
          className="text-[var(--md-sys-color-primary)] font-medium hover:underline focus:outline-none"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
