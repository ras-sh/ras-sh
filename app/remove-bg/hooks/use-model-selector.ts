import posthog from "posthog-js";
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

      posthog.capture("remove_bg_model_selected", { model });

      try {
        await preloadBackgroundRemoval(model);
        posthog.capture("remove_bg_model_preloaded", { model });
      } catch (error) {
        console.warn("Failed to preload model:", error);
        posthog.captureException(error, {
          model,
        });
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
