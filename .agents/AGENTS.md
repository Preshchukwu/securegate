# SecureGate — Agent Context

This file is the entry point for any AI agent or coding assistant working on this project.
Read this file first, then load the rule files referenced below before writing any code.

---

## What This Project Is

SecureGate is a focused authentication and security web application.  
It is not a general-purpose app — every feature exists to demonstrate a correctly implemented auth layer.

Stack: **Next.js 14 (App Router) · TypeScript · Prisma · PostgreSQL · NextAuth · Resend · Vercel**

---

## Rule Files — Load These Before Acting

| File | Governs |
|------|---------|
| [rules/architecture.md](./rules/architecture.md) | Folder structure, data models, API routes, component conventions |
| [rules/security.md](./rules/security.md) | Security constraints, forbidden patterns, token handling, error messaging |

If a task touches auth logic, passwords, tokens, or email flows — **read security.md first**.  
If a task touches file placement, routing, schema, or component structure — **read architecture.md first**.

---

## Design System

All colors, typography, and spacing are defined in `tokens.css` at the project root.  
Never hardcode hex values, font sizes, or spacing numbers in component files.  
Color roles only — no primitive palette values in component styles.  
See [../colorstyle.md](../colorstyle.md) and [../designsystem.md](../designsystem.md) for reference.

---

## Build Phases (Ordered — Do Not Skip)

| Phase | Goal | Key Output |
|-------|------|------------|
| 1 | Scaffold & Database Schema | Prisma schema, migrations, GitHub push |
| 2 | Authentication Core | NextAuth Credentials, bcrypt, Zod, session |
| 3 | Email Verification | Resend, token generation, `/verify-email/[token]` |
| 4 | Forgot Password Flow | Reset tokens, `/reset-password/[token]` |
| 5 | Rate Limiting & Security Hardening | Upstash/custom middleware, security headers |
| 6 | UI Polish & Deployment | Accessible forms, strength indicator, Vercel |

Complete each phase fully before starting the next.  
A broken phase built on a shaky foundation is worse than a solid earlier phase alone.

---

## Environment Variables

Never hardcode these. Never commit `.env.local`. Always read from `process.env`.

```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
RESEND_API_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

---

## Session Strategy

**JWT sessions** — chosen because:
- No additional DB table required for sessions (fewer moving parts)
- Works seamlessly with Vercel's serverless edge functions
- NextAuth handles signing/verification with `NEXTAUTH_SECRET`
- Session contains: `{ id, email, name, emailVerified }`

---

## Key Constraints (Summary)

- Passwords: `bcrypt.hash(password, 12)` — no exceptions on salt rounds
- Tokens: `crypto.randomBytes(32).toString('hex')` — no UUID, no Math.random
- Error messages: never confirm whether an email exists in the system
- Dashboard: requires both `session` AND `emailVerified !== null`
- `.env.local`: must be in `.gitignore` before first push

---

## Testing Checklist (Manual, per Phase)

- [ ] Sign up → password is hashed in DB (not plain text)
- [ ] Sign in → session cookie created, redirects to dashboard
- [ ] Visit `/dashboard` unauthenticated → redirected to `/login`
- [ ] Visit `/dashboard` authenticated but unverified → redirected to `/verify-email`
- [ ] Click verification link → account marked verified, dashboard accessible
- [ ] Click expired verification link → error shown, resend option present
- [ ] Forgot password with unknown email → same success message as known email
- [ ] 6 failed logins from same IP → 429 response with retry hint
- [ ] All form fields: submit with empty values → specific inline error per field
