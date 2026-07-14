import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateOrderStatus } from "@/actions/orders";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { StatusBadge } from "@/components/admin/status-badge";
import { InfoCard } from "@/components/admin/info-card";
import { CardSection } from "@/components/admin/card-section";
import { ActivityTimeline } from "@/components/admin/activity-timeline";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  Phone,
  Mail,
  MessageSquare,
  User,
  Calendar,
  ExternalLink,
  ArrowLeft,
  Package,
} from "lucide-react";

export const dynamic = "force-dynamic";

const statusColor: Record<string, "pending" | "contacted" | "completed" | "cancelled"> = {
  PENDING: "pending",
  CONTACTED: "contacted",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { product: { include: { images: { where: { isThumbnail: true }, take: 1 } } } },
  });

  if (!order) notFound();

  const orderPhases = [
    { status: "PENDING", label: "Order Placed" },
    { status: "CONTACTED", label: "Customer Contacted" },
    { status: "COMPLETED", label: "Order Completed" },
    { status: "CANCELLED", label: "Order Cancelled" },
  ];

  const currentIndex = orderPhases.findIndex((p) => p.status === order.status);
  const timelineEvents = orderPhases.map((phase, i) => ({
    id: phase.status,
    title: phase.label,
    timestamp: i <= currentIndex ? "Completed" : "Pending",
    variant: (i < currentIndex ? "success" : i === currentIndex && order.status !== "CANCELLED" ? "success" : order.status === "CANCELLED" && i === 3 ? "danger" : "default") as "default" | "success" | "warning" | "danger",
  }));

  const whatsappUrl = `https://wa.me/${order.phone.replace(/[^0-9]/g, "")}?text=Hello ${order.customerName}, regarding your order at Bhole Farms.`;

  const statusOptions = ["PENDING", "CONTACTED", "COMPLETED", "CANCELLED"];

  return (
    <PageContainer>
      <Breadcrumbs />

      <PageHeader title={`Order #${order.id.slice(0, 8)}`}>
        <div className="flex items-center gap-2">
          <StatusBadge variant={statusColor[order.status] || "default"} label={order.status} />
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </Link>
        </div>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <CardSection title="Order Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                label="Customer"
                value={order.customerName}
                icon={<User className="size-4" />}
              />
              <InfoCard
                label="Phone"
                value={
                  <a href={`tel:${order.phone}`} className="text-primary hover:underline">
                    {order.phone}
                  </a>
                }
                icon={<Phone className="size-4" />}
              />
              {order.email && (
                <InfoCard
                  label="Email"
                  value={
                    <a href={`mailto:${order.email}`} className="text-primary hover:underline">
                      {order.email}
                    </a>
                  }
                  icon={<Mail className="size-4" />}
                />
              )}
              <InfoCard
                label="Order Date"
                value={formatDate(order.createdAt)}
                icon={<Calendar className="size-4" />}
              />
              <InfoCard
                label="Quantity"
                value={order.quantity}
                icon={<Package className="size-4" />}
              />
            </div>
          </CardSection>

          {order.product && (
            <CardSection title="Product">
              <div className="flex items-start gap-4">
                {order.product.images[0] && (
                  <img
                    src={order.product.images[0].imagePath}
                    alt={order.product.name}
                    className="size-20 rounded-xl object-cover border"
                  />
                )}
                <div className="space-y-1">
                  <p className="font-semibold">{order.product.name}</p>
                  {order.product.price && (
                    <p className="text-sm text-muted-foreground">₹{Number(order.product.price)}</p>
                  )}
                  <Link
                    href={`/admin/products/${order.product.id}/edit`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    View Product <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>
            </CardSection>
          )}

          {order.message && (
            <CardSection title="Customer Message">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{order.message}</p>
            </CardSection>
          )}
        </div>

        <div className="space-y-6">
          <CardSection title="Update Status">
            <form action={updateOrderStatus.bind(null, order.id)} className="space-y-3">
              <select
                name="status"
                defaultValue={order.status}
                onChange={(e) => e.target.form?.requestSubmit()}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </form>
          </CardSection>

          <CardSection title="Contact Customer">
            <div className="space-y-2">
              <a
                href={`tel:${order.phone}`}
                className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <Phone className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Call {order.phone}</p>
                  <p className="text-xs text-muted-foreground">Direct phone call</p>
                </div>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-md bg-emerald-50 p-2 text-emerald-600">
                  <MessageSquare className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Send a message</p>
                </div>
              </a>
              {order.email && (
                <a
                  href={`mailto:${order.email}`}
                  className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="rounded-md bg-blue-50 p-2 text-blue-600">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Send Email</p>
                    <p className="text-xs text-muted-foreground">{order.email}</p>
                  </div>
                </a>
              )}
            </div>
          </CardSection>

          <CardSection title="Status Timeline">
            <ActivityTimeline events={timelineEvents} />
          </CardSection>
        </div>
      </div>
    </PageContainer>
  );
}
