import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBlogPost } from "@/actions/blog";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold leading-tight">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 h-10"
        >
          New Post
        </Link>
      </div>
      <div className="rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border">
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${post.published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/blog/${post.id}/edit`} className="text-primary hover:underline mr-3">
                    Edit
                  </Link>
                  <form action={deleteBlogPost.bind(null, post.id)} className="inline">
                    <button type="submit" className="text-destructive hover:underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
