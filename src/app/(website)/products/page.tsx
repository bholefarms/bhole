import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold md:text-4xl">Our Products</h1>
        <p className="mt-2 text-muted-foreground">
          Fresh organic produce straight from our farm
        </p>
      </div>

      {categories.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="rounded-full border border-border px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="animate-fade-in-up group rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="aspect-square bg-muted overflow-hidden">
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                  <span className="text-4xl">🌿</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              {product.price && (
                <p className="mt-1 text-lg font-bold text-primary">₹{product.price}</p>
              )}
              {product.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">
          No products available yet. Check back soon!
        </p>
      )}
    </div>
  );
}
