# Task 7: 2FA Setup Component

**Goal:** Create UI component for enabling/disabling 2FA in admin settings.

## Files to create
- `src/components/admin/two-factor-setup.tsx`

## Component Details

A "use client" component that shows:
- Current 2FA status (enabled/disabled) with shield icon
- Enable button / Disable button
- When enabling: QR code display, manual secret key (with copy button), verification input
- Error state for failed verification

## Props
- `isEnabled: boolean` — current 2FA status from DB

## Server Actions Used
- `enable2fa()` from `@/actions/2fa` → returns `{ secret, qrCodeDataUrl }`
- `verify2faSetup(secret, token)` → returns `{ success }` or `{ error }`
- `disable2fa()` → returns `{ success }`

## Global constraints
- TypeScript strict
- Use Tailwind CSS classes
- Use lucide-react icons (Shield, ShieldOff, Copy, Check)

## Commits
- `feat: add 2FA setup component with QR code and verification`
