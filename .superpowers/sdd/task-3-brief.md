# Task 3: Edge Middleware

**Goal:** Create `src/middleware.ts` using NextAuth.js v5's `auth()` wrapper to protect `/admin/*` routes at the edge.

## Files to create
- `src/middleware.ts`

## Details
Create middleware that:
1. Uses NextAuth.js v5 auth() wrapper: `export default auth((req) => { ... })`
2. Allows `/admin/login` and `/admin/verify-2fa` without session
3. If no session → redirect to `/admin/login?callbackUrl={path}`
4. If session has `user.twoFactorPending` → redirect to `/admin/verify-2fa`
5. Otherwise → allow (call `NextResponse.next()`)
6. Matcher: `/admin/:path*`

## Global constraints
- Must work on Vercel Edge Runtime (no Node.js-specific APIs)
- NextAuth.js v5 beta API patterns
- TypeScript strict

## Commits
- `feat: add edge middleware to protect /admin/* routes with 2FA gate`
