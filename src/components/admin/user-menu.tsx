"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  name: string;
  email?: string;
  avatarUrl?: string;
  onSignOut: () => void;
  className?: string;
}

export function UserMenu({ name, email, avatarUrl, onSignOut, className }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex size-9 items-center justify-center rounded-lg hover:bg-muted transition-colors"
        aria-label="User menu"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="size-8 rounded-full object-cover" />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </div>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border bg-popover py-1 shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="border-b px-3 py-2.5">
            <p className="text-sm font-medium">{name}</p>
            {email && <p className="text-xs text-muted-foreground mt-0.5">{email}</p>}
          </div>
          <Link
            href="/admin/settings"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <User className="size-4 text-muted-foreground" />
            Profile
          </Link>
          <Link
            href="/admin/settings"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Settings className="size-4 text-muted-foreground" />
            Settings
          </Link>
          <div className="my-1 border-t" />
          <button
            onClick={onSignOut}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
