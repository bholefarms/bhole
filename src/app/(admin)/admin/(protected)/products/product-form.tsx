"use client";

import { useActionState, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProduct, updateProduct } from "@/actions/products";
import FilePondUpload from "@/components/FilePondUpload";
import { FormSection } from "@/components/admin/form-section";
import { CardSection } from "@/components/admin/card-section";

interface Category {
  id: string;
  name: string;
}

interface UploadedFile {
  id: string;
  path: string;
  isExisting?: boolean;
}

interface ProductFormProps {
  categories: Category[];
  productId?: string;
  defaultValues?: {
    name?: string;
    slug?: string;
    description?: string | null;
    shortDescription?: string | null;
    price?: number | null;
    categoryId?: string;
    unit?: string | null;
    sku?: string | null;
    isFeatured?: boolean;
    isSeasonal?: boolean;
    isActive?: boolean;
    season?: string | null;
    stock?: number | null;
    images?: { path: string; id?: string }[];
  };
}

const PRODUCT_UNITS = ["KG", "GRAM", "DOZEN", "BOX", "PIECE", "LITER", "ML", "BUNDLE"] as const;

export function ProductForm({ categories, productId, defaultValues }: ProductFormProps) {
  const action = productId ? updateProduct.bind(null, productId) : createProduct;
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedUnit, setSelectedUnit] = useState(defaultValues?.unit || "");
  const [selectedCategory, setSelectedCategory] = useState(defaultValues?.categoryId || "");

  const [, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      formData.set("unit", selectedUnit);
      formData.set("categoryId", selectedCategory);
      await action(formData);
    },
    undefined
  );

  const handleFilesChange = useCallback((files: UploadedFile[]) => {
    setUploadedFiles(files);
  }, []);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <CardSection title="Basic Information" description="Product name, description, and pricing">
        <div className="grid gap-4 md:grid-cols-2">
          <FormSection title="Name" className="space-y-2">
            <Input id="name" name="name" defaultValue={defaultValues?.name || ""} required />
          </FormSection>
          <FormSection title="Slug" className="space-y-2">
            <Input id="slug" name="slug" defaultValue={defaultValues?.slug || ""} required />
          </FormSection>
        </div>
        <FormSection title="Short Description" className="space-y-2">
          <Input id="shortDescription" name="shortDescription" defaultValue={defaultValues?.shortDescription || ""} maxLength={250} />
        </FormSection>
        <FormSection title="Description" className="space-y-2">
          <Textarea id="description" name="description" defaultValue={defaultValues?.description || ""} rows={4} />
        </FormSection>
      </CardSection>

      <CardSection title="Pricing & Inventory">
        <div className="grid gap-4 md:grid-cols-3">
          <FormSection title="Price (₹)" className="space-y-2">
            <Input id="price" name="price" type="number" step="0.01" defaultValue={defaultValues?.price?.toString() || ""} />
          </FormSection>
          <FormSection title="Stock" className="space-y-2">
            <Input id="stock" name="stock" type="number" defaultValue={defaultValues?.stock?.toString() || ""} />
          </FormSection>
          <FormSection title="SKU" className="space-y-2">
            <Input id="sku" name="sku" defaultValue={defaultValues?.sku || ""} />
          </FormSection>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormSection title="Unit" className="space-y-2">
            <Select value={selectedUnit} onValueChange={(v) => v && setSelectedUnit(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_UNITS.map((u) => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormSection>
          <FormSection title="Category" className="space-y-2">
            <Select value={selectedCategory} onValueChange={(v) => v && setSelectedCategory(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormSection>
        </div>
      </CardSection>

      <CardSection title="Flags & Seasonality">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="isFeatured" defaultChecked={defaultValues?.isFeatured} className="rounded border-input" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="isSeasonal" defaultChecked={defaultValues?.isSeasonal} className="rounded border-input" />
            Seasonal
          </label>
          {defaultValues?.isActive !== undefined && (
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="isActive" defaultChecked={defaultValues?.isActive} className="rounded border-input" />
              Active
            </label>
          )}
          <FormSection title="Season" className="space-y-2 flex-1 min-w-[200px]">
            <Input id="season" name="season" defaultValue={defaultValues?.season || ""} placeholder="e.g., Summer, Monsoon" />
          </FormSection>
        </div>
      </CardSection>

      <CardSection title="Images">
        <FilePondUpload
          existingImages={defaultValues?.images || []}
          onFilesChange={handleFilesChange}
          label="Product Images"
        />
      </CardSection>

      <input type="hidden" name="imagesData" value={JSON.stringify(uploadedFiles)} />
      <div className="flex justify-end">
        <Button type="submit" disabled={pending} size="lg">
          {pending ? "Saving..." : productId ? "Update Product" : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
