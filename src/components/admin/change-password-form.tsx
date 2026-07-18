"use client";

import { useState, type FormEvent } from "react";
import { changePassword } from "@/actions/account";
import { Lock, Eye, EyeOff } from "lucide-react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await changePassword(currentPassword, newPassword);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const PasswordInput = ({
    value,
    onChange,
    placeholder,
    show,
    toggleShow,
    id,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    show: boolean;
    toggleShow: () => void;
    id: string;
  }) => (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3">
        <Lock className="size-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Change Password</p>
          <p className="text-xs text-muted-foreground">Update your admin password</p>
        </div>
      </div>

      <div className="space-y-3 max-w-sm">
        <PasswordInput
          id="current-password"
          value={currentPassword}
          onChange={setCurrentPassword}
          placeholder="Current password"
          show={showCurrent}
          toggleShow={() => setShowCurrent(!showCurrent)}
        />
        <PasswordInput
          id="new-password"
          value={newPassword}
          onChange={setNewPassword}
          placeholder="New password (min 8 chars, letter + number)"
          show={showNew}
          toggleShow={() => setShowNew(!showNew)}
        />
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {error && <p className="text-sm text-destructive font-medium">{error}</p>}
      {success && <p className="text-sm text-green-600 font-medium">Password updated successfully.</p>}

      <button
        type="submit"
        disabled={loading || !currentPassword || !newPassword || !confirmPassword}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
