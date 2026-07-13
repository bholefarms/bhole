import { prisma } from "@/lib/prisma";
import { updateSetting } from "@/actions/settings";
import { SettingsForm } from "../settings/settings-form";

export const dynamic = "force-dynamic";

const seoKeys = [
  "seo_title", "seo_description", "seo_keywords",
];

export default async function AdminSEOPage() {
  const settings = await prisma.setting.findMany({
    where: { key: { in: seoKeys } },
  });

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">SEO</h1>
      <p className="text-sm text-muted-foreground">
        Manage SEO settings for the website.
      </p>
      <SettingsForm settings={settingsMap} settingKeys={seoKeys} />
    </div>
  );
}
