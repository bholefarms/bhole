# Admin Security — Middleware, 2FA & Change Password

> **Date:** 2026-07-18
> **Project:** Bhole Farms
> **Status:** Approved Design

---

## Problem

The admin panel (`/admin/*`) is only protected by a server-side session check inside the React layout. There is no edge-level middleware, no two-factor authentication, and no way for the admin to change their password without direct database access.

---

## Solution Overview

Three independent additions to the existing admin authentication system:

1. **Middleware** — NextAuth.js v5 edge-compatible middleware that protects `/admin/*` at the request level
2. **TOTP 2FA** — Authenticator-app-based two-factor authentication (Google Authenticator, Authy, etc.)
3. **Change Password** — Self-service password change form in admin settings

---

## 1. Edge Middleware

### Location
`src/middleware.ts` (root of `src/`, Next.js App Router convention)

### Behavior
| Route Pattern | No Session | Session (2faPending) | Session (2faVerified) |
|---|---|---|---|
| `/admin/login` | Allow | Allow | Allow |
| `/admin/verify-2fa` | Redirect → login | Allow | Redirect → dashboard |
| `/admin/*` (all other) | Redirect → login | Redirect → verify-2fa | Allow |
| Everything else | Allow | Allow | Allow |

### Implementation
- Use NextAuth.js v5's `auth()` exported from `@/lib/auth`
- The middleware function checks `auth()` result and redirects using `NextResponse.redirect`
- Works on Vercel Edge Runtime (no Node.js-specific APIs)

### JWT Shape Extension
```typescript
// Current JWT: { role, id }
// Extended JWT: { role, id, twoFactorPending?: boolean }
```

- `twoFactorPending: true` when admin has 2FA enabled but hasn't verified TOTP this session
- Cleared after successful TOTP verification via `session.update()`

---

## 2. TOTP Two-Factor Authentication

### Dependencies
- `otplib` — TOTP generation and verification (lightweight, no native deps)
- `qrcode` — Generates QR code data URLs for authenticator app setup

### Prisma Schema Changes
```
model User {
  // ... existing fields
  twoFactorSecret    String?  // Encrypted TOTP secret
  twoFactorEnabled   Boolean  @default(false)
}
```

### Auth Flow

```
Login (email + password)
  │
  ├─ 2FA disabled? → JWT with { role, id } → redirect to Dashboard
  │
  └─ 2FA enabled?  → JWT with { role, id, twoFactorPending: true }
       → redirect to /admin/verify-2fa
       → admin enters 6-digit code
       → verify with otplib against stored secret
       → call session.update({ twoFactorVerified: true })
       → NextAuth jwt callback clears twoFactorPending
       → middleware allows access → Dashboard
```

### Pages

#### `/admin/verify-2fa` (new)
- Simple centered page
- 6-digit input (single field or 6 individual boxes)
- Error state for invalid code
- "Use backup code" option (future; not in scope)

#### 2FA Setup (in `/admin/settings`)
- Section: "Two-Factor Authentication"
- Toggle switch "Enable 2FA"
- On enable:
  - Generate TOTP secret via `otplib`
  - Render QR code using `qrcode` npm package
  - Show manual setup key (in case QR can't be scanned)
  - Ask admin to scan with authenticator app
  - Require one TOTP code to verify setup before persisting
- On disable:
  - Confirm dialog
  - Clear `twoFactorSecret`, set `twoFactorEnabled = false`

### Server Actions

| Action | Purpose |
|---|---|
| `enable2fa()` | Generate secret, return QR data URL + manual key. Does NOT save yet. |
| `verify2faSetup(token: string)` | Verify TOTP code AFTER setup to confirm it works. Saves secret + enables. |
| `disable2fa()` | Clear secret, disable 2FA. |
| `verify2faLogin(token: string)` | Verify TOTP code during login. |
| `complete2faLogin()` | Call `session.update()` after TOTP verification. |

---

## 3. Change Password

### Location
In `/admin/settings` — a "Change Password" section.

### Form Fields
- Current password
- New password
- Confirm new password

### Validation
- Current password must match stored bcrypt hash
- New password: minimum 8 chars, at least one letter + one number
- New password and confirm must match

### Server Action
```
changePassword(currentPassword, newPassword)
  → validate current password with bcrypt.compare
  → hash new password with bcrypt (salt rounds 12)
  → update user record
  → return success/error
```

---

## Files Changed / Created

### New Files
| File | Purpose |
|---|---|
| `src/middleware.ts` | Edge middleware for admin route protection |
| `src/app/(admin)/admin/verify-2fa/page.tsx` | TOTP verification page during login |
| `src/components/admin/two-factor-setup.tsx` | 2FA setup UI component (QR + verify) |
| `src/components/admin/change-password-form.tsx` | Password change form component |

### Modified Files
| File | Change |
|---|---|
| `prisma/schema.prisma` | Add `twoFactorSecret` and `twoFactorEnabled` to User |
| `src/lib/auth.ts` | Extend JWT/session types, add `twoFactorPending` handling |
| `src/actions/auth.ts` | Add `changePassword`, `verify2faLogin`, `complete2faLogin` actions |
| `src/app/(admin)/admin/(protected)/settings/page.tsx` | Add 2FA + change password sections |
| `package.json` | Add `otplib` and `qrcode` dependencies |

---

## Security Considerations

- **TOTP secret** stored in database. If DB is compromised, attacker gets secrets. Mitigation: secrets are useless without the password, and vice versa.
- **Rate limiting** on TOTP verification: 5 attempts per 15 min per session
- **No backup codes** in initial version (add if needed)
- **Session update** for 2FA completion uses NextAuth's built-in `update()` mechanism — no custom endpoint
- **Middleware** runs on Vercel Edge Runtime — no cold start latency for auth checks

---

## Out of Scope (v1)

- Backup codes
- Remember device (skip 2FA for N days)
- SMS/email 2FA fallback
- Multiple admin users (single admin for now)
- 2FA recovery/disable via email
