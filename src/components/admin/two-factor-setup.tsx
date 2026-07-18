"use client";

import { useState } from "react";
import { enable2fa, verify2faSetup, disable2fa } from "@/actions/2fa";
import { Shield, ShieldOff, Copy, Check } from "lucide-react";

interface TwoFactorSetupProps {
  isEnabled: boolean;
}

export function TwoFactorSetup({ isEnabled: initiallyEnabled }: TwoFactorSetupProps) {
  const [enabled, setEnabled] = useState(initiallyEnabled);
  const [showSetup, setShowSetup] = useState(false);
  const [secret, setSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEnable = async () => {
    setLoading(true);
    setError("");
    const result = await enable2fa();
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setSecret(result.secret);
    setQrCode(result.qrCodeDataUrl);
    setShowSetup(true);
    setLoading(false);
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) return;
    setLoading(true);
    setError("");
    const result = await verify2faSetup(secret, verificationCode);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setEnabled(true);
    setShowSetup(false);
    setVerificationCode("");
    setLoading(false);
  };

  const handleDisable = async () => {
    if (!confirm("Are you sure you want to disable 2FA? Your account will be less secure.")) return;
    setLoading(true);
    setError("");
    await disable2fa();
    setEnabled(false);
    setSecret("");
    setQrCode("");
    setLoading(false);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showSetup) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrCode} alt="2FA QR Code" className="size-48 rounded-lg border" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <code className="rounded-md bg-muted px-3 py-1.5 text-xs font-mono">{secret}</code>
          <button onClick={copySecret} className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors">
            {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground">Can&apos;t scan? Enter this key manually.</p>
        <div className="space-y-2">
          <label className="text-sm font-medium">Verify code</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-lg font-mono tracking-widest text-center outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleVerify}
              disabled={verificationCode.length !== 6 || loading}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? "..." : "Verify"}
            </button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {enabled ? (
            <Shield className="size-5 text-green-600" />
          ) : (
            <ShieldOff className="size-5 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium">Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground">
              {enabled ? "Your account is protected with 2FA" : "Add an extra layer of security to your account"}
            </p>
          </div>
        </div>
        {enabled ? (
          <button
            onClick={handleDisable}
            disabled={loading}
            className="rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/5 disabled:opacity-50 transition-colors"
          >
            Disable
          </button>
        ) : (
          <button
            onClick={handleEnable}
            disabled={loading}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            Enable
          </button>
        )}
      </div>
    </div>
  );
}
