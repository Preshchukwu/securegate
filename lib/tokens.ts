import crypto from "crypto";

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function isTokenExpired(expires: Date): boolean {
  return expires < new Date();
}
