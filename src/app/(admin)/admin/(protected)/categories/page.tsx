import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory } from "@/actions/categories";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Categories</h1>
      <form action={createCategory} className="flex gap-2 max-w-md">
        <input
          name="name"
          placeholder="Category name"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          name="slug"
          placeholder="category-slug"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 h-10"
        >
          Add
        </button>
      </form>
      <div className="rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-border">
                <td className="px-4 py-3">{cat.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteCategory.bind(null, cat.id)} className="inline">
                    <button type="submit" className="text-destructive hover:underline">
                      Delete
                    </button>
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
