"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import type { AuthView } from "./AuthCard";

interface Props { onSwitch: (view: AuthView) => void }

type Fields = { name: string; email: string; password: string; confirmPassword: string };
type Errors = Partial<Fields>;

const PASSWORD_REQS = [
  { label: "At least 8 characters",  met: (p: string) => p.length >= 8 },
  { label: "Uppercase letter",        met: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter",        met: (p: string) => /[a-z]/.test(p) },
  { label: "Number",                  met: (p: string) => /[0-9]/.test(p) },
];

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name)              e.name = "Name is required";
  else if (f.name.length < 2) e.name = "Name must be at least 2 characters";

  if (!f.email)             e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email address";

  if (!f.password)          e.password = "Password is required";
  else if (f.password.length < 8) e.password = "Password must be at least 8 characters";
  else if (!/[A-Z]/.test(f.password)) e.password = "Password needs an uppercase letter";
  else if (!/[a-z]/.test(f.password)) e.password = "Password needs a lowercase letter";
  else if (!/[0-9]/.test(f.password)) e.password = "Password needs a number";

  if (!f.confirmPassword)   e.confirmPassword = "Please confirm your password";
  else if (f.password !== f.confirmPassword) e.confirmPassword = "Passwords do not match";

  return e;
}

export function SignUpForm({ onSwitch }: Props) {
  const firstRef = useRef<HTMLInputElement>(null);
  const [values,  setValues]  = useState<Fields>({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors,  setErrors]  = useState<Errors>({});
  const [touched, setTouched] = useState<Set<keyof Fields>>(new Set());
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { firstRef.current?.focus(); }, []);

  function touch(field: keyof Fields) {
    setTouched((prev) => {
      const next = new Set(prev).add(field);
      setErrors(validate(values));
      return next;
    });
  }

  function change(field: keyof Fields, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched.has(field)) setErrors(validate(next));
  }

  function err(field: keyof Fields) {
    return touched.has(field) ? errors[field] : undefined;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouched(new Set(["name", "email", "password", "confirmPassword"]));
      return;
    }

    setLoading(true);
    setServerError("");
    try {
      const res  = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.error ?? "Registration failed. Please try again."); return; }
      setSuccess(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="text-5xl">📬</div>
        <div>
          <p className="font-medium text-[var(--md-sys-color-on-surface)]">Check your inbox</p>
          <p className="mt-1 text-sm text-[var(--md-sys-color-outline)]">
            We sent a verification link to <strong>{values.email}</strong>. It expires in 15 minutes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSwitch("login")}
          className="text-sm text-[var(--md-sys-color-primary)] font-medium hover:underline focus:outline-none"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && <Alert variant="error">{serverError}</Alert>}

      <Input
        ref={firstRef}
        label="Full name"
        type="text"
        autoComplete="name"
        value={values.name}
        onChange={(e) => change("name", e.target.value)}
        onBlur={() => touch("name")}
        error={err("name")}
      />
      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(e) => change("email", e.target.value)}
        onBlur={() => touch("email")}
        error={err("email")}
      />

      <div className="space-y-1">
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={(e) => change("password", e.target.value)}
          onBlur={() => touch("password")}
          error={err("password")}
        />
        <PasswordStrength password={values.password} />

        {/* Requirements checklist — shows when password field has value */}
        {values.password && (
          <ul className="mt-2 space-y-1" aria-label="Password requirements">
            {PASSWORD_REQS.map((req) => {
              const ok = req.met(values.password);
              return (
                <li key={req.label} className={`flex items-center gap-1.5 text-xs transition-colors ${ok ? "text-[var(--color-role-strength-strong)]" : "text-[var(--md-sys-color-outline)]"}`}>
                  <svg viewBox="0 0 12 12" fill="currentColor" className="h-3 w-3 shrink-0" aria-hidden="true">
                    {ok ? (
                      <path fillRule="evenodd" d="M10.03 2.47a.75.75 0 010 1.06L4.5 9.06 1.97 6.53a.75.75 0 011.06-1.06L4.5 6.94l4.47-4.47a.75.75 0 011.06 0z" clipRule="evenodd" />
                    ) : (
                      <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    )}
                  </svg>
                  {req.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Input
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={(e) => change("confirmPassword", e.target.value)}
        onBlur={() => touch("confirmPassword")}
        error={err("confirmPassword")}
      />

      <Button type="submit" loading={loading} className="w-full mt-2">Create account</Button>

      <p className="text-center text-sm text-[var(--md-sys-color-outline)]">
        Already have an account?{" "}
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
