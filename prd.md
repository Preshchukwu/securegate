# SecureGate — Product Requirements Document

## Overview

SecureGate is a production-grade authentication and security application. Its primary purpose is to demonstrate and implement every layer of a secure auth system: account creation, email verification, session management, password recovery, and brute-force protection. The product must instill confidence in users through its visual design — a trustworthy, focused, and calm interface that communicates security without being cold or intimidating.

---

## Goals

| Goal | Description |
|------|-------------|
| Security-first | Every auth flow follows security best practices — no email enumeration, hashed passwords, expiring tokens |
| Clarity | Error messages are specific and helpful without leaking internal state |
| Accessibility | WCAG 2.1 AA compliance — all forms are keyboard navigable, screen-reader friendly |
| Performance | Auth pages load fast; no unnecessary bundles on login/signup |
| Trustworthiness | Design signals safety: consistent, professional, no dark patterns |

---

## Users

**Primary user:** A developer or security-conscious end user creating an account and verifying their identity.  
**Secondary user:** A returning user managing their session, resetting a forgotten password.

---

## Feature Requirements

### F-01 Sign Up
- Fields: Full name, email address, password, confirm password
- Real-time Zod validation on blur
- Password strength indicator (weak / fair / strong)
- Submit triggers: Zod server validation → bcrypt hash (12 rounds) → DB write → send verification email
- Post-submit: show "Check your inbox" screen, not the dashboard

### F-02 Login
- Fields: Email, password
- NextAuth Credentials provider
- Error messages must not reveal whether the email exists
- Rate limiting: max 5 attempts per IP per 10 minutes
- Session created on success; redirect to `/dashboard`

### F-03 Email Verification
- Token generated with `crypto.randomBytes(32)`, stored with 15-min TTL
- Email sent via Resend with clickable link
- `/verify-email/[token]` validates, marks user verified, deletes token
- Expired or invalid token shows error with resend option
- Unverified users cannot access the dashboard

### F-04 Protected Dashboard
- Only authenticated + verified users may access
- Middleware redirects unverified → `/verify-email`, unauthenticated → `/login`
- Shows basic user info and logout button

### F-05 Forgot Password
- `/forgot-password` page accepts email
- Always returns success message — no email existence confirmation
- Reset token generated, stored with 1-hour TTL
- `/reset-password/[token]` validates token, accepts new password, hashes, saves, deletes token

### F-06 Rate Limiting
- Applied to `POST /api/auth/signin` and `/api/auth/forgot-password`
- Response: `429 Too Many Requests` with retry-after hint

### F-07 Logout
- Destroys session via NextAuth `signOut()`
- Redirect to `/login`

---

## Non-Functional Requirements

- All secrets in `.env.local`, never committed
- HTTP security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
- No stack traces in API responses
- Prisma migrations tracked in version control
- Deployed to Vercel with env vars set in dashboard

---

## Design Rationale

### Visual Direction
Security applications live or die by trust. The design must avoid two failure modes:
1. **Too clinical** — cold, uninviting interfaces make users anxious and more likely to abandon flows
2. **Too playful** — casual aesthetics undermine the perception of security

SecureGate lands between these: **calm authority**. Deep blue primary communicates reliability. Teal tertiary signals verified/success states. Clean white surfaces and generous whitespace signal focus and transparency. The app feels like a tool built by engineers who care.

### Design System
- **Spec:** Material Design 3 (M3) — chosen for its mature token system, role-based color architecture, and accessible defaults
- **Typography:** Inter — purpose-built for UI screens, highly legible at small sizes (form labels, error text), widely supported
- **Color:** Blue-based primary palette with tonal surface hierarchy. Light + dark mode supported from day one via CSS custom properties

### Component Principles
- Every form field has a visible label (no placeholder-only patterns)
- Error states use color + icon + text (never color alone)
- Loading states are mandatory — no double-submit vulnerabilities in the UI
- Focus rings are visible and high-contrast

---

## Pages & Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing / redirect to login |
| `/signup` | Public (unauth only) | Registration form |
| `/login` | Public (unauth only) | Login form |
| `/verify-email/[token]` | Public | Email verification handler |
| `/forgot-password` | Public | Password reset request |
| `/reset-password/[token]` | Public | New password form |
| `/dashboard` | Protected (auth + verified) | User dashboard |

---

## Success Criteria

- [ ] Sign up → email received → verification link works → dashboard accessible
- [ ] Login with wrong password 6× triggers rate limit response
- [ ] Forgot password with unknown email returns same success message as known email
- [ ] Expired verification/reset token shows clear error with recovery option
- [ ] Dashboard unreachable without valid session
- [ ] No plain-text passwords in database
- [ ] `.env.local` absent from git history
- [ ] Live Vercel URL functional end to end
