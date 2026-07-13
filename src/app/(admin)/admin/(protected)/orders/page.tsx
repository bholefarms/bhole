import { prisma } from "@/lib/prisma";
import { updateOrderStatus, deleteOrder } from "@/actions/orders";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Orders</h1>
      <div className="rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Customer</th>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Qty</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border">
                <td className="px-4 py-3">
                  <p>{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.phone}</p>
                </td>
                <td className="px-4 py-3">{order.product?.name || "-"}</td>
                <td className="px-4 py-3">{order.quantity}</td>
                <td className="px-4 py-3">
                  <form action={updateOrderStatus.bind(null, order.id)}>
                    <select
                      name="status"
                      defaultValue={order.status}
                      onChange={(e) => { e.target.form?.requestSubmit(); }}
                      className="rounded border border-border bg-background px-2 py-1 text-xs"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </form>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteOrder.bind(null, order.id)} className="inline">
                    <button type="submit" className="text-destructive hover:underline text-xs">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-4 text-center text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
