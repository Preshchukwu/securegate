"use client";

import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { AuthView } from "./AuthCard";

interface Props {
  onSwitch: (view: AuthView) => void;
  resetSuccess?: boolean;
}

type Fields = { email: string; password: string };
type Errors = Partial<Fields>;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.email)                               e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email address";
  if (!f.password)                            e.password = "Password is required";
  return e;
}

export function LoginForm({ onSwitch, resetSuccess }: Props) {
  const router = useRouter();
  const firstRef = useRef<HTMLInputElement>(null);
  const [values,  setValues]  = useState<Fields>({ email: "", password: "" });
  const [errors,  setErrors]  = useState<Errors>({});
  const [touched, setTouched] = useState<Set<keyof Fields>>(new Set());
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setTouched(new Set(["email", "password"]));
      return;
    }

    setLoading(true);
    setServerError("");
    try {
      const result = await signIn("credentials", { ...values, redirect: false });
      if (result?.error) { setServerError("Invalid email or password."); return; }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {resetSuccess && <Alert variant="success">Password updated — sign in with your new password.</Alert>}
      {serverError  && <Alert variant="error">{serverError}</Alert>}

      <Input
        ref={firstRef}
        label="Email address"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(e) => change("email", e.target.value)}
        onBlur={() => touch("email")}
        error={err("email")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        value={values.password}
        onChange={(e) => change("password", e.target.value)}
        onBlur={() => touch("password")}
        error={err("password")}
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSwitch("forgot")}
          className="text-sm text-[var(--md-sys-color-primary)] hover:underline focus:outline-none"
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" loading={loading} className="w-full">Sign in</Button>

      <p className="text-center text-sm text-[var(--md-sys-color-outline)]">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => onSwitch("signup")}
          className="text-[var(--md-sys-color-primary)] font-medium hover:underline focus:outline-none"
        >
          Create one
        </button>
      </p>
    </form>
  );
}
