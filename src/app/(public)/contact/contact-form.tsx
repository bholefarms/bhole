"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

async function submitContact(
  _prev: string | undefined,
  formData: FormData
) {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return data?.error || "Something went wrong. Please try again.";
    }
    return "success";
  } catch (err) {
    return err instanceof Error ? err.message : "Something went wrong. Please try again.";
  }
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, undefined);

  if (state === "success") {
    return (
      <div className="rounded-md bg-primary/10 p-4 text-sm text-primary">
        Thank you for your message! We&apos;ll get back to you shortly.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
          <Input id="name" name="name" required placeholder="Your full name" className="rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
          <Input id="email" name="email" type="email" required placeholder="Your email address" className="rounded-lg" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
        <Input id="phone" name="phone" type="tel" placeholder="Your phone number" className="rounded-lg" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
        <Input id="subject" name="subject" placeholder="How can we help you?" className="rounded-lg" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
        <Textarea id="message" name="message" required rows={4} placeholder="Write your message here..." className="rounded-lg resize-none" />
      </div>
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
        <Button
          type="submit"
          disabled={pending}
          className="w-full sm:w-auto rounded-lg bg-[#1B5E20] hover:bg-[#2E7D32] px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {pending ? (
            "Sending..."
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              Send Message
            </>
          )}
        </Button>
        <div className="flex-1 flex items-center gap-2 rounded-xl bg-[#F4FAF4] border border-[#E2F0E2] px-4 py-2 w-full">
          <svg className="w-5 h-5 text-[#1B5E20] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <div className="text-left">
            <p className="text-xs font-bold text-foreground">100% Privacy Guaranteed</p>
            <p className="text-[10px] text-muted-foreground">Your information is safe with us.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
