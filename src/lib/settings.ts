import { cache } from "react";
import { prisma } from "./prisma";

export type SiteSettings = {
  site_name: string;
  site_description: string;
  contact_phone: string;
  contact_email: string;
  whatsapp_number: string;
  address: string;
  hero_headline: string;
  hero_subtext: string;
};

const defaults: SiteSettings = {
  site_name: "Bhole Farms",
  site_description: "Fresh organic produce from farm to table",
  contact_phone: "+91XXXXXXXXXX",
  contact_email: "hello@bholefarms.com",
  whatsapp_number: "91XXXXXXXXXX",
  address: "Bhole Farms, Maharashtra",
  hero_headline: "Fresh from Our Farm to Your Table",
  hero_subtext: "100% organic produce grown with care in Maharashtra",
};

const keys: (keyof SiteSettings)[] = [
  "site_name", "site_description", "contact_phone", "contact_email",
  "whatsapp_number", "address", "hero_headline", "hero_subtext",
];

export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: keys } },
    });
    const map = new Map(rows.map((r) => [r.key, r.value]));
    const settings = { ...defaults };
    for (const key of keys) {
      if (map.has(key)) settings[key] = map.get(key) as string;
    }
    return settings;
  } catch {
    return defaults;
  }
});
