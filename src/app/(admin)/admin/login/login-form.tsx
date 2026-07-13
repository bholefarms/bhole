"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/actions/auth";

export function LoginForm() {
  const router = useRouter();

  async function authenticate(_prev: string | undefined, formData: FormData) {
    const result = await login(formData);
    if (result === "success") {
      router.push("/admin/dashboard");
      router.refresh();
    }
    return result;
  }

  const [state, formAction, pending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {state && state !== "success" && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
