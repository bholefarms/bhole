# Task 5: Change Password Action

**Goal:** Create server action for admin password change.

## Files to create
- `src/actions/account.ts`

## Server Action Required

### `changePassword(currentPassword: string, newPassword: string)`
1. Check admin session
2. Find user by session.id, select hashedPassword
3. Verify current password with bcrypt.compare
4. Validate new password: min 8 chars, at least one letter + one number
5. Hash new password with bcrypt (salt rounds 12)
6. Update user record
7. Return `{ success: true }` or `{ error: string }`

## Global constraints
- bcryptjs for hashing (salt rounds 12)
- TypeScript strict

## Commits
- `feat: add change password server action`
