import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";
import { getSettings } from "@/lib/settings";
import { Logo } from "./logo";

export async function Footer() {
  const settings = await getSettings();
  return (
    <footer className="w-full border-t border-border bg-secondary text-secondary-foreground">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <Logo name={settings.site_name} size="md" />
          <p className="mt-2 text-sm text-muted-foreground">
            {settings.site_description}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Quick Links</h4>
          <ul className="mt-2 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-foreground transition-colors"
              >
                WhatsApp: {settings.contact_phone}
              </a>
            </li>
            <li>Email: {settings.contact_email}</li>
            <li>{settings.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-muted/20 py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {settings.site_name}. All rights reserved.
      </div>
    </footer>
  );
}
