"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSetting } from "@/actions/settings";

interface SettingsFormProps {
  settings: Record<string, string>;
  settingKeys: string[];
}

const settingLabels: Record<string, string> = {
  site_name: "Site Name",
  site_description: "Site Description",
  contact_phone: "Contact Phone",
  contact_email: "Contact Email",
  whatsapp_number: "WhatsApp Number",
  address: "Address",
  hero_headline: "Hero Headline",
  hero_subtext: "Hero Subtext",
};

export function SettingsForm({ settings, settingKeys }: SettingsFormProps) {
  const [, formAction, pending] = useActionState(
    async (_: unknown, formData: FormData) => {
      for (const key of settingKeys) {
        const value = formData.get(key) as string;
        if (value !== undefined) {
          await updateSetting(key, value);
        }
      }
    },
    undefined
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {settingKeys.map((key) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{settingLabels[key] || key}</Label>
          <Input
            key={`${key}-${settings[key] || ""}`}
            id={key}
            name={key}
            defaultValue={settings[key] || ""}
          />
        </div>
      ))}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
