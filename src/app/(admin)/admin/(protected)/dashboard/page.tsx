import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const [productCount, orderCount, blogCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.blogPost.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {session?.user?.name}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Products</p>
          <p className="text-3xl font-bold">{productCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Orders</p>
          <p className="text-3xl font-bold">{orderCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Blog Posts</p>
          <p className="text-3xl font-bold">{blogCount}</p>
        </div>
      </div>
    </div>
  );
}
