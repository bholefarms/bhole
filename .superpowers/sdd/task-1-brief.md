# Task 1: Prisma Schema & Dependencies

**Goal:** Add 2FA fields to User model and install otplib/qrcode dependencies.

## Files to modify
- `prisma/schema.prisma`
- `package.json`

## Steps
1. Add to User model in `prisma/schema.prisma` after `hashedPassword`:
   - `twoFactorSecret String?`
   - `twoFactorEnabled Boolean @default(false)`
2. Install packages: `npm install otplib qrcode`
3. Install types: `npm install -D @types/qrcode`
4. Run `npx prisma generate`
5. Run `npx prisma migrate dev --name add-2fa-fields`
6. Commit only: prisma/schema.prisma, package.json, package-lock.json, prisma/migrations/

## Global constraints
- Prisma 7.8 with @prisma/adapter-pg
- PostgreSQL (Supabase)
- TypeScript strict

## Commits
- `feat: add 2FA fields to User model and install otplib/qrcode`
