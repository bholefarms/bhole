"use server";

import { signIn, signOut } from "@/lib/auth";

export async function login(formData: FormData) {
  try {
    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });
    if (result?.error) return "Invalid email or password";
    return "success";
  } catch {
    return "Something went wrong. Please try again.";
  }
}

export async function logout() {
  await signOut();
}
