import posthog from "posthog-js";
import { useCallback, useState } from "react";
import {
  type BackgroundRemovalModel,
  type BackgroundRemovalOptions,
  processImageWithBackgroundRemoval,
} from "../lib/background-removal";

type ProcessedImage = {
  original: string;
  processed: string;
  filename: string;
  processingTime: number;
};

export function useImageProcessor(
  selectedModel: BackgroundRemovalModel | null
) {
  const [processing, setProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [progress, setProgress] = useState(0);

  const processImage = useCallback(
    async (file: File): Promise<ProcessedImage> => {
      if (!selectedModel) {
        throw new Error("No model selected");
      }

      const startTime = Date.now();

      const reader = new FileReader();
      const originalDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const options: BackgroundRemovalOptions = {
        model: selectedModel,
        progress: (progressPercent) => {
          setProgress(progressPercent);
        },
      };

      const processedDataUrl = await processImageWithBackgroundRemoval(
        file,
        options
      );
      const processingTime = Date.now() - startTime;

      return {
        original: originalDataUrl,
        processed: processedDataUrl,
        filename: file.name,
        processingTime,
      };
    },
    [selectedModel]
  );

  const processFiles = useCallback(
    async (files: File[]) => {
      setProcessing(true);
      setProgress(0);

      const imageFiles = files.filter((f) => f.type.startsWith("image/"));
      const file = imageFiles[0]; // Only process first image

      if (!file) {
        setProcessing(false);
        return;
      }

      posthog.capture("remove_bg_processing_started", {
        model: selectedModel,
        fileSize: file.size,
        fileType: file.type,
      });

      try {
        const processed = await processImage(file);
        setProcessedImages([processed]); // Replace with single image
        setProgress(0);

        posthog.capture("remove_bg_processing_completed", {
          model: selectedModel,
          fileSize: file.size,
          fileType: file.type,
          processingTime: processed.processingTime,
        });
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        posthog.captureException(error, {
          model: selectedModel,
          fileSize: file.size,
          fileType: file.type,
        });
      } finally {
        setProcessing(false);
        setProgress(0);
      }
    },
    [processImage, selectedModel]
  );

  const clearAll = useCallback(() => {
    setProcessedImages([]);
    posthog.capture("remove_bg_results_cleared");
  }, []);

  return {
    processing,
    processedImages,
    progress,
    processFiles,
    clearAll,
  };
}
