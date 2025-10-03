"use client";

import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

type UploadZoneProps = {
  onDrop: (files: File[]) => void;
  disabled?: boolean;
};

export function UploadZone({ onDrop, disabled }: UploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
      "image/tiff": [".tiff", ".tif"],
      "image/avif": [".avif"],
      "image/svg+xml": [".svg"],
    },
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative mx-auto cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors sm:p-24 ${
        isDragActive
          ? "border-zinc-100 bg-zinc-900/50"
          : "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/30"
      } ${disabled ? "pointer-events-none opacity-50" : ""}
      `}
    >
      <input {...getInputProps()} />

      <div className="space-y-6">
        <Upload className="mx-auto h-16 w-16 text-zinc-500" />
        <div>
          <h2 className="mb-2 font-bold text-2xl text-zinc-100">
            {isDragActive
              ? "Drop image here"
              : "Drop image here or click to select"}
          </h2>
          <p className="text-lg text-zinc-400">
            Supports JPG, PNG, GIF, WebP, AVIF, and SVG
          </p>
        </div>
      </div>
    </div>
  );
}
