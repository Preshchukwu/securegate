# SecureGate — Implementation Plan

Follow phases in strict order. Do not start Phase N+1 until every checkbox in Phase N is ticked.
Each phase ends with a verification gate — the listed checks must pass before moving on.

---

## Phase 1 — Scaffold & Database Schema

**Goal:** A running Next.js project connected to PostgreSQL with all three Prisma models migrated and pushed to GitHub.

### 1.1 Bootstrap the project
- [ ] Run `npx create-next-app@latest securegate --typescript --tailwind --eslint --app --src-dir no --import-alias "@/*"`
- [ ] Confirm folder structure matches the App Router layout in `architecture.md`
- [ ] Delete the default `app/page.tsx` content — replace with a redirect to `/login`
- [ ] Delete unused Next.js boilerplate (default globals, placeholder images)

### 1.2 Install core dependencies
- [ ] `npm install prisma @prisma/client`
- [ ] `npm install next-auth bcryptjs`
- [ ] `npm install @types/bcryptjs --save-dev`
- [ ] `npm install zod`
- [ ] `npm install resend @react-email/components`
- [ ] `npm install @upstash/ratelimit @upstash/redis`

### 1.3 Set up environment variables
- [ ] Create `.env.local` at project root with all required keys (see `AGENTS.md`)
- [ ] Verify `.gitignore` includes `.env`, `.env.local`, `.env.*.local` — confirm before any commit
- [ ] Set `DATABASE_URL` to your local or hosted PostgreSQL connection string

### 1.4 Initialise Prisma
- [ ] Run `npx prisma init`
- [ ] Set `provider = "postgresql"` in `prisma/schema.prisma`
- [ ] Confirm `DATABASE_URL` in `.env.local` is picked up correctly

### 1.5 Define the schema
Add all three models to `prisma/schema.prisma`:

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
}

model VerificationToken {
  identifier String   @unique
  token      String   @unique
  expires    DateTime

  @@index([token])
}

model PasswordResetToken {
  id      String   @id @default(cuid())
  email   String
  token   String   @unique
  expires DateTime

  @@index([token])
  @@index([email])
}
```

### 1.6 Run migration
- [ ] `npx prisma migrate dev --name init`
- [ ] Open your DB client (TablePlus, pgAdmin, Prisma Studio) — confirm all three tables exist
- [ ] Run `npx prisma studio` and verify the schema visually

### 1.7 Create Prisma singleton
- [ ] Create `lib/db.ts` with the singleton pattern from `architecture.md`
- [ ] Import `db` once in a test file, confirm TypeScript resolves without errors

### 1.8 Commit and push to GitHub
- [ ] `git init`
- [ ] `git add .` — visually verify `.env.local` is NOT staged
- [ ] First commit: `"Phase 1: scaffold, schema, initial migration"`
- [ ] Push to GitHub remote (create repo if needed)
- [ ] Confirm `.env.local` is absent from the GitHub repo

**Phase 1 Gate — do not proceed until:**
- [ ] `npm run dev` runs without errors
- [ ] All three DB tables exist and match the schema
- [ ] Code is on GitHub, `.env.local` is absent from the repo

---

## Phase 2 — Authentication Core with NextAuth

**Goal:** Users can sign up and log in. Sessions are created. Passwords are hashed. Dashboard is protected.

### 2.1 Create Zod validation schemas
- [ ] Create `lib/validations.ts`
- [ ] Add `signUpSchema`, `loginSchema` (see `architecture.md`)
- [ ] Export both — they will be shared between API routes and client forms

### 2.2 Configure NextAuth
- [ ] Create `lib/auth.ts` with `authOptions` (Credentials provider, JWT strategy)
- [ ] Implement `authorize()`:
  - Query user by email
  - Run `bcrypt.compare` against stored hash
  - Use dummy hash compare when user not found (timing attack mitigation — see `security.md`)
  - Return `null` on failure — never throw with an email-leaking message
- [ ] Add `jwt` and `session` callbacks to attach `id` and `emailVerified` to the token/session
- [ ] Set `pages.signIn = '/login'`
- [ ] Create `app/api/auth/[...nextauth]/route.ts` — export GET and POST handlers

### 2.3 Extend NextAuth types
- [ ] Create `types/next-auth.d.ts`
- [ ] Augment `Session` and `JWT` with `id: string` and `emailVerified: Date | null`

### 2.4 Build the Sign Up API route
- [ ] Create `app/api/register/route.ts`
- [ ] Parse and validate body with `signUpSchema.safeParse()`
- [ ] Check if email is already in use — return a generic "Registration failed" (do not confirm email exists)
- [ ] Hash password: `bcrypt.hash(password, 12)`
- [ ] `db.user.create(...)` with hashed password
- [ ] Return `201` on success — do NOT auto-sign-in, direct user to check email

### 2.5 Build the Sign Up page
- [ ] Create `app/(auth)/signup/page.tsx`
- [ ] Form fields: Full Name, Email, Password, Confirm Password
- [ ] Client-side Zod validation on blur
- [ ] Password strength indicator component (`components/ui/PasswordStrength.tsx`)
  - Weak: length < 8 or only one character type
  - Fair: length ≥ 8, two character types
  - Strong: length ≥ 12, three+ character types (uppercase, lowercase, number, symbol)
- [ ] Loading state on submit button
- [ ] On success: show "Check your inbox" message, do not redirect to dashboard

### 2.6 Build the Login page
- [ ] Create `app/(auth)/login/page.tsx`
- [ ] Form fields: Email, Password
- [ ] Call `signIn('credentials', { email, password, redirect: false })`
- [ ] On error: display "Invalid email or password" — no specifics
- [ ] On success: `router.push('/dashboard')`
- [ ] Loading state on submit button

### 2.7 Protect the dashboard with middleware
- [ ] Create `middleware.ts` at project root
- [ ] Export `default` from `next-auth/middleware`
- [ ] Set `config.matcher` to `['/dashboard/:path*']`

### 2.8 Create the dashboard (stub)
- [ ] Create `app/(protected)/dashboard/page.tsx`
- [ ] Server component — call `getServerSession(authOptions)`
- [ ] If no session → `redirect('/login')`
- [ ] If `!session.user.emailVerified` → `redirect('/verify-email')` (placeholder, full flow in Phase 3)
- [ ] Display user's name and email
- [ ] Logout button that calls `signOut({ callbackUrl: '/login' })`

### 2.9 Manual verification
- [ ] Sign up with a new email → record created in DB
- [ ] Inspect `password` field in DB — confirm it starts with `$2b$12$` (bcrypt hash)
- [ ] Sign in with the new credentials → session cookie set, redirected to dashboard stub
- [ ] Visit `/dashboard` in incognito (no session) → redirected to `/login`

**Phase 2 Gate — do not proceed until:**
- [ ] New user in DB has a bcrypt hash, not plain text
- [ ] Login creates a session and reaches the dashboard stub
- [ ] Unauthenticated visit to `/dashboard` redirects to `/login`
- [ ] Login error message does not specify whether email or password was wrong

---

## Phase 3 — Email Verification Flow

**Goal:** New users receive a verification email. Only verified users can access the dashboard.

### 3.1 Token helpers
- [ ] Create `lib/tokens.ts`
- [ ] `generateToken()` — `crypto.randomBytes(32).toString('hex')`
- [ ] `isTokenExpired(expires: Date)` — `expires < new Date()`

### 3.2 React Email templates
- [ ] Create `emails/VerificationEmail.tsx`
  - Props: `{ name: string, verifyUrl: string }`
  - Clean, minimal layout using React Email components
  - CTA button links to `verifyUrl`
  - Include expiry notice: "This link expires in 15 minutes"

### 3.3 Email helper
- [ ] Create `lib/email.ts`
- [ ] `sendVerificationEmail(email: string, token: string)`:
  - Build URL: `${process.env.NEXTAUTH_URL}/verify-email/${token}`
  - Send via Resend using the `VerificationEmail` template
  - Log errors server-side, do not surface to client

### 3.4 Wire verification into Sign Up
- [ ] Update `app/api/register/route.ts`
- [ ] After user creation: `generateToken()` → upsert `VerificationToken` (15-min expiry) → `sendVerificationEmail()`
- [ ] Do this inside a try/catch — if email fails, still return success (user was created; they can request resend)

### 3.5 Build the verify-email route
- [ ] Create `app/api/verify-email/route.ts` (POST — for resend requests)
- [ ] Create `app/(auth)/verify-email/[token]/page.tsx`
  - Server component
  - Look up token by param
  - If not found or expired: show error UI with "Resend verification email" option
  - If valid: `db.user.update({ emailVerified: new Date() })` → delete token → show success → link to `/login`

### 3.6 Build the resend page/action
- [ ] Create `app/(auth)/verify-email/page.tsx` (without token — "check your email" landing)
- [ ] Include a form to resend: accepts email, calls `POST /api/verify-email`
- [ ] Route handler: look up user, generate new token (upsert), send email again
- [ ] Always return success message regardless of whether email is in the system

### 3.7 Harden the dashboard guard
- [ ] Update `app/(protected)/dashboard/page.tsx`
- [ ] Check `session.user.emailVerified` — if null, redirect to `/verify-email`
- [ ] This is the definitive check — middleware handles auth, dashboard handles email verification

### 3.8 Manual verification
- [ ] Sign up → check inbox → click verification link → account marked verified
- [ ] Attempt to reach dashboard before verifying → redirected to `/verify-email`
- [ ] Use an expired token (manipulate DB TTL) → error shown with resend option
- [ ] Verify the token row is deleted from `VerificationToken` after successful verification

**Phase 3 Gate — do not proceed until:**
- [ ] Verification email arrives and link works end to end
- [ ] Unverified user cannot reach dashboard
- [ ] Expired/invalid token shows error + resend option
- [ ] Token deleted from DB after use

---

## Phase 4 — Forgot Password Flow

**Goal:** Users can reset a forgotten password via an emailed token. Token expires after 1 hour.

### 4.1 React Email template
- [ ] Create `emails/PasswordResetEmail.tsx`
  - Props: `{ name: string, resetUrl: string }`
  - CTA button links to `resetUrl`
  - "This link expires in 1 hour"
  - Security note: "If you did not request this, ignore this email"

### 4.2 Email helper
- [ ] Add `sendPasswordResetEmail(email: string, token: string)` to `lib/email.ts`
  - URL: `${process.env.NEXTAUTH_URL}/reset-password/${token}`

### 4.3 Forgot password API route
- [ ] Create `app/api/forgot-password/route.ts`
- [ ] Validate email with Zod
- [ ] Look up user — regardless of result, **always return the same success message**
- [ ] If user exists: `generateToken()` → upsert `PasswordResetToken` (1-hour expiry) → send email
- [ ] Return: `{ success: true, message: 'If an account exists, a reset link has been sent' }`
- [ ] Rate limit this endpoint (3 requests / IP / 15 min)

### 4.4 Build the forgot password page
- [ ] Create `app/(auth)/forgot-password/page.tsx`
- [ ] Single email input field
- [ ] On submit: call `POST /api/forgot-password`
- [ ] Replace form with success message — same message always, no variation based on result
- [ ] Loading state on submit button

### 4.5 Reset password API route
- [ ] Create `app/api/reset-password/route.ts`
- [ ] Validate body: `{ token: string, password: string }` with Zod
- [ ] Look up token in `PasswordResetToken`
- [ ] If not found or expired: return `400` with "Invalid or expired link"
- [ ] Hash new password: `bcrypt.hash(password, 12)`
- [ ] `db.user.update({ password: hashed })` for the matching email
- [ ] Delete the token: `db.passwordResetToken.delete({ where: { token } })`
- [ ] Return success and redirect user to `/login`

### 4.6 Build the reset password page
- [ ] Create `app/(auth)/reset-password/[token]/page.tsx`
- [ ] Server component — pre-validate token on load
  - If invalid/expired: show error UI immediately (do not show the form)
- [ ] Form: New password + Confirm password
- [ ] Password strength indicator (same component as sign up)
- [ ] On submit: call `POST /api/reset-password` with token + new password
- [ ] On success: redirect to `/login` with a "Password updated" toast/message

### 4.7 Manual verification
- [ ] Request reset for a real email → email arrives → link works → password changed → old password rejected
- [ ] Request reset for a fake email → same success message in UI, no email sent
- [ ] Use an expired reset token (manipulate DB) → error shown, no password change
- [ ] Confirm token row deleted from `PasswordResetToken` after use
- [ ] Confirm new password in DB is a bcrypt hash

**Phase 4 Gate — do not proceed until:**
- [ ] Full reset flow works end to end
- [ ] Unknown email returns identical response to known email
- [ ] Expired/invalid token shows error (no form rendered)
- [ ] Token deleted after use, old password no longer works

---

## Phase 5 — Rate Limiting & Security Hardening

**Goal:** Brute-force protection on critical endpoints. All error messages audited. Security headers set.

### 5.1 Set up Upstash Redis
- [ ] Create a Redis database in the Upstash console
- [ ] Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to `.env.local`
- [ ] Verify connection: `Redis.fromEnv()` resolves without error

### 5.2 Rate limit middleware helper
- [ ] Create `lib/rate-limit.ts`
- [ ] Export two pre-configured limiters:
  - `loginLimiter` — 5 requests / IP / 10 minutes (sliding window)
  - `forgotPasswordLimiter` — 3 requests / IP / 15 minutes (sliding window)
- [ ] Shared helper: `getRateLimitResponse(reset: number)` — returns a `429 Response`

### 5.3 Apply rate limiting
- [ ] Apply `loginLimiter` inside the NextAuth `authorize()` function OR in a custom wrapper around the `[...nextauth]` route for `POST` + `credentials` provider
- [ ] Apply `forgotPasswordLimiter` at the top of `app/api/forgot-password/route.ts`
- [ ] Both must extract IP from `x-forwarded-for` header (Vercel sets this)

### 5.4 Audit all API error messages
Walk every route handler and confirm:
- [ ] `POST /api/register` — does not confirm whether email already exists
- [ ] `POST /api/auth/[...nextauth]` — login error is "Invalid email or password" only
- [ ] `POST /api/forgot-password` — always returns success message
- [ ] `GET/POST /api/verify-email` — "Invalid or expired link" for bad tokens
- [ ] `POST /api/reset-password` — "Invalid or expired link" for bad tokens
- [ ] No route returns a stack trace, Prisma error, or internal message

### 5.5 Add HTTP security headers
- [ ] Update `next.config.js` with the `headers()` async function
- [ ] Apply to `source: '/(.*)'` (all routes):
  ```
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-DNS-Prefetch-Control: on
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  ```
- [ ] Verify headers appear in browser DevTools → Network tab → Response Headers

### 5.6 Self-test attack scenarios
Document the result of each test in a comment block or separate notes file:
- [ ] Submit login form with wrong password 6 times → 429 received on attempt 6
- [ ] Submit forgot-password with an email not in DB → success message shown
- [ ] Paste an expired verification token URL → error shown, resend option present
- [ ] Paste an expired reset token URL → error shown, form not rendered
- [ ] Submit sign-up with empty fields → per-field validation errors shown
- [ ] Submit sign-up with a weak password → strength indicator shows "Weak", submit blocked
- [ ] Visit `/dashboard` with no cookies → redirect to `/login`
- [ ] Visit `/dashboard` with a session but unverified email → redirect to `/verify-email`

**Phase 5 Gate — do not proceed until:**
- [ ] Login rate limit triggers at attempt 6 with a `429` response
- [ ] Forgot-password rate limit triggers correctly
- [ ] Security headers present in all response headers
- [ ] All error messages pass the no-enumeration audit

---

## Phase 6 — UI Polish & Deployment

**Goal:** Production-quality UI across all pages. Deployed to Vercel. Final GitHub push clean.

### 6.1 Apply the design system
- [ ] Import `tokens.css` in `app/globals.css`
- [ ] Set `font-family: var(--font-family-base)` on `body` in globals
- [ ] Set `background-color: var(--md-sys-color-background)` and `color: var(--md-sys-color-on-background)` on `body`
- [ ] Verify Inter loads (Network tab → Font requests)

### 6.2 Build primitive UI components
- [ ] `components/ui/Button.tsx` — variants: primary, secondary, ghost; loading state with spinner
- [ ] `components/ui/Input.tsx` — label, helper text, error state, focus ring using `--md-sys-color-primary`
- [ ] `components/ui/FormField.tsx` — wraps Input with label + error message wired to `aria-describedby`
- [ ] `components/ui/Alert.tsx` — variants: error, success, warning using color roles
- [ ] `components/ui/PasswordStrength.tsx` — 3-segment bar, label, uses `--color-role-strength-*` tokens

### 6.3 Polish every auth page
For each page, verify:
- [ ] Auth card: max-width 440px, centered, `--elevation-1`, `--radius-lg`, `--md-sys-color-surface` background
- [ ] All form fields have visible `<label>` — no placeholder-only patterns
- [ ] Error messages are specific: "Email is required", "Password must be at least 8 characters" — not "Something went wrong"
- [ ] Every submit button has a loading state (spinner, `aria-busy="true"`, disabled)
- [ ] Links between pages work: login ↔ signup, login → forgot-password

Pages to polish:
- [ ] `/signup`
- [ ] `/login`
- [ ] `/verify-email` (check-your-inbox + resend form)
- [ ] `/verify-email/[token]` (success / error states)
- [ ] `/forgot-password`
- [ ] `/reset-password/[token]`
- [ ] `/dashboard`

### 6.4 Dark mode
- [ ] Add theme toggle to dashboard (and optionally the auth card header)
- [ ] Toggle sets `data-theme="dark"` on `<html>` element and persists to `localStorage`
- [ ] On load, read `localStorage` preference before rendering (prevent flash)
- [ ] Verify all color roles swap correctly in dark mode

### 6.5 Responsive check
- [ ] Auth card: full width with horizontal padding on mobile, max 440px on tablet+
- [ ] All text sizes scale with `clamp()` — verify no text overflows at 320px viewport width
- [ ] Tap targets meet 44×44px minimum on mobile

### 6.6 Accessibility pass
- [ ] Tab through every form — focus order is logical
- [ ] Error messages announced via `role="alert"` or `aria-live="polite"`
- [ ] Password strength announced to screen readers (not color only)
- [ ] All interactive elements have visible focus rings

### 6.7 Deploy to Vercel
- [ ] Push final code to GitHub
- [ ] Import repo in Vercel dashboard
- [ ] Add all environment variables in Vercel dashboard (not hardcoded):
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL` (set to `https://your-app.vercel.app`)
  - `RESEND_API_KEY`
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
- [ ] Trigger first deployment — watch build logs for errors
- [ ] Run Prisma migration against production DB: `npx prisma migrate deploy`

### 6.8 End-to-end test on live URL
- [ ] Full sign-up → verify email → login → dashboard → logout flow
- [ ] Forgot password → reset email → new password → login with new password
- [ ] Trigger rate limit on live URL
- [ ] Check all security headers on live URL (use securityheaders.com)
- [ ] Confirm `.env.local` is absent from the GitHub repo

### 6.9 Final cleanup
- [ ] Remove all `console.log` debug statements (keep intentional `console.error` for server-side logging)
- [ ] Run `npm run build` locally — zero TypeScript errors, zero ESLint errors
- [ ] Record the live Vercel URL for submission

**Phase 6 Gate — project complete when:**
- [ ] Live URL is accessible and all flows work end to end
- [ ] Zero TypeScript and ESLint errors on `npm run build`
- [ ] Security headers verified on live URL
- [ ] `.env.local` absent from GitHub
- [ ] Vercel URL recorded and ready to submit

---

## Dependency Reference

```bash
# Core
npx create-next-app@latest securegate --typescript --tailwind --eslint --app

# Auth + DB
npm install prisma @prisma/client next-auth bcryptjs
npm install --save-dev @types/bcryptjs

# Validation
npm install zod

# Email
npm install resend @react-email/components

# Rate limiting
npm install @upstash/ratelimit @upstash/redis
```

---

## Phase Completion Summary

| Phase | Goal | Gate condition |
|-------|------|----------------|
| 1 | Scaffold & Schema | DB tables exist, code on GitHub |
| 2 | Auth Core | Hashed passwords, sessions, protected route |
| 3 | Email Verification | Verified-only dashboard access |
| 4 | Forgot Password | Full reset flow, no email enumeration |
| 5 | Rate Limiting & Hardening | 429s firing, headers set, messages audited |
| 6 | UI Polish & Deployment | Live Vercel URL, clean repo, all flows tested |
