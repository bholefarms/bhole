import { prisma } from "@/lib/prisma";
import { updateSetting } from "@/actions/settings";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

const settingKeys = [
  "site_name", "site_description", "contact_phone", "contact_email",
  "whatsapp_number", "address", "hero_headline", "hero_subtext",
];

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany({
    where: { key: { in: settingKeys } },
  });

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Settings</h1>
      <SettingsForm settings={settingsMap} settingKeys={settingKeys} />
    </div>
  );
}
