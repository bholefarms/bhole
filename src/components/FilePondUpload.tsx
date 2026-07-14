"use client";

import { useState, useCallback, useEffect } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

interface UploadedFile {
  id: string;
  path: string;
  width?: number;
  height?: number;
  size?: number;
  mimeType?: string;
  isExisting?: boolean;
}

interface FilePondUploadProps {
  existingImages?: { path: string; id?: string }[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  label?: string;
}

export default function FilePondUpload({
  existingImages = [],
  onFilesChange,
  maxFiles = 10,
  label = "Images",
}: FilePondUploadProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const FilePondComponent = FilePond as any;

  // Load existing images on mount
  useEffect(() => {
    if (existingImages.length > 0) {
      const initialPondFiles = existingImages.map((img) => ({
        source: img.path,
        options: {
          type: "local" as const,
          file: {
            name: img.path.split("/").pop() || "",
            size: 0,
            type: "image/webp",
          },
          metadata: { id: img.id },
        },
      }));
      setFiles(initialPondFiles);

      const initialUploaded = existingImages.map((img, i) => ({
        id: img.id || `existing-${i}`,
        path: img.path,
        isExisting: true,
      }));
      setUploadedFiles(initialUploaded);
      onFilesChange(initialUploaded);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateFileItems = useCallback(
    (fileItems: any[]) => {
      setFiles(fileItems);

      const current: UploadedFile[] = [];
      for (const item of fileItems) {
        if (item.serverId && typeof item.serverId === "string") {
          try {
            const parsed = JSON.parse(item.serverId);
            // Newly uploaded via API
            current.push({ ...parsed, isExisting: false });
          } catch {
            // serverId might be a file path for local files
            current.push({ id: "", path: item.serverId, isExisting: true });
          }
        } else if (item.file && item.filename) {
          // Local existing file loaded from source
          const existing = uploadedFiles.find(
            (u) => u.path.endsWith(item.filename as string)
          );
          if (existing) current.push(existing);
        }
      }
      setUploadedFiles(current);
      onFilesChange(current);
    },
    [uploadedFiles, onFilesChange]
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <FilePondComponent
        files={files}
        allowMultiple={true}
        maxFiles={maxFiles}
        acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
        labelFileTypeNotAllowed="Only JPG, PNG, and WEBP files are allowed"
        maxFileSize="5MB"
        labelMaxFileSizeExceeded="File is too large. Maximum size is 5MB."
        allowReorder={true}
        instantUpload={true}
        server={{
          url: "/api/upload",
          process: {
            url: "/api/upload",
            method: "POST",
            withCredentials: false,
            onload: (response: string) => response,
            onerror: (response: string) => response,
          },
          revert: null,
          restore: null,
          load: null,
          fetch: null,
        }}
        onupdatefiles={handleUpdateFileItems}
        name="files[]"
        credits={false}
      />
    </div>
  );
}
