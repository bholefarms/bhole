"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { hashedPassword: true },
  });

  if (!user) return { error: "User not found" };

  const isValid = await bcrypt.compare(currentPassword, user.hashedPassword);
  if (!isValid) return { error: "Current password is incorrect" };

  if (newPassword.length < 8) return { error: "New password must be at least 8 characters" };
  if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    return { error: "New password must contain at least one letter and one number" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { hashedPassword },
  });

  return { success: true };
}
