import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProduct, toggleActive } from "@/actions/products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    include: {
      category: true,
      images: { where: { isThumbnail: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold leading-tight">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 h-10"
        >
          Add Product
        </Link>
      </div>
      <div className="rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Image</th>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-left font-medium">Unit</th>
              <th className="px-4 py-3 text-left font-medium">Active</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="px-4 py-3">
                  {p.images[0] ? (
                    <img
                      src={p.images[0].imagePath}
                      alt={p.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-muted" />
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category.name}</td>
                <td className="px-4 py-3">{p.price ? `₹${Number(p.price)}` : "-"}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.unit || "-"}</td>
                <td className="px-4 py-3">
                  <form action={toggleActive.bind(null, p.id)}>
                    <button
                      type="submit"
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-primary hover:underline mr-3"
                  >
                    Edit
                  </Link>
                  <form action={deleteProduct.bind(null, p.id)} className="inline">
                    <button type="submit" className="text-destructive hover:underline">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-4 text-center text-muted-foreground">No products yet.</p>
        )}
      </div>
    </div>
  );
}
