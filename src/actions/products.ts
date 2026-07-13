"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string) || null;
  const categoryId = formData.get("categoryId") as string;
  const isFeatured = formData.get("isFeatured") === "on";
  const isSeasonal = formData.get("isSeasonal") === "on";
  const season = formData.get("season") as string;
  const stock = parseInt(formData.get("stock") as string) || null;

  await prisma.product.create({
    data: { name, slug, description, price, categoryId, isFeatured, isSeasonal, season, stock },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string) || null;
  const categoryId = formData.get("categoryId") as string;
  const isFeatured = formData.get("isFeatured") === "on";
  const isSeasonal = formData.get("isSeasonal") === "on";
  const season = formData.get("season") as string;
  const stock = parseInt(formData.get("stock") as string) || null;

  await prisma.product.update({
    where: { id },
    data: { name, slug, description, price, categoryId, isFeatured, isSeasonal, season, stock },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}
