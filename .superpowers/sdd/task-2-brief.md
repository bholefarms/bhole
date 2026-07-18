# Task 2: Extend Auth Types and JWT Flow

**Goal:** Extend JWT/session types with twoFactorPending flag and update auth callbacks.

## Files to modify
- `src/lib/auth-types.d.ts`
- `src/lib/auth.ts`

## Steps
1. Edit `src/lib/auth-types.d.ts`:
   - Add `twoFactorEnabled?: boolean` to `User` interface
   - Add `twoFactorPending?: boolean` to `Session.user` interface
   - Keep existing `role?`, `id?` fields

2. Edit `src/lib/auth.ts`:
   - In `jwt()` callback, add handling for `user.twoFactorEnabled` on sign-in (set `token.twoFactorPending = true`)
   - In `jwt()` callback, add handling for `trigger === "update"` with `session?.twoFactorVerified` (delete `token.twoFactorPending`)
   - In `session()` callback, pass `token.twoFactorPending` to `session.user.twoFactorPending`
   - In `authorize()`, include `twoFactorEnabled` from DB in returned user object

3. Commit

## Global constraints
- NextAuth.js v5 beta API patterns
- TypeScript strict
- JWT strategy (no DB sessions)

## Commits
- `feat: extend JWT/session with twoFactorPending flag for 2FA flow`
