import { prisma } from "@/lib/prisma";
import { createProduct } from "@/actions/products";
import { ProductForm } from "../product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">New Product</h1>
      <ProductForm categories={categories} action={createProduct} />
    </div>
  );
}
