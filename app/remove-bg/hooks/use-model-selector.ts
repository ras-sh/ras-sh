import { useCallback, useState } from "react";
import {
  type BackgroundRemovalModel,
  preloadBackgroundRemoval,
} from "../lib/background-removal";

export function useModelSelector() {
  const [selectedModel, setSelectedModel] =
    useState<BackgroundRemovalModel | null>(null);
  const [isPreloading, setIsPreloading] = useState(false);

  const handleModelChange = useCallback(
    async (model: BackgroundRemovalModel) => {
      setSelectedModel(model);
      setIsPreloading(true);
      try {
        await preloadBackgroundRemoval(model);
      } catch (error) {
        console.warn("Failed to preload model:", error);
      } finally {
        setIsPreloading(false);
      }
    },
    []
  );

  return {
    selectedModel,
    isPreloading,
    handleModelChange,
  };
}
