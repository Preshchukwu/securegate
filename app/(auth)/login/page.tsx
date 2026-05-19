import { AuthCard } from "@/components/auth/AuthCard";

export const metadata = { title: "Sign in — SecureGate" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const { reset } = await searchParams;

  return <AuthCard initialView="login" resetSuccess={reset === "success"} />;
}
