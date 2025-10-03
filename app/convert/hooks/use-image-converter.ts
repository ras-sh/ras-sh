"use client";

import { useCallback, useState } from "react";

export type ImageFormat = "jpeg" | "png" | "webp" | "avif" | "gif";

type ConvertedImage = {
  id: string;
  originalFile: File;
  convertedUrl: string;
  convertedBlob: Blob;
  format: ImageFormat;
  quality: number;
};

export function useImageConverter() {
  const [converting, setConverting] = useState(false);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const convertImage = useCallback(
    async (file: File, format: ImageFormat, quality: number) => {
      setConverting(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("format", format);
        formData.append("quality", quality.toString());

        const response = await fetch("/api/convert", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Conversion failed");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const convertedImage: ConvertedImage = {
          id: Math.random().toString(36).substring(7),
          originalFile: file,
          convertedUrl: url,
          convertedBlob: blob,
          format,
          quality,
        };

        setConvertedImages((prev) => [...prev, convertedImage]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Conversion failed");
      } finally {
        setConverting(false);
      }
    },
    []
  );

  const clearAll = useCallback(() => {
    for (const img of convertedImages) {
      URL.revokeObjectURL(img.convertedUrl);
    }
    setConvertedImages([]);
    setError(null);
  }, [convertedImages]);

  return {
    converting,
    convertedImages,
    error,
    convertImage,
    clearAll,
  };
}
