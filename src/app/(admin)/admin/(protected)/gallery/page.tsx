import { prisma } from "@/lib/prisma";
import { createGalleryItem, deleteGalleryItem } from "@/actions/gallery";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">Gallery</h1>
      </div>
      <form action={createGalleryItem} className="grid gap-4 max-w-lg grid-cols-2">
        <input name="title" placeholder="Title" className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <input name="category" placeholder="Category" className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <input name="image" placeholder="Image URL" required className="col-span-2 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <button type="submit" className="col-span-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Add Image
        </button>
      </form>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-border bg-card overflow-hidden">
            <img src={item.image} alt={item.title || ""} className="aspect-square w-full object-cover" />
            <div className="p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.title || "Untitled"}</p>
                {item.category && <p className="text-xs text-muted-foreground">{item.category}</p>}
              </div>
              <form action={deleteGalleryItem.bind(null, item.id)}>
                <button type="submit" className="text-xs text-destructive hover:underline">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-center text-muted-foreground">No gallery items yet.</p>}
    </div>
  );
}
