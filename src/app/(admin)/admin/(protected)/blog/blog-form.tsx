"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BlogFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string | null;
    coverImage?: string | null;
    published?: boolean;
  };
}

export function BlogForm({ action, defaultValues }: BlogFormProps) {
  const formAction = action;

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={defaultValues?.title || ""} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={defaultValues?.slug || ""} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Input id="excerpt" name="excerpt" defaultValue={defaultValues?.excerpt || ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover Image URL</Label>
        <Input id="coverImage" name="coverImage" defaultValue={defaultValues?.coverImage || ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" defaultValue={defaultValues?.content || ""} rows={12} required />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={defaultValues?.published} />
        Published
      </label>
      <Button type="submit">Save</Button>
    </form>
  );
}
