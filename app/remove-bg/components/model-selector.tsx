"use client";

import { Button } from "@/components/ui/button";
import { type BackgroundRemovalModel, MODELS } from "../lib/background-removal";

type ModelSelectorProps = {
  value: BackgroundRemovalModel | null;
  onValueChange: (value: BackgroundRemovalModel) => void;
  disabled?: boolean;
};

export function ModelSelector({
  value,
  onValueChange,
  disabled,
}: ModelSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-medium text-sm">Select Model</span>
      <div className="flex w-full flex-col gap-2 sm:grid sm:grid-cols-3">
        {Object.values(MODELS).map((model) => (
          <Button
            className="flex h-auto w-full flex-col items-start gap-0.5 whitespace-normal rounded-md border px-3 py-2.5 text-left"
            disabled={disabled}
            key={model.id}
            onClick={() => onValueChange(model.id)}
            variant={value === model.id ? "secondary" : "outline"}
          >
            <span className="font-medium text-sm">{model.name}</span>
            <span className="font-normal text-muted-foreground text-xs leading-tight">
              {model.description}
            </span>
            <span className="font-normal text-muted-foreground text-xs">
              {model.size}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
