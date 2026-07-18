# Task 4: 2FA Server Actions

**Goal:** Create server actions for 2FA enable/disable/verify flows.

## Files to create
- `src/actions/2fa.ts`

## Server Actions Required

### `enable2fa()`
- Check admin session
- Generate TOTP secret via `authenticator.generateSecret()` from otplib
- Generate otpauth URI: `authenticator.keyuri(email, "Bhole Farms", secret)`
- Generate QR code data URL: `QRCode.toDataURL(otpauth)`
- Return `{ secret, qrCodeDataUrl }` — does NOT save yet (saved after verification)

### `verify2faSetup(secret: string, token: string)`
- Check admin session
- Verify token against secret: `authenticator.verify({ token, secret })`
- If valid: save secret to user, set `twoFactorEnabled = true`
- Return `{ success: true }` or `{ error: string }`

### `disable2fa()`
- Check admin session
- Clear `twoFactorSecret` and set `twoFactorEnabled = false`
- Return `{ success: true }`

### `verify2faLogin(token: string)`
- Check admin session
- Fetch user's `twoFactorSecret` from DB
- Verify token: `authenticator.verify({ token, secret })`
- Return `{ success: true }` or `{ error: string }`

## Global constraints
- TypeScript strict
- All actions use `"use server"`
- Import authenticator from `otplib` and QRCode from `qrcode`
- Use `import { authenticator } from "otplib"`

## Commits
- `feat: add 2FA server actions (enable, verify setup, disable, verify login)`
