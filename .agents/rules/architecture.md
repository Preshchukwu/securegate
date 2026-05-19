# SecureGate — Architecture Rules

Read this before creating files, routes, schemas, or components.

---

## Folder Structure

```
securegate/
├── .agents/
│   ├── AGENTS.md
│   └── rules/
│       ├── architecture.md       ← this file
│       └── security.md
├── app/                          ← Next.js App Router root
│   ├── (auth)/                   ← Route group: public auth pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── [token]/
│   │   │       └── page.tsx
│   │   └── verify-email/
│   │       └── [token]/
│   │           └── page.tsx
│   ├── (protected)/              ← Route group: requires auth + verified
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      ← NextAuth handler
│   │   ├── register/
│   │   │   └── route.ts          ← POST: create user
│   │   ├── verify-email/
│   │   │   └── route.ts          ← POST: resend verification
│   │   ├── forgot-password/
│   │   │   └── route.ts          ← POST: request reset
│   │   └── reset-password/
│   │       └── route.ts          ← POST: submit new password
│   ├── layout.tsx                ← Root layout (font, theme provider)
│   └── globals.css               ← @import tokens.css + base reset
├── components/
│   ├── ui/                       ← Primitive components (input, button, etc.)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── FormField.tsx
│   │   ├── Alert.tsx
│   │   └── PasswordStrength.tsx
│   └── auth/                     ← Auth-specific composite components
│       ├── LoginForm.tsx
│       ├── SignUpForm.tsx
│       ├── ForgotPasswordForm.tsx
│       └── ResetPasswordForm.tsx
├── lib/
│   ├── auth.ts                   ← NextAuth config (authOptions)
│   ├── db.ts                     ← Prisma client singleton
│   ├── email.ts                  ← Resend helpers (sendVerificationEmail, sendResetEmail)
│   ├── tokens.ts                 ← Token generation + expiry helpers
│   ├── rate-limit.ts             ← Rate limiting middleware/helper
│   └── validations.ts            ← Zod schemas
├── middleware.ts                 ← Next.js middleware (auth + email verification guard)
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── emails/                       ← React Email templates
│   ├── VerificationEmail.tsx
│   └── PasswordResetEmail.tsx
├── tokens.css                    ← Design tokens (single source of truth)
├── designsystem.md
├── colorstyle.md
├── prd.md
├── .env.local                    ← Never committed
├── .gitignore
└── next.config.js
```

---

## Prisma Schema

### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
}
```

### VerificationToken Model
```prisma
model VerificationToken {
  identifier String   @unique
  token      String   @unique
  expires    DateTime

  @@index([token])
}
```

`identifier` = user email address.  
`token` = `crypto.randomBytes(32).toString('hex')`.  
`expires` = `new Date(Date.now() + 15 * 60 * 1000)` (15 minutes).

### PasswordResetToken Model
```prisma
model PasswordResetToken {
  id      String   @id @default(cuid())
  email   String
  token   String   @unique
  expires DateTime

  @@index([token])
  @@index([email])
}
```

`expires` = `new Date(Date.now() + 60 * 60 * 1000)` (1 hour).

---

## API Route Conventions

### Response shape
All API routes return JSON with consistent shape:

```ts
// Success
{ success: true, message: string, data?: unknown }

// Error
{ success: false, error: string }
```

Never return stack traces. Never return raw Prisma errors.

### HTTP status codes
| Situation | Status |
|-----------|--------|
| Success | 200 |
| Created | 201 |
| Bad input (Zod fail) | 400 |
| Unauthenticated | 401 |
| Rate limited | 429 |
| Server error | 500 |

### Route handler pattern
```ts
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ success: false, error: 'Invalid input' }, { status: 400 })
    }
    // ... logic
  } catch {
    return Response.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
```

---

## Zod Validation Schemas (`lib/validations.ts`)

Define all schemas here. Import into both API routes and client-side forms.

```ts
export const signUpSchema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(8).max(100),
})

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const resetPasswordSchema = z.object({
  token:    z.string().length(64),
  password: z.string().min(8).max(100),
})
```

---

## NextAuth Configuration (`lib/auth.ts`)

```ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // 1. Validate shape
        // 2. Find user by email
        // 3. bcrypt.compare(password, user.password)
        // 4. Return user object or null — never throw with email leak
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id            = user.id
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      session.user.id            = token.id as string
      session.user.emailVerified = token.emailVerified as Date | null
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}
```

---

## Middleware (`middleware.ts`)

Runs on every request matching the config matcher.

```ts
export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

For the additional `emailVerified` check, apply it inside the dashboard page's server component or in a custom middleware wrapper — do not rely on the client for this check.

---

## Prisma Client Singleton (`lib/db.ts`)

```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

Always import `db` from `lib/db`, never instantiate `new PrismaClient()` elsewhere.

---

## Component Conventions

- All primitive UI components live in `components/ui/`
- They accept only typed props — no `any`
- They consume design tokens via CSS custom properties or Tailwind classes mapped to tokens
- They never contain business logic or direct DB/API calls
- Form components in `components/auth/` manage state and call API routes
- Use `'use client'` only in components that require browser APIs or React hooks
- Server components are the default — opt into client only when necessary

---

## Token Helpers (`lib/tokens.ts`)

```ts
import crypto from 'crypto'

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function isTokenExpired(expires: Date): boolean {
  return expires < new Date()
}
```

---

## Email Helpers (`lib/email.ts`)

- All email sending goes through this module
- Never call Resend directly from a route handler
- Each function accepts only the minimum data it needs

```ts
export async function sendVerificationEmail(email: string, token: string): Promise<void>
export async function sendPasswordResetEmail(email: string, token: string): Promise<void>
```

---

## Security Headers (`next.config.js`)

```js
const securityHeaders = [
  { key: 'X-Frame-Options',          value: 'DENY' },
  { key: 'X-Content-Type-Options',   value: 'nosniff' },
  { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control',   value: 'on' },
  { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
]
```

Apply via `headers()` in the Next.js config.
