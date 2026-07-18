# Task 6: Verify 2FA Page + SessionProvider

**Goal:** Create a SessionProvider for admin client components and the 2FA verification page.

## Files to create
- `src/components/session-provider.tsx`
- `src/app/(admin)/admin/verify-2fa/page.tsx`

## Files to modify
- `src/app/(admin)/layout.tsx`

## Details

### 1. Create `src/components/session-provider.tsx`
A simple client component wrapper:
```typescript
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { type ReactNode } from "react";

export function SessionProvider({ children }: { children: ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

### 2. Update `src/app/(admin)/layout.tsx`
Wrap children with SessionProvider:
```typescript
import { SessionProvider } from "@/components/session-provider";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <SessionProvider>{children}</SessionProvider>
    </div>
  );
}
```

### 3. Create verify-2fa page at `src/app/(admin)/admin/verify-2fa/page.tsx`
A centered page with:
- Shield icon
- "Two-Factor Authentication" heading
- 6 individual digit input boxes that auto-advance on typing
- Auto-submit when all 6 digits entered
- Backspace goes to previous input
- Error state display
- Loading state while verifying
- On success: calls `update({ twoFactorVerified: true })` from `useSession()`, then redirects to `/admin/dashboard`
- On error: clears inputs, focuses first input

## Global constraints
- Must use `useSession()` from `next-auth/react` for session update
- Must use `verify2faLogin()` from `@/actions/2fa` for verification
- TypeScript strict

## Commits
- `feat: add SessionProvider and 2FA verification page`
