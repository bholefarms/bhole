import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Testimonials</h1>
      <div className="rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Rating</th>
              <th className="px-4 py-3 text-left font-medium">Content</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t.id} className="border-b border-border">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3">{"★".repeat(t.rating)}</td>
                <td className="px-4 py-3 text-muted-foreground max-w-md truncate">
                  {t.content}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {testimonials.length === 0 && (
          <p className="p-4 text-center text-muted-foreground">No testimonials yet.</p>
        )}
      </div>
    </div>
  );
}
