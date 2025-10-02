"use client";

import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";

type UploadZoneProps = {
  onDrop: (files: File[]) => void;
  processing: boolean;
  isPreloading: boolean;
  progress: number;
  disabled?: boolean;
};

export function UploadZone({
  onDrop,
  processing,
  isPreloading,
  progress,
  disabled,
}: UploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    disabled: disabled || processing || isPreloading,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative mx-auto cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors sm:p-24 ${
        isDragActive
          ? "border-zinc-100 bg-zinc-900/50"
          : "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/30"
      } ${disabled || processing || isPreloading ? "pointer-events-none opacity-50" : ""}
      `}
    >
      <input {...getInputProps()} />

      <div className="space-y-6">
        <Upload className="mx-auto h-16 w-16 text-zinc-500" />
        <div>
          <h2 className="mb-2 font-bold text-2xl text-zinc-100">
            {(() => {
              if (disabled) {
                return "Select a model first";
              }
              if (processing) {
                return "Processing image...";
              }
              if (isPreloading) {
                return "Loading AI model...";
              }
              if (isDragActive) {
                return "Drop image here";
              }
              return "Drop image here or click to select";
            })()}
          </h2>
          <p className="text-lg text-zinc-400">
            {disabled
              ? "Choose a model from the dropdown above to get started"
              : "Supports JPG, PNG, GIF, and WEBP files"}
          </p>
        </div>
      </div>

      {processing && progress > 0 && (
        <div className="-translate-x-1/2 absolute bottom-4 left-1/2 w-64">
          <div className="mb-2 text-center text-sm text-zinc-300">
            Processing... {progress}%
          </div>
          <Progress className="h-2 w-full" value={progress} />
        </div>
      )}
    </div>
  );
}
