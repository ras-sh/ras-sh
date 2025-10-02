"use client";

import { Tabs, TabsList, TabsTrigger } from "@ras-sh/ui/components/tabs";
import { type BackgroundRemovalModel, MODELS } from "@/lib/background-removal";

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
      <Tabs
        onValueChange={(val) => onValueChange(val as BackgroundRemovalModel)}
        value={value ?? undefined}
      >
        <TabsList className="flex h-auto w-full flex-col gap-2 bg-transparent p-0 sm:grid sm:grid-cols-3">
          {Object.values(MODELS).map((model) => (
            <TabsTrigger
              className="flex h-auto w-full flex-col items-start gap-0.5 whitespace-normal rounded-md border border-border bg-background px-3 py-2.5 text-left data-[state=active]:border-primary data-[state=active]:bg-primary/10"
              disabled={disabled}
              key={model.id}
              value={model.id}
            >
              <span className="font-medium text-sm">{model.name}</span>
              <span className="font-normal text-muted-foreground text-xs leading-tight">
                {model.description}
              </span>
              <span className="font-normal text-muted-foreground text-xs">
                {model.size}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
