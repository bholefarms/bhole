import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsTabs } from "./settings-tabs";
import { TwoFactorSetup } from "@/components/admin/two-factor-setup";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export const dynamic = "force-dynamic";

const allKeys = [
  "site_name", "site_description", "hero_headline", "hero_subtext",
  "contact_phone", "contact_email", "whatsapp_number", "address",
  "seo_title", "seo_description", "seo_keywords",
];

const generalKeys = ["site_name", "site_description", "hero_headline", "hero_subtext"];
const contactKeys = ["contact_phone", "contact_email", "whatsapp_number", "address"];
const seoKeys = ["seo_title", "seo_description", "seo_keywords"];

export default async function AdminSettingsPage() {
  const session = await auth();

  const settings = await prisma.setting.findMany({
    where: { key: { in: allKeys } },
  });

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const pickKeys = (keys: string[]) =>
    Object.fromEntries(keys.map((k) => [k, settingsMap[k] || ""]));

  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { twoFactorEnabled: true },
      })
    : null;

  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage your site configuration" />
      <SettingsTabs
        generalSettings={pickKeys(generalKeys)}
        contactSettings={pickKeys(contactKeys)}
        seoSettings={pickKeys(seoKeys)}
      />
      <div className="mt-8 space-y-6 border-t pt-8">
        <div className="rounded-lg border bg-card p-6">
          <TwoFactorSetup isEnabled={user?.twoFactorEnabled ?? false} />
        </div>
        <div className="rounded-lg border bg-card p-6">
          <ChangePasswordForm />
        </div>
      </div>
    </PageContainer>
  );
}
