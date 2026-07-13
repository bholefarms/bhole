import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold md:text-4xl">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Stories and updates from Bhole Farms
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="animate-fade-in-up group rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
            style={{ animationDelay: `${i * 0.05}s` }}
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
              <h2 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">
                {post.title}
              </h2>
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
      {posts.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">
          No blog posts yet. Check back soon!
        </p>
      )}
    </div>
  );
}
