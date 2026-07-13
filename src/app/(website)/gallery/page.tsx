import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold md:text-4xl">Gallery</h1>
        <p className="mt-2 text-muted-foreground">
          A glimpse into life at Bhole Farms
        </p>
      </div>
      <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="animate-fade-in-up mb-4 break-inside-avoid group relative rounded-xl overflow-hidden"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <img
              src={item.image}
              alt={item.title || "Gallery image"}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              {item.title && (
                <p className="text-sm font-semibold text-white">{item.title}</p>
              )}
              {item.category && (
                <p className="text-xs text-white/70">{item.category}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">
          Gallery coming soon!
        </p>
      )}
    </div>
  );
}
