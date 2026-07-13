import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EnquiryForm } from "./enquiry-form";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <span>←</span> Back to Products
      </Link>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="animate-fade-in-up rounded-2xl overflow-hidden bg-muted shadow-lg">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
              <span className="text-6xl">🌿</span>
            </div>
          )}
        </div>
        <div className="animate-fade-in-up animate-delay-1">
          <h1 className="text-3xl font-heading font-bold md:text-4xl">{product.name}</h1>
          {product.price && (
            <p className="mt-3 text-2xl font-bold text-primary">₹{product.price}</p>
          )}
          {product.description && (
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {product.isFeatured && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Featured
              </span>
            )}
            {product.isSeasonal && product.season && (
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-foreground">
                Seasonal: {product.season}
              </span>
            )}
          </div>
          <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-heading font-semibold">Enquire About This Product</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in your details and we&apos;ll get back to you
            </p>
            <div className="mt-4">
              <EnquiryForm productId={product.id} productName={product.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
