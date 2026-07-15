"use client";

import { useState, useEffect, useRef } from "react";
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
  const uploadedRef = useRef<UploadedFile[]>([]);
  const onFilesChangeRef = useRef(onFilesChange);
  onFilesChangeRef.current = onFilesChange;
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
      uploadedRef.current = initialUploaded;
      onFilesChangeRef.current(initialUploaded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          process: {
            url: "/api/upload",
            method: "POST",
            withCredentials: false,
            onload: (response: string) => {
              try {
                const data = JSON.parse(response);
                if (data.success && data.files && data.files.length > 0) {
                  return JSON.stringify(data.files[0]);
                }
              } catch {}
              return response;
            },
            onerror: (response: string) => response,
          },
          revert: null,
          restore: null,
          load: null,
          fetch: null,
        }}
        onprocessfile={(_error: any, file: any) => {
          const serverId = file.serverId;
          if (serverId && typeof serverId === "string") {
            try {
              const parsed = JSON.parse(serverId);
              uploadedRef.current = [
                ...uploadedRef.current,
                { ...parsed, isExisting: false },
              ];
              onFilesChangeRef.current(uploadedRef.current);
            } catch {}
          }
        }}
        onremovefile={(_error: any, file: any) => {
          const meta = file.getMetadata ? file.getMetadata() : {};
          const metaId: string | undefined = meta?.id;
          let serverParsedId: string | undefined;
          try {
            if (file.serverId) serverParsedId = JSON.parse(file.serverId).id;
          } catch {}
          const removeId = metaId || serverParsedId;
          if (removeId) {
            uploadedRef.current = uploadedRef.current.filter((u) => u.id !== removeId);
            onFilesChangeRef.current(uploadedRef.current);
          }
        }}
        name="files[]"
        credits={false}
      />
    </div>
  );
}
