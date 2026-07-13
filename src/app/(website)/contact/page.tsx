import { getSettings } from "@/lib/settings";
import { ContactForm } from "./contact-form";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-heading font-bold">Contact Us</h1>
      <p className="mt-2 text-muted-foreground">
        Get in touch with us. We&apos;d love to hear from you.
      </p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-heading font-semibold">
              Reach Out
            </h2>
            <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Phone:</span>{" "}
                {settings.contact_phone}
              </li>
              <li>
                <span className="font-medium text-foreground">Email:</span>{" "}
                {settings.contact_email}
              </li>
              <li>
                <span className="font-medium text-foreground">WhatsApp:</span>{" "}
                <a
                  href={`https://wa.me/${settings.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Chat with us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold">Visit Us</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {settings.address}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-heading font-semibold">
              Bulk Enquiries
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              For wholesale orders and bulk purchases, please reach out to us
              via phone or WhatsApp. We supply to restaurants, stores, and
              businesses across Maharashtra.
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-heading font-semibold">Send a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
