"use client";

import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageResult } from "./image-result";

type ProcessedImage = {
  original: string;
  processed: string;
  filename: string;
  processingTime: number;
};

type ResultsViewProps = {
  processedImage: ProcessedImage;
  onDownloadImage: (
    dataUrl: string,
    filename: string,
    format?: "png" | "webp" | "jpeg"
  ) => void;
  onProcessMore: () => void;
};

export function ResultsView({
  processedImage,
  onDownloadImage,
  onProcessMore,
}: ResultsViewProps) {
  function downloadImage(format: "png" | "jpeg" | "webp") {
    onDownloadImage(processedImage.processed, processedImage.filename, format);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2">
        <Button onClick={() => downloadImage("png")} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          PNG
        </Button>
        <Button onClick={() => downloadImage("jpeg")} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          JPEG
        </Button>
        <Button onClick={() => downloadImage("webp")} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          WebP
        </Button>
        <Button onClick={onProcessMore} variant="default">
          <RotateCcw className="mr-2 h-4 w-4" />
          New
        </Button>
      </div>

      <ImageResult image={processedImage} />
    </div>
  );
}
