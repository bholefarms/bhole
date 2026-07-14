"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Products",
  categories: "Categories",
  gallery: "Gallery",
  blog: "Blog",
  orders: "Orders",
  customers: "Customers",
  analytics: "Analytics",
  media: "Media Library",
  settings: "Settings",
  new: "New",
  edit: "Edit",
};

function segmentToLabel(segment: string): string {
  if (/^[0-9a-f]{8,}$/i.test(segment) || segment.length > 20) {
    return `#${segment.slice(0, 8)}`;
  }
  return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

interface BreadcrumbsProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const adminIndex = segments.indexOf("admin");
  const crumbs = adminIndex >= 0 ? segments.slice(adminIndex + 1) : [];

  if (crumbs.length === 0) return null;

  const breadcrumbs = crumbs.map((segment, i) => ({
    label: segmentToLabel(segment),
    href: i < crumbs.length - 1 ? "/admin/" + crumbs.slice(0, i + 1).join("/") : undefined,
  }));

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}>
      <Link href="/admin/dashboard" className="hover:text-foreground transition-colors">
        <Home className="size-4" />
      </Link>
      {breadcrumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="size-4 shrink-0" />
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-foreground transition-colors truncate max-w-[120px]">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium truncate max-w-[160px]">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
