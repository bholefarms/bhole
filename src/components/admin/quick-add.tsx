"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Plus, ShoppingBag, Image, FileText, FolderTree, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { href: "/admin/products/new", label: "New Product", icon: ShoppingBag },
  { href: "/admin/gallery", label: "New Gallery Item", icon: Image },
  { href: "/admin/blog/new", label: "New Blog Post", icon: FileText },
  { href: "/admin/categories", label: "New Category", icon: FolderTree },
  { href: "/admin/customers", label: "New Customer", icon: UserPlus, disabled: true },
];

export function QuickAdd() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button
        onClick={() => setOpen(!open)}
        size="sm"
        className="gap-1.5"
      >
        <Plus className="size-4" />
        <span className="hidden sm:inline">Quick Add</span>
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-xl border bg-popover py-1 shadow-lg animate-in fade-in-0 zoom-in-95">
          {quickLinks.map((item: typeof quickLinks[number]) => {
            const Icon = item.icon;
            return item.disabled ? (
              <span
                key={item.href}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed"
              >
                <Icon className="size-4" />
                {item.label}
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Icon className="size-4 text-muted-foreground" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
