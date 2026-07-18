"use server";

import { OTP } from "otplib";
import QRCode from "qrcode";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const authenticator = new OTP();

export async function enable2fa() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const secret = authenticator.generateSecret();
  const service = "Bhole Farms";
  const otpauth = authenticator.generateURI({
    issuer: service,
    label: session.user.email || "admin",
    secret,
  });
  const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

  return { secret, qrCodeDataUrl };
}

export async function verify2faSetup(secret: string, token: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const verification = await authenticator.verify({ token, secret });
    if (!verification.valid) return { error: "Invalid code. Try again." };

    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorSecret: secret, twoFactorEnabled: true },
    });

    return { success: true };
  } catch {
    return { error: "Verification failed. Try again." };
  }
}

export async function disable2fa() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorSecret: null, twoFactorEnabled: false },
  });

  return { success: true };
}

export async function verify2faLogin(token: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorSecret: true },
  });

  if (!user?.twoFactorSecret) return { error: "2FA not configured" };

  try {
    const verification = await authenticator.verify({
      token,
      secret: user.twoFactorSecret,
    });
    if (!verification.valid) return { error: "Invalid code. Try again." };

    return { success: true };
  } catch {
    return { error: "Verification failed. Try again." };
  }
}
