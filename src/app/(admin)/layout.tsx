import { SessionProvider } from "@/components/session-provider";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F8F5]">
      <SessionProvider>{children}</SessionProvider>
    </div>
  );
}
