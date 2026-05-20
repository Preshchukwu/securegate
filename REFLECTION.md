# SecureGate — Reflection & Engineering Analysis

**Name:** Precious Nwachukwu
**Cohort:** Design to MVP Bootcamp
**Live URL:** https://securegate-vert.vercel.app/
**GitHub Repo:** https://github.com/Preshchukwu/securegate

---

## Part 1 — What I Built

SecureGate is an authentication system built with Next.js, Prisma, PostgreSQL, and NextAuth.js. Used to show the implementaton of the complete authentication lifecycle.

## Part 2 — What Surprised Me

It looked easy at first, the time it took to implement what i thought was a simple auth process was suprising.

---

## Part 3 — Engineering Laws Quiz

### Q1 — Murphy's Law
**Code reference:** `lib/auth.ts` lines 21–27

Murphy's Law says anything that can go wrong will go wrong. In `lib/auth.ts`, when a user tries to log in with an email that does not exist, the code does not skip the password comparison — it still runs `bcrypt.compare` against a constant called `DUMMY_HASH`:

```ts
const DUMMY_HASH = "$2b$12$invalidhashfortimingprotectiononly";

const passwordValid = user
  ? await bcrypt.compare(password, user.password)
  : await bcrypt.compare(password, DUMMY_HASH);
```

**What goes wrong if ignored:** An attacker can enumerate every email address in your database by timing responses, without ever getting a password correct. Registration lists become public knowledge.

---

### Q2 — Law of Leaky Abstractions
**Code reference:** 

**My Answer:** 

**What goes wrong if ignored:** 

---

### Q3 — YAGNI
**Code reference:** `prisma/schema.prisma`, `middleware.ts`

**My Answer:** While these are nice to have, for the time frame of the task, it was best to leave them, and add them when everything else works, and there ample time to connect other things. The essential thing is get this simple flows to work well first.



**What goes wrong if ignored:** You build and maintain features that serve no current user. They add bugs, slow every future change, and are almost always designed wrong because the real requirement was never defined when the feature was built.

---


### Q4 — Bcrypt, Salts, and Hashing
**Code reference:** `app/api/register/route.ts` line 28

**My Answer:**Salt is a handful or glitters bycrypt throws int password hashing so there’s uniqueness in passwords even for users with the same password. Bycrypt uses salt automatically to protect user password as it is difficult to crack. 


**What goes wrong if ignored:** If i had used SHA-256, users with identical passwords will have identical hashes

---

### Q5 — Postel's Law
**Code reference:**  if (submitted) {
    return (
      <div className="space-y-4">
        <Alert variant="success">
          If an account exists for that email, a reset link has been sent. Check your inbox.
        </Alert>
        <p className="text-center text-sm text-[var(--md-sys-color-outline)]">
          <button
            type="button"
            onClick={() => onSwitch("login")}
            className="text-[var(--md-sys-color-primary)] font-medium hover:underline focus:outline-none"
          >
            Back to sign in
          </button>
        </p>
      </div>
    );

**My Answer:** Postel's Law says: be liberal in what you accept, conservative in what you send. In the forgot password flow, user gets a generic repsonse that says if you are registered you will get a mail. 

**What goes wrong if ignored:** Registered users email can be determined if it state clearly the emails that are registered users


---

### Q6 — The Boy Scout Rule
**Code reference:** `components/auth/AuthCard.tsx`

**My Answer:** My scaffold initially brought the login form first, but i switched to have the sign up first, i also had to put all forms in one auth page and render them dynamically.

Also i merged all four auth forms — login, signup, forgot-password, and reset-password into a single `AuthCard` component that renders conditionally using an `AuthView` type. This eliminated separate route pages for each form.

**What goes wrong if ignored:** The product is shaped by the AI scafolding rather that product user experience

---

### Q7 — Gall's Law
**Code reference:** Full `app/api/` directory built phase by phase

**My Answer:** trying to work on everything at the same time would have been a disaster, alot of flows wont work as the expect, the ai could hallucinate, step by step makes sure things are they way they should be, every step.

SecureGate was built phase by phase: registration first, then login, then email verification, then password reset, then rate limiting. The forgot-password route in `app/api/forgot-password/route.ts` only works because `lib/tokens.ts` and `lib/email.ts` already existed from the email verification phase. The rate limiter in `lib/rate-limit.ts` was only added once login was confirmed working. Each phase was a verified working system before the next layer was added.

**What goes wrong if ignored:** Everything depends on everything else before any of it is tested. One broken piece makes the whole system non-functional, and the debugging surface becomes the entire application instead of a single new addition.

---

### Q8 — Law of Leaky Abstractions (ORMs)
**Code reference:** `prisma/schema.prisma` line 11

**My Answer:** In the Prisma schema, the User model declares:

```prisma
id String @id @default(cuid())
```

This looks like the database generates the ID automatically. It does not. Prisma generates the CUID in JavaScript before the INSERT statement is sent — the actual PostgreSQL column has no `DEFAULT` value at the database level. If you connected directly to the database and ran an INSERT without providing an `id`, PostgreSQL would throw a not-null constraint error with no fallback.

Compare it to line 16:

```prisma
createdAt DateTime @default(now())
```

This one does push a `DEFAULT now()` to PostgreSQL — the database handles it natively. Two lines with identical-looking schema syntax, two completely different realities underneath. The Prisma abstraction makes them look the same. The actual database table tells a different story.

**What goes wrong if ignored:** Any script, migration tool, or second service that writes directly to the database without going through Prisma will fail on insert because no ID is provided and no database default exists. The schema gave the impression the database would handle it.

---

### Q9 — Zawinski's Law + Rate Limiting
**Code reference:** `lib/rate-limit.ts`

**My Answer:** Rate limiting is not in Next.js or NextAuth, it had to be added manually. The auth system started with just login and registration. Then email verification was required, then password reset. Each addition was justified, but each one expanded what the system needed to do.


**What goes wrong if ignored:** The auth layer starts absorbing logging, alerting, fraud detection, and audit trails. Each addition makes sense in isolation. Together they create a monolith with no clear boundary between authentication and everything else.

---

### Q10 — The Principle of Least Surprise
**Code reference:** `components/auth/LoginForm.tsx` line 69

**My Answer:** Invalid email or password. I think i didnt do well here, user should be able to tell if the error is the email or the password


**What goes wrong if ignored:** Users are left guessing where the error could be coming from

---

### Q11 — Murphy's Law + Defensive Programming
**Code reference:** `middleware.ts`, `lib/auth.ts` 

**My Answer:** The middleware uses NextAuth's `withAuth`, which checks for a valid session cookie before any dashboard route is reached:



**What goes wrong if ignored:** If session checks lived inside individual dashboard components, one forgotten check would expose a page. Middleware makes bypassing authentication structurally impossible rather than relying on every developer remembering to add the check.

---

### Q12 — Kerckhoffs's Principle + Technical Debt
**Code reference:** `.env.local` 

**My Answer:** Generate new auth secret and redeploy my project to invalidate old secret.



**What goes wrong if ignored:** An attacker with the secret can impersonate any user indefinitely with no trace in the database.

---

### Q13 — Conway's Law
**Code reference:** Folder structure — prd.md, AGENTS.md, rules

**My Answer:** The structure of the project makes working with AI seamless, i started by using the task brief to generate a prd, the i created context folders to help inform the ai while we worked.


**What goes wrong if ignored:**When the structure does not match how you think, you spend energy navigating the code rather than writing it.

---

### Q14 — Technical Debt
**Code reference:** `lib/email.ts` — `getTransporter()`

**My Answer:** Using nodemailer, when the app grows it will be an issue because of size limitation, switching to higher platforms like resend will work.



---

### Q15 — Synthesis: Payments
**Code reference:** All of the above

**My Answer:** Murphy's law will apply, as if careful setup, webhook verification is not handle, things will still go wrong. Percy's law as well, collecting infor liberally but being conservative in feedback. DRY setting up skills for flutterwave integration and webhook handler.



---

## Part 4 — One Thing I Would Refactor


```

---

## Part 5 — How This Changes How I Build

Before SecureGate, I didnt think so much about auth systems indepth and the user experience side of it. Now everything maters, from accessibility to security.
