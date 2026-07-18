# Task 3 Report

## What was done
- Added `src/middleware.ts` using the NextAuth v5 `auth()` wrapper.
- Allowed unauthenticated access to `/admin/login` and `/admin/verify-2fa`.
- Redirected unauthenticated admin requests to `/admin/login` with `callbackUrl`.
- Redirected sessions with `twoFactorPending` to `/admin/verify-2fa`.
- Configured the matcher for `/admin/:path*`.
- Verified with `npx tsc --noEmit`.

## Commit SHA
`7359db8`

## Issues
- TypeScript LSP diagnostics were unavailable because the TypeScript language server is not installed in this environment; `npx tsc --noEmit` completed successfully.
- Existing `src/proxy.ts` was left unchanged per the Task 3 file scope.
