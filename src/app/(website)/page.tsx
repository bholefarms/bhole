import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

const HERO_IMG = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80";
const STORY_IMG = "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80";

const badges = [
  { label: "100% Organic", icon: "🌱", desc: "Certified organic farming practices" },
  { label: "Chemical Free", icon: "🧪", desc: "No synthetic pesticides or fertilizers" },
  { label: "Farm Fresh", icon: "🌿", desc: "Harvested and delivered same day" },
  { label: "Family Owned", icon: "👨‍👩‍👧‍👦", desc: "Generations of farming tradition" },
];

export default async function HomePage() {
  const [featuredProducts, latestPosts, testimonials, settings] = await Promise.all([
    prisma.product.findMany({ where: { isFeatured: true }, take: 6 }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" }, take: 4 }),
    getSettings(),
  ]);

  return (
    <>
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="animate-fade-in-up text-5xl font-heading font-bold text-white md:text-7xl leading-tight">
            {settings.hero_headline}
          </h1>
          <p className="animate-fade-in-up animate-delay-1 mx-auto mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
            {settings.hero_subtext}
          </p>
          <div className="animate-fade-in-up animate-delay-2 mt-10 flex justify-center gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
            >
              Browse Products
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border-2 border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/50 transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <section className="relative -mt-16 z-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 md:grid-cols-4">
            {badges.map((badge, i) => (
              <div
                key={badge.label}
                className="animate-fade-in-up animate-delay-3 rounded-xl bg-card p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-border/50"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <span className="text-3xl">{badge.icon}</span>
                <h3 className="mt-3 font-heading font-semibold text-foreground">
                  {badge.label}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-heading font-bold md:text-4xl">Featured Products</h2>
              <p className="mt-2 text-muted-foreground">
                Our freshest organic produce, straight from the farm
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featuredProducts.map((product, i) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="animate-fade-in-up group rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="aspect-square bg-muted overflow-hidden">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/5 to-accent/5">
                        <span className="text-4xl">🌿</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">
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
            <div className="mt-10 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20"
              >
                View All Products
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="bg-card py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 items-center md:grid-cols-2">
            <div className="animate-fade-in-up">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={STORY_IMG}
                  alt="Our Farm"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="animate-fade-in-up animate-delay-1">
              <h2 className="text-3xl font-heading font-bold md:text-4xl">Our Story</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Bhole Farms is a family-run organic farm nestled in the heart of
                Maharashtra. For generations, we have cultivated the land with
                respect for nature, producing fresh, chemical-free fruits,
                vegetables, and grains.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                We believe in farm-to-table transparency and bringing the goodness
                of pure, organic produce to your home. Every seed is sown with
                care, every crop is nurtured naturally.
              </p>
              <div className="mt-6">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Learn more about us <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-heading font-bold md:text-4xl">What Our Customers Say</h2>
              <p className="mt-2 text-muted-foreground">
                Hear from our happy customers
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {testimonials.map((t, i) => (
                <div
                  key={t.id}
                  className="animate-fade-in-up rounded-xl border border-border bg-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  {t.rating && (
                    <div className="mt-3 flex gap-0.5">
                      {Array.from({ length: t.rating }, (_, k) => (
                        <span key={k} className="text-amber-400 text-sm">★</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {latestPosts.length > 0 && (
        <section className="bg-gradient-to-b from-card to-background py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-heading font-bold md:text-4xl">From the Farm</h2>
              <p className="mt-2 text-muted-foreground">
                Stories, updates, and tips from Bhole Farms
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {latestPosts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="animate-fade-in-up group rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {post.coverImage ? (
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <span className="text-3xl">🌾</span>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <p className="mt-3 text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20"
              >
                Read All Posts
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/80" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-white md:text-4xl">
            Bulk Orders &amp; Wholesale Enquiries
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Supplying restaurants, stores, and businesses across Maharashtra.
            Get in touch for custom pricing and volume discounts.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-primary hover:bg-white/90 hover:-translate-y-0.5 transition-all shadow-lg"
            >
              Contact Us
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border-2 border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/50 transition-all"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
