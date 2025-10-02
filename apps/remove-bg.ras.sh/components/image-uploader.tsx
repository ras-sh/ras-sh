"use client";

import { ModelSelector } from "@/components/model-selector";
import { ResultsView } from "@/components/results-view";
import { UploadZone } from "@/components/upload-zone";
import { useImageDownloader } from "@/hooks/use-image-downloader";
import { useImageProcessor } from "@/hooks/use-image-processor";
import { useModelSelector } from "@/hooks/use-model-selector";

export function ImageUploader() {
  const { selectedModel, isPreloading, handleModelChange } = useModelSelector();
  const { processing, processedImages, progress, processFiles, clearAll } =
    useImageProcessor(selectedModel);
  const { downloadImage } = useImageDownloader();

  const showResults = processedImages.length > 0;

  return (
    <div className="w-full">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <ModelSelector
            disabled={processing || isPreloading}
            onValueChange={handleModelChange}
            value={selectedModel}
          />
        </div>

        {showResults && processedImages[0] ? (
          <ResultsView
            onDownloadImage={downloadImage}
            onProcessMore={clearAll}
            processedImage={processedImages[0]}
          />
        ) : (
          <UploadZone
            disabled={!selectedModel}
            isPreloading={isPreloading}
            onDrop={processFiles}
            processing={processing}
            progress={progress}
          />
        )}
      </div>
    </div>
  );
}
