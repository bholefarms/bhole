import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../../product-form";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Edit Product</h1>
      <ProductForm
        productId={id}
        categories={categories}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.price ? Number(product.price) : null,
          categoryId: product.categoryId,
          unit: product.unit,
          sku: product.sku,
          isFeatured: product.isFeatured,
          isSeasonal: product.isSeasonal,
          isActive: product.isActive,
          season: product.season,
          stock: product.stock,
          images: product.images.map((img) => ({
            path: `/${img.imagePath}`,
            id: img.id,
          })),
        }}
      />
    </div>
  );
}
