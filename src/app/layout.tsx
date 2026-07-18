import type { Metadata } from "next";
import { Playfair_Display, Inter, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = process.env.AUTH_URL || "https://www.bholefarms.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Bhole Farms | Organic Mangoes, Alphonso & Seasonal Fruits in Maharashtra`,
    template: `%s | Bhole Farms`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/icon.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    shortcut: "/icon48.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: `Bhole Farms | Organic Mangoes, Alphonso & Seasonal Fruits in Maharashtra`,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    url: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
