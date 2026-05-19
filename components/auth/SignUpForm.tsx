"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { signUpSchema, type SignUpInput } from "@/lib/validations";

type FieldErrors = Partial<Record<keyof SignUpInput, string>>;

export function SignUpForm() {
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function validateField(field: keyof SignUpInput, value: string) {
    const result = signUpSchema.safeParse({ ...values, [field]: value });
    if (!result.success) {
      const fieldError = result.error.flatten().fieldErrors[field]?.[0];
      setErrors((prev) => ({ ...prev, [field]: fieldError ?? "" }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = signUpSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error ?? "Registration failed. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-3">
        <div className="text-5xl">📬</div>
        <h2 className="text-xl font-semibold text-[var(--md-sys-color-on-surface)]">Check your inbox</h2>
        <p className="text-sm text-[var(--md-sys-color-outline)]">
          We sent a verification link to <strong>{values.email}</strong>. It expires in 15 minutes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && <Alert variant="error">{serverError}</Alert>}

      <Input
        label="Full name"
        type="text"
        autoComplete="name"
        value={values.name}
        onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        onBlur={(e) => validateField("name", e.target.value)}
        error={errors.name}
      />
      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        onBlur={(e) => validateField("email", e.target.value)}
        error={errors.email}
      />
      <div>
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          onBlur={(e) => validateField("password", e.target.value)}
          error={errors.password}
        />
        <PasswordStrength password={values.password} />
      </div>
      <Input
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={(e) => setValues((v) => ({ ...v, confirmPassword: e.target.value }))}
        onBlur={(e) => validateField("confirmPassword", e.target.value)}
        error={errors.confirmPassword}
      />

      <Button type="submit" loading={loading} className="w-full mt-2">
        Create account
      </Button>

      <p className="text-center text-sm text-[var(--md-sys-color-outline)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--md-sys-color-primary)] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
