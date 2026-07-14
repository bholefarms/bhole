import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GalleryForm } from "../../gallery-form";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

interface EditGalleryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGalleryPage({ params }: EditGalleryPageProps) {
  const { id } = await params;
  const item = await prisma.galleryItem.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });

  if (!item) notFound();

  return (
    <PageContainer>
      <PageHeader title="Edit Gallery Item" description="Update your gallery item" />
      <GalleryForm
        itemId={id}
        defaultValues={{
          title: item.title || undefined,
          slug: item.slug || undefined,
          description: item.description || undefined,
          category: item.category || undefined,
          order: item.order,
          images: item.images.map((img) => ({
            path: `/${img.imagePath}`,
            id: img.id,
          })),
        }}
      />
    </PageContainer>
  );
}
