"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name?: string;
    slug?: string;
    description?: string | null;
    price?: number | null;
    categoryId?: string;
    isFeatured?: boolean;
    isSeasonal?: boolean;
    season?: string | null;
    stock?: number | null;
  };
}

export function ProductForm({ categories, action, defaultValues }: ProductFormProps) {
  const formAction = action;

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={defaultValues?.name || ""} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" defaultValue={defaultValues?.slug || ""} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={defaultValues?.description || ""} rows={4} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input id="price" name="price" type="number" step="0.01" defaultValue={defaultValues?.price?.toString() || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" name="stock" type="number" defaultValue={defaultValues?.stock?.toString() || ""} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={defaultValues?.categoryId || ""}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="" disabled>Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={defaultValues?.isFeatured} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isSeasonal" defaultChecked={defaultValues?.isSeasonal} />
          Seasonal
        </label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="season">Season</Label>
        <Input id="season" name="season" defaultValue={defaultValues?.season || ""} placeholder="e.g., Summer, Monsoon" />
      </div>
      <Button type="submit">Save Product</Button>
    </form>
  );
}
