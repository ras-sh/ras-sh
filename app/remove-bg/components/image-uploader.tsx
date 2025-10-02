"use client";

import { useImageDownloader } from "../hooks/use-image-downloader";
import { useImageProcessor } from "../hooks/use-image-processor";
import { useModelSelector } from "../hooks/use-model-selector";
import { ModelSelector } from "./model-selector";
import { ResultsView } from "./results-view";
import { UploadZone } from "./upload-zone";

export function ImageUploader() {
  const { selectedModel, isPreloading, handleModelChange } = useModelSelector();
  const { processing, processedImages, progress, processFiles, clearAll } =
    useImageProcessor(selectedModel);
  const { downloadImage } = useImageDownloader();

  const showResults = processedImages.length > 0;

  return (
    <div className="w-full">
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
  );
}
