import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateBlogPost } from "@/actions/blog";
import { BlogForm } from "../../blog-form";

export const dynamic = "force-dynamic";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const updateWithId = updateBlogPost.bind(null, id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Edit Blog Post</h1>
      <BlogForm
        action={updateWithId}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
          published: post.published,
        }}
      />
    </div>
  );
}
