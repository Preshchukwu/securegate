# SecureGate — Security Rules

These rules are non-negotiable. Every agent, every PR, every code review must verify compliance.
When in doubt, err on the side of revealing less and protecting more.

---

## Cardinal Rules

1. **Never expose whether an email address exists in the system**
2. **Never log or return a password in any form**
3. **Never commit secrets to version control**
4. **Never skip token expiry checks**
5. **Never trust client-supplied data without server-side validation**

---

## Password Handling

### Hashing
```ts
// Always use bcrypt with salt rounds of exactly 12
import bcrypt from 'bcryptjs'

const hashed = await bcrypt.hash(password, 12)
```

- Salt rounds: **12** — do not lower this for performance; do not raise above 14
- Never use `md5`, `sha1`, `sha256`, or any non-adaptive hash for passwords
- Never store plain text, base64, or reversibly encoded passwords

### Comparison
```ts
const valid = await bcrypt.compare(candidatePassword, storedHash)
```

- Always use `bcrypt.compare` — never compare hashes directly with `===`
- A failed comparison must return the same response shape and timing as a missing user

### Timing attack mitigation
When a user is not found, still run a dummy bcrypt comparison to prevent timing-based user enumeration:

```ts
const user = await db.user.findUnique({ where: { email } })
const dummyHash = '$2b$12$invalidhashfortimingprotectiononly'

const passwordValid = user
  ? await bcrypt.compare(password, user.password)
  : await bcrypt.compare(password, dummyHash)

if (!user || !passwordValid) {
  return null // NextAuth authorize returns null on failure
}
```

---

## Token Generation

```ts
import crypto from 'crypto'

// Always use this pattern — no UUID, no Math.random, no nanoid
const token = crypto.randomBytes(32).toString('hex') // 64-char hex string
```

### Verification Token (email confirmation)
- TTL: **15 minutes** — `new Date(Date.now() + 15 * 60 * 1000)`
- Stored in `VerificationToken` table
- Deleted immediately after successful verification
- One token per user — upsert, not insert (prevent token accumulation)

### Password Reset Token
- TTL: **1 hour** — `new Date(Date.now() + 60 * 60 * 1000)`
- Stored in `PasswordResetToken` table
- Deleted immediately after password is changed
- One token per email — upsert, not insert

### Token lookup
```ts
// Always check both existence AND expiry
const token = await db.verificationToken.findUnique({ where: { token: rawToken } })

if (!token || token.expires < new Date()) {
  // Treat missing and expired the same — no information leakage
  return Response.json({ success: false, error: 'Invalid or expired link' }, { status: 400 })
}
```

---

## Error Messaging Rules

### Email enumeration — FORBIDDEN patterns
These responses reveal whether an email exists. Never use them:

```
❌ "No account found with that email"
❌ "This email is already registered"
❌ "Incorrect password for this account"
❌ "Email not found"
```

### Required neutral responses

| Endpoint | Required message (regardless of email existence) |
|----------|--------------------------------------------------|
| `POST /api/auth/signin` | "Invalid email or password" |
| `POST /api/forgot-password` | "If an account exists, a reset link has been sent" |
| `POST /api/register` | Show success (but email confirmation required before dashboard access) |
| `GET /verify-email/[token]` | "Invalid or expired link" (for both missing and expired) |
| `GET /reset-password/[token]` | "Invalid or expired link" (for both missing and expired) |

### Server errors
Never expose internal error details:

```ts
// ❌ Wrong
return Response.json({ error: error.message }, { status: 500 })

// ✅ Right
console.error('[route-name]', error) // server-side only
return Response.json({ success: false, error: 'Something went wrong' }, { status: 500 })
```

---

## Rate Limiting

### Login endpoint (`POST /api/auth/signin`)
- Max: **5 attempts per IP per 10 minutes**
- On exceed: return `429 Too Many Requests`
- Response body: `{ success: false, error: 'Too many attempts. Try again in X minutes.' }`
- Do not reveal how many attempts remain

### Forgot password endpoint (`POST /api/forgot-password`)
- Max: **3 requests per IP per 15 minutes**
- On exceed: return `429 Too Many Requests`
- Apply regardless of whether the email exists

### Implementation
```ts
// Using Upstash Redis
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 m'),
})

const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
const { success, reset } = await ratelimit.limit(ip)

if (!success) {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000)
  return Response.json(
    { success: false, error: `Too many attempts. Try again in ${Math.ceil(retryAfter / 60)} minutes.` },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  )
}
```

---

## Environment Variables

### Required — never hardcode these
```
DATABASE_URL            — Prisma connection string
NEXTAUTH_SECRET         — Min 32 chars, generated with: openssl rand -base64 32
NEXTAUTH_URL            — Full URL: https://your-app.vercel.app in prod
RESEND_API_KEY          — From Resend dashboard
UPSTASH_REDIS_REST_URL  — From Upstash console
UPSTASH_REDIS_REST_TOKEN — From Upstash console
```

### Accessing safely
```ts
// ✅ Always check presence at startup
const apiKey = process.env.RESEND_API_KEY
if (!apiKey) throw new Error('RESEND_API_KEY is not set')
```

### Gitignore — verify this exists before first push
```
.env
.env.local
.env.*.local
```

---

## Input Validation

All user input must pass Zod validation on the **server** before any DB operation.  
Client-side validation is UX only — it is not a security control.

```ts
const result = schema.safeParse(body)
if (!result.success) {
  return Response.json({ success: false, error: 'Invalid input' }, { status: 400 })
  // Do NOT return result.error.issues — it may leak field names or internal schema details
}
```

---

## Session Security

- Strategy: **JWT** (stateless, works with Vercel serverless)
- `NEXTAUTH_SECRET` signs all tokens — minimum 32 characters
- Session contains: `{ id, email, name, emailVerified }`
- `emailVerified` checked server-side on every protected page load
- Never check authentication status client-side only

### Dashboard guard (server component)
```ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

const session = await getServerSession(authOptions)

if (!session) redirect('/login')
if (!session.user.emailVerified) redirect('/verify-email')
```

---

## HTTP Security Headers

Required in `next.config.js` — applied to all routes:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-DNS-Prefetch-Control: on
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Forbidden Patterns

Never write any of the following:

```ts
// ❌ Plain text password storage
await db.user.create({ data: { password: plainTextPassword } })

// ❌ Logging credentials
console.log('User login attempt:', { email, password })

// ❌ Math.random for tokens
const token = Math.random().toString(36).slice(2)

// ❌ Hardcoded secret
const secret = 'my-super-secret-key'

// ❌ Skipping expiry check
const token = await db.verificationToken.findUnique({ where: { token } })
user.emailVerified = new Date() // without checking token.expires

// ❌ Leaking email existence
if (!user) return Response.json({ error: 'Email not found' }, { status: 404 })

// ❌ Returning Prisma errors raw
} catch (e) {
  return Response.json({ error: e.message }, { status: 500 })
}

// ❌ Client-only auth guard
if (session) { /* show dashboard */ }  // in a client component with no server check
```

---

## Security Review Checklist

Before marking any phase complete, verify:

- [ ] Passwords stored as bcrypt hash (salt rounds = 12)
- [ ] Token generated with `crypto.randomBytes(32)`
- [ ] Token expiry checked before any action taken on it
- [ ] Token deleted from DB immediately after use
- [ ] Forgot password returns identical response for known/unknown email
- [ ] Login error does not specify whether email or password was wrong
- [ ] Rate limiting applied to login and forgot-password endpoints
- [ ] No stack traces in API responses
- [ ] No secrets in source code
- [ ] `.env.local` in `.gitignore`
- [ ] Security headers set in `next.config.js`
- [ ] Dashboard requires both valid session AND `emailVerified !== null`
