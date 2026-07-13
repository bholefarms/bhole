import { createBlogPost } from "@/actions/blog";
import { BlogForm } from "../blog-form";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">New Blog Post</h1>
      <BlogForm action={createBlogPost} />
    </div>
  );
}
