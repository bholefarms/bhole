import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateBlogPost } from "@/actions/blog";
import { BlogForm } from "../../blog-form";
import { PageContainer } from "@/components/admin/page-container";
import { PageHeader } from "@/components/admin/page-header";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <PageContainer>
      <Breadcrumbs />
      <PageHeader title={`Edit: ${post.title}`} description="Update your blog post" />
      <BlogForm
        action={updateBlogPost.bind(null, id)}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
          published: post.published,
        }}
      />
    </PageContainer>
  );
}
