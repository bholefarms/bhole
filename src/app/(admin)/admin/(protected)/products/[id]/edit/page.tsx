import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../../product-form";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <PageContainer>
      <Breadcrumbs />
      <PageHeader title={`Edit: ${product.name}`} description="Update product details" />
      <ProductForm
        categories={categories}
        productId={product.id}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.price ? Number(product.price) : undefined,
          categoryId: product.categoryId,
          unit: product.unit || undefined,
          sku: product.sku || undefined,
          isFeatured: product.isFeatured,
          isSeasonal: product.isSeasonal,
          isActive: product.isActive,
          season: product.season,
          stock: product.stock,
          images: product.images.map((img) => ({
            path: img.imagePath,
            id: img.id,
          })),
        }}
      />
    </PageContainer>
  );
}
