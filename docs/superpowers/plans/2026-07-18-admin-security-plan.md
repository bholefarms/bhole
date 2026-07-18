# Admin Security — Middleware, 2FA & Change Password Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add edge middleware, TOTP two-factor authentication, and change-password to the Bhole Farms admin panel.

**Architecture:** Three independent additions sharing the auth layer:
1. Edge middleware (`src/middleware.ts`) protects `/admin/*` routes using NextAuth.js v5's `auth()` wrapper, checking session and `twoFactorPending` JWT flag
2. TOTP 2FA uses `otplib` for code generation/verification and `qrcode` for QR display, with a verification gate page and setup UI in settings
3. Change Password is a simple server action + form in settings

**Tech Stack:** Next.js 16 (App Router), NextAuth.js v5 beta, Prisma 7.8, PostgreSQL (Supabase), otplib, qrcode, bcryptjs

## Global Constraints

- Must work on Vercel Edge Runtime (no Node.js-specific APIs in middleware)
- NextAuth.js v5 beta API patterns (not v4)
- Prisma 7.8 with adapter-pg
- bcryptjs for password hashing (salt rounds 12)
- TypeScript strict
- TOTP secret stored as plain string in DB (no encryption for v1)

---

### Task 1: Prisma Schema + Dependencies

**Files:**
- Modify: `prisma/schema.prisma` (User model)
- Modify: `package.json` (add deps)

**Interfaces:**
- Consumes: existing User model
- Produces: `User.twoFactorSecret` (String?), `User.twoFactorEnabled` (Boolean, default false)

- [ ] **Step 1: Add 2FA fields to User model**

Edit `prisma/schema.prisma`, add after `hashedPassword`:
```
  twoFactorSecret    String?
  twoFactorEnabled   Boolean  @default(false)
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install otplib qrcode
npm install -D @types/qrcode
```

- [ ] **Step 3: Generate Prisma client**

Run:
```bash
npx prisma generate
```

- [ ] **Step 4: Create Prisma migration**

```bash
npx prisma migrate dev --name add-2fa-fields
```

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma package.json package-lock.json
git commit -m "feat: add 2FA fields to User model and install otplib/qrcode"
```

---

### Task 2: Extend Auth Types and JWT Flow

**Files:**
- Modify: `src/lib/auth-types.d.ts` (extend User/Session/JWT types)
- Modify: `src/lib/auth.ts` (add twoFactorPending logic to jwt/session callbacks)

**Interfaces:**
- Consumes: Prisma User model with twoFactorEnabled
- Produces: `jwt()` callback sets `token.twoFactorPending` on login when 2FA enabled; `jwt()` clears it on `trigger === "update"` with `session.twoFactorVerified`; `session()` maps `token.twoFactorPending` to `session.user.twoFactorPending`

- [ ] **Step 1: Update auth types**

Edit `src/lib/auth-types.d.ts`:
```typescript
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    twoFactorEnabled?: boolean;
  }
  interface Session {
    user: {
      role?: string;
      id?: string;
      twoFactorPending?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
    twoFactorPending?: boolean;
  }
}
```

- [ ] **Step 2: Update auth.ts JWT callback**

Edit `src/lib/auth.ts` — update the `jwt` callback:
```typescript
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        if (user.twoFactorEnabled) {
          token.twoFactorPending = true;
        }
      }
      if (trigger === "update" && session?.twoFactorVerified) {
        delete token.twoFactorPending;
      }
      return token;
    },
```

- [ ] **Step 3: Update auth.ts session callback**

Edit `src/lib/auth.ts` — update the `session` callback to pass `twoFactorPending`:
```typescript
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        if (token.twoFactorPending) {
          session.user.twoFactorPending = true;
        }
      }
      return session;
    },
```

- [ ] **Step 4: Update authorize to include twoFactorEnabled**

Edit `src/lib/auth.ts` — in the `authorize` function, update the user query and returned object:
```typescript
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
        };
      },
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth-types.d.ts src/lib/auth.ts
git commit -m "feat: extend JWT/session with twoFactorPending flag for 2FA flow"
```

---

### Task 3: Edge Middleware

**Files:**
- Create: `src/middleware.ts`

**Interfaces:**
- Consumes: `auth()` from `@/lib/auth`, which returns session with `user.twoFactorPending`
- Produces: Request-level redirects for unauthenticated or 2FA-pending admin access

- [ ] **Step 1: Create middleware.ts**

Create `src/middleware.ts`:
```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Allow public auth pages
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/verify-2fa")) {
    return NextResponse.next();
  }

  // No session → redirect to login
  if (!session?.user) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2FA pending → redirect to verification page
  if ((session.user as any).twoFactorPending) {
    return NextResponse.redirect(new URL("/admin/verify-2fa", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add edge middleware to protect /admin/* routes with 2FA gate"
```

---

### Task 4: 2FA Server Actions

**Files:**
- Create: `src/actions/2fa.ts`

**Interfaces:**
- Consumes: Prisma User, otplib, session from NextAuth
- Produces:
  - `enable2fa()` → `{ secret: string, qrCodeUrl: string }`
  - `verify2faSetup(token: string)` → `{ success: boolean, error?: string }`
  - `disable2fa()` → `{ success: boolean }`
  - `verify2faLogin(token: string)` → `{ success: boolean, error?: string }`

- [ ] **Step 1: Create 2fa.ts server actions**

Create `src/actions/2fa.ts`:
```typescript
"use server";

import { authenticator } from "otplib";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import QRCode from "qrcode";

function getIssuer() {
  return "Bhole Farms";
}

export async function enable2fa() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const secret = authenticator.generateSecret();
  const service = getIssuer();
  const otpauth = authenticator.keyuri(session.user.email || "admin", service, secret);
  const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

  // Store secret temporarily — not saved until verified
  return { secret, qrCodeDataUrl };
}

export async function verify2faSetup(secret: string, token: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const isValid = authenticator.verify({ token, secret });
    if (!isValid) return { error: "Invalid code. Try again." };

    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorSecret: secret, twoFactorEnabled: true },
    });

    return { success: true };
  } catch {
    return { error: "Verification failed. Try again." };
  }
}

export async function disable2fa() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorSecret: null, twoFactorEnabled: false },
  });

  return { success: true };
}

export async function verify2faLogin(token: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorSecret: true },
  });

  if (!user?.twoFactorSecret) return { error: "2FA not configured" };

  try {
    const isValid = authenticator.verify({ token, secret: user.twoFactorSecret });
    if (!isValid) return { error: "Invalid code. Try again." };

    return { success: true };
  } catch {
    return { error: "Verification failed. Try again." };
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/actions/2fa.ts
git commit -m "feat: add 2FA server actions (enable, verify setup, disable, verify login)"
```

---

### Task 5: Change Password Action

**Files:**
- Create: `src/actions/account.ts`

**Interfaces:**
- Consumes: Prisma User, bcryptjs, session from NextAuth
- Produces: `changePassword(currentPassword, newPassword)` → `{ success: boolean, error?: string }`

- [ ] **Step 1: Create account.ts server action**

Create `src/actions/account.ts`:
```typescript
"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  // Validate current password
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { hashedPassword: true },
  });

  if (!user) return { error: "User not found" };

  const isValid = await bcrypt.compare(currentPassword, user.hashedPassword);
  if (!isValid) return { error: "Current password is incorrect" };

  // Validate new password
  if (newPassword.length < 8) return { error: "New password must be at least 8 characters" };
  if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    return { error: "New password must contain at least one letter and one number" };
  }

  // Hash and save new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { hashedPassword },
  });

  return { success: true };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/actions/account.ts
git commit -m "feat: add change password server action"
```

---

### Task 6: Verify 2FA Page

**Files:**
- Create: `src/app/(admin)/admin/verify-2fa/page.tsx`

**Interfaces:**
- Consumes: `verify2faLogin()`, `complete2faLogin()` from actions
- Produces: A centered 6-digit TOTP input page that verifies the code and updates session

- [ ] **Step 1: Create verify-2fa page**

Create `src/app/(admin)/admin/verify-2fa/page.tsx`:
```tsx
"use client";

import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { verify2faLogin } from "@/actions/2fa";
import { ShieldAlert } from "lucide-react";

export default function Verify2FAPage() {
  const router = useRouter();
  const { update } = useSession();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (newCode.every((d) => d) && newCode.join("").length === 6) {
      submitCode(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitCode = async (token: string) => {
    setLoading(true);
    setError("");

    const result = await verify2faLogin(token);
    if (result.error) {
      setError(result.error);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setLoading(false);
      return;
    }

    // Update session to clear twoFactorPending
    await update({ twoFactorVerified: true });
    router.push("/admin/dashboard");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const token = code.join("");
    if (token.length === 6) submitCode(token);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F8F5] px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-100">
            <ShieldAlert className="size-7 text-amber-600" />
          </div>
          <h1 className="text-xl font-semibold">Two-Factor Authentication</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center gap-2">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="size-12 rounded-lg border border-input bg-background text-center text-xl font-bold shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                autoFocus={i === 0}
                disabled={loading}
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-sm text-destructive font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || code.some((d) => !d)}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Open your authenticator app and enter the code shown for Bhole Farms
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add session provider root layout if not present**

Check if `app/layout.tsx` has `SessionProvider`. If not, the auth page won't be able to call `update()`. Verify the root layout includes `NextAuthProvider` or similar wrapping `SessionProvider`. If missing, the plan needs a sub-step.

- [ ] **Step 3: Commit**

```bash
git add src/app/(admin)/admin/verify-2fa/page.tsx
git commit -m "feat: add 2FA verification page with 6-digit TOTP input"
```

---

### Task 7: 2FA Setup Component

**Files:**
- Create: `src/components/admin/two-factor-setup.tsx`

**Interfaces:**
- Consumes: `enable2fa()`, `verify2faSetup()`, `disable2fa()` from `@/actions/2fa`
- Produces: A UI section with enable toggle, QR code display, and verification input

- [ ] **Step 1: Create two-factor-setup component**

Create `src/components/admin/two-factor-setup.tsx`:
```tsx
"use client";

import { useState } from "react";
import { enable2fa, verify2faSetup, disable2fa } from "@/actions/2fa";
import { Shield, ShieldOff, Copy, Check } from "lucide-react";

interface TwoFactorSetupProps {
  isEnabled: boolean;
}

export function TwoFactorSetup({ isEnabled: initiallyEnabled }: TwoFactorSetupProps) {
  const [enabled, setEnabled] = useState(initiallyEnabled);
  const [showSetup, setShowSetup] = useState(false);
  const [secret, setSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEnable = async () => {
    setLoading(true);
    setError("");
    const result = await enable2fa();
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setSecret(result.secret);
    setQrCode(result.qrCodeDataUrl);
    setShowSetup(true);
    setLoading(false);
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) return;
    setLoading(true);
    setError("");
    const result = await verify2faSetup(secret, verificationCode);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setEnabled(true);
    setShowSetup(false);
    setVerificationCode("");
    setLoading(false);
  };

  const handleDisable = async () => {
    if (!confirm("Are you sure you want to disable 2FA? Your account will be less secure.")) return;
    setLoading(true);
    setError("");
    await disable2fa();
    setEnabled(false);
    setSecret("");
    setQrCode("");
    setLoading(false);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showSetup) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrCode} alt="2FA QR Code" className="size-48 rounded-lg border" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <code className="rounded-md bg-muted px-3 py-1.5 text-xs font-mono">{secret}</code>
          <button onClick={copySecret} className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors">
            {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground">Can&apos;t scan? Enter this key manually.</p>
        <div className="space-y-2">
          <label className="text-sm font-medium">Verify code</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-lg font-mono tracking-widest text-center outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleVerify}
              disabled={verificationCode.length !== 6 || loading}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? "..." : "Verify"}
            </button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {enabled ? (
            <Shield className="size-5 text-green-600" />
          ) : (
            <ShieldOff className="size-5 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium">Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground">
              {enabled ? "Your account is protected with 2FA" : "Add an extra layer of security to your account"}
            </p>
          </div>
        </div>
        {enabled ? (
          <button
            onClick={handleDisable}
            disabled={loading}
            className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/5 disabled:opacity-50 transition-colors"
          >
            Disable
          </button>
        ) : (
          <button
            onClick={handleEnable}
            disabled={loading}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            Enable
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/two-factor-setup.tsx
git commit -m "feat: add 2FA setup component with QR code and verification"
```

---

### Task 8: Change Password Component

**Files:**
- Create: `src/components/admin/change-password-form.tsx`

**Interfaces:**
- Consumes: `changePassword()` from `@/actions/account`
- Produces: A form with current password, new password, confirm new password

- [ ] **Step 1: Create change-password-form component**

Create `src/components/admin/change-password-form.tsx`:
```tsx
"use client";

import { useState, type FormEvent } from "react";
import { changePassword } from "@/actions/account";
import { Lock, Eye, EyeOff } from "lucide-react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const PasswordInput = ({
    value,
    onChange,
    placeholder,
    show,
    toggleShow,
    id,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    show: boolean;
    toggleShow: () => void;
    id: string;
  }) => (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3">
        <Lock className="size-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Change Password</p>
          <p className="text-xs text-muted-foreground">Update your admin password</p>
        </div>
      </div>

      <div className="space-y-3 max-w-sm">
        <PasswordInput
          id="current-password"
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="Current password"
          show={showCurrent}
          toggleShow={() => setShowCurrent(!showCurrent)}
        />
        <PasswordInput
          id="new-password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="New password (min 8 chars, letter + number)"
          show={showNew}
          toggleShow={() => setShowNew(!showNew)}
        />
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {error && <p className="text-sm text-destructive font-medium">{error}</p>}
      {success && <p className="text-sm text-green-600 font-medium">Password updated successfully.</p>}

      <button
        type="submit"
        disabled={loading || !currentPassword || !newPassword || !confirmPassword}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/change-password-form.tsx
git commit -m "feat: add change password form component"
```

---

### Task 9: Wire Settings Page

**Files:**
- Modify: `src/app/(admin)/admin/(protected)/settings/page.tsx` (pass session data, add sections)
- Modify: `src/app/(admin)/admin/(protected)/settings/settings-tabs.tsx` (add 2FA and password sections below tabs)

**Interfaces:**
- Consumes: `TwoFactorSetup`, `ChangePasswordForm` components
- Produces: Settings page with new security sections

- [ ] **Step 1: Update settings page to pass user data**

Edit `src/app/(admin)/admin/(protected)/settings/page.tsx`:
```tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsTabs } from "./settings-tabs";
import { TwoFactorSetup } from "@/components/admin/two-factor-setup";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export const dynamic = "force-dynamic";

const allKeys = [
  "site_name", "site_description", "hero_headline", "hero_subtext",
  "contact_phone", "contact_email", "whatsapp_number", "address",
  "seo_title", "seo_description", "seo_keywords",
];

const generalKeys = ["site_name", "site_description", "hero_headline", "hero_subtext"];
const contactKeys = ["contact_phone", "contact_email", "whatsapp_number", "address"];
const seoKeys = ["seo_title", "seo_description", "seo_keywords"];

export default async function AdminSettingsPage() {
  const session = await auth();

  const settings = await prisma.setting.findMany({
    where: { key: { in: allKeys } },
  });

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const pickKeys = (keys: string[]) =>
    Object.fromEntries(keys.map((k) => [k, settingsMap[k] || ""]));

  // Get 2FA status
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { twoFactorEnabled: true },
      })
    : null;

  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage your site configuration" />
      <SettingsTabs
        generalSettings={pickKeys(generalKeys)}
        contactSettings={pickKeys(contactKeys)}
        seoSettings={pickKeys(seoKeys)}
      />
      <div className="mt-8 space-y-6 border-t pt-8">
        <div className="rounded-lg border bg-card p-6">
          <TwoFactorSetup isEnabled={user?.twoFactorEnabled ?? false} />
        </div>
        <div className="rounded-lg border bg-card p-6">
          <ChangePasswordForm />
        </div>
      </div>
    </PageContainer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(admin)/admin/(protected)/settings/page.tsx
git commit -m "feat: add 2FA setup and change password sections to settings page"
```

---

### Task 10: Build & Verify

**Files:** None

- [ ] **Step 1: Build the project**

```bash
npm run build
```

Expected: Successful build with no TypeScript errors.

- [ ] **Step 2: Run linter**

```bash
npm run lint
```

Expected: Clean lint output.

- [ ] **Step 3: Check LSP diagnostics**

```bash
# Check for TypeScript errors
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 4: Fix any issues found**

If build/lint/diagnostics fail, fix the specific issues.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: fix build issues and verify admin security features"
```
