"use client";

import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { verify2faLogin } from "@/actions/2fa";
import { ShieldAlert } from "lucide-react";

export default function Verify2FAPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((d) => d) && newCode.join("").length === 6) {
      submitCode(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitCode = async (token: string) => {
    setLoading(true);
    setError("");

    const result = await verify2faLogin(token, session?.user?.id || "");
    if (result.error) {
      setError(result.error);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setLoading(false);
      return;
    }

    await update({ twoFactorVerified: true });
    router.push("/admin/dashboard");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const token = code.join("");
    if (token.length === 6) submitCode(token);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F8F5] px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-100">
            <ShieldAlert className="size-7 text-amber-600" />
          </div>
          <h1 className="text-xl font-semibold">Two-Factor Authentication</h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center gap-2">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="size-12 rounded-lg border border-input bg-background text-center text-xl font-bold shadow-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                autoFocus={i === 0}
                disabled={loading}
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-sm font-medium text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || code.some((d) => !d)}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Open your authenticator app and enter the code shown for Bhole Farms
        </p>
      </div>
    </div>
  );
}
