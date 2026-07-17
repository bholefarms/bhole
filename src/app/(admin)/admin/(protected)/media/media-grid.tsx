"use client";

import { useState, useMemo } from "react";
import { ImageIcon, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { SearchBar } from "@/components/admin/search-bar";
import { DataTableToolbar } from "@/components/admin/data-table-toolbar";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  path: string;
  fileName: string | null;
  type: "product" | "gallery";
  parentName: string;
  parentId: string;
}

interface MediaGridProps {
  items: MediaItem[];
  onDelete: (id: string, type: "product" | "gallery") => void;
}

export function MediaGrid({ items, onDelete }: MediaGridProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "product" | "gallery">("all");
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "product" | "gallery" } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    let result = items;
    if (filter !== "all") result = result.filter((i) => i.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          (i.fileName || "").toLowerCase().includes(q) ||
          i.parentName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, search, filter]);

  return (
    <>
      <DataTableToolbar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by file name or parent..." className="w-full sm:max-w-xs" />
        <div className="flex gap-1 rounded-lg border bg-card p-0.5">
          {(["all", "product", "gallery"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </DataTableToolbar>

      {filtered.length === 0 ? (
        <EmptyState title="No images found" icon={<ImageIcon className="size-8" />} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border bg-card shadow-sm">
              <div
                className="aspect-square cursor-pointer overflow-hidden bg-muted"
                onClick={() => setPreview(item)}
              >
                <img src={item.path} alt={item.fileName || ""} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="p-2.5 space-y-1">
                <p className="truncate text-xs font-medium">{item.fileName || "unnamed"}</p>
                <p className="truncate text-[10px] text-muted-foreground capitalize">{item.type} &middot; {item.parentName}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: item.id, type: item.type }); }}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setPreview(null)}>
          <button onClick={() => setPreview(null)} className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
            <X className="size-5" />
          </button>
          <img src={preview.path} alt="" className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-4 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
            {preview.fileName || "Image"} &middot; {preview.type}
          </div>
        </div>
      )}

      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget || deleting) return;
          setDeleting(true);
          try {
            await onDelete(deleteTarget.id, deleteTarget.type);
            setDeleteTarget(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete image");
          } finally {
            setDeleting(false);
          }
        }}
        loading={deleting}
      />
    </>
  );
}
