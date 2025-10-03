"use client";

import { Download, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ImageFormat } from "../hooks/use-image-converter";
import { useImageConverter } from "../hooks/use-image-converter";
import { FormatSelector } from "./format-selector";
import { QualitySlider } from "./quality-slider";
import { UploadZone } from "./upload-zone";

function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ImageFormat>("png");
  const [quality, setQuality] = useState(80);

  const { converting, convertedImages, error, convertImage, clearAll } =
    useImageConverter();

  const handleDrop = (files: File[]) => {
    if (files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      return;
    }
    await convertImage(selectedFile, format, quality);
  };

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setSelectedFile(null);
    clearAll();
  };

  const convertedImage = convertedImages[0];

  if (convertedImage) {
    const originalSize = convertedImage.originalFile.size;
    const convertedSize = convertedImage.convertedBlob.size;
    const sizeDiff = convertedSize - originalSize;
    const percentChange = ((sizeDiff / originalSize) * 100).toFixed(1);

    return (
      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          <Button
            onClick={() =>
              handleDownload(
                convertedImage.convertedUrl,
                `converted.${convertedImage.format}`
              )
            }
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button onClick={handleReset} variant="default">
            <RotateCcw className="mr-2 h-4 w-4" />
            New
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Image
              alt="Original"
              className="w-full rounded-lg border border-zinc-800"
              height={500}
              src={URL.createObjectURL(convertedImage.originalFile)}
              width={500}
            />
            <div className="text-center">
              <h4 className="font-medium text-sm text-zinc-500 uppercase">
                Original
              </h4>
              <p className="text-xs text-zinc-600">
                {formatFileSize(originalSize)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Image
              alt="Converted"
              className="w-full rounded-lg border border-zinc-800"
              height={500}
              src={convertedImage.convertedUrl}
              width={500}
            />
            <div className="text-center">
              <h4 className="font-medium text-sm text-zinc-500 uppercase">
                {convertedImage.format.toUpperCase()}
              </h4>
              <p className="text-xs text-zinc-600">
                {formatFileSize(convertedSize)}
                <span
                  className={`ml-1 ${sizeDiff > 0 ? "text-red-500" : "text-green-500"}`}
                >
                  ({sizeDiff > 0 ? "+" : ""}
                  {percentChange}%)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {selectedFile ? (
        <div className="space-y-6">
          <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/30 p-6">
            <FormatSelector
              disabled={converting}
              onChange={setFormat}
              value={format}
            />
            <QualitySlider
              disabled={converting}
              onChange={setQuality}
              value={quality}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-900 bg-red-950/50 p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button
            className="w-full"
            disabled={converting}
            onClick={handleConvert}
          >
            {converting ? "Converting..." : "Convert Image"}
          </Button>
        </div>
      ) : (
        <UploadZone disabled={converting} onDrop={handleDrop} />
      )}
    </div>
  );
}
