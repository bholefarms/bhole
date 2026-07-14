import { revalidatePath } from "next/cache";

export function revalidateProduct(slug?: string) {
  revalidatePath("/");
  revalidatePath("/products");
  if (slug) revalidatePath(`/products/${slug}`);
  revalidatePath("/admin/products");
}

export function revalidateGallery() {
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export function revalidateHomepage() {
  revalidatePath("/");
}

export function revalidateCategories() {
  revalidatePath("/products");
  revalidatePath("/admin/categories");
}
