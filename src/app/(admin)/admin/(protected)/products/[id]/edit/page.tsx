import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/actions/products";
import { ProductForm } from "../../product-form";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Edit Product</h1>
      <ProductForm
        categories={categories}
        action={updateWithId}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          isFeatured: product.isFeatured,
          isSeasonal: product.isSeasonal,
          season: product.season,
          stock: product.stock,
        }}
      />
    </div>
  );
}
