"use client";

import type { ImageFormat } from "../hooks/use-image-converter";

type FormatSelectorProps = {
  value: ImageFormat;
  onChange: (format: ImageFormat) => void;
  disabled?: boolean;
};

const FORMATS: { value: ImageFormat; label: string }[] = [
  { value: "jpeg", label: "JPEG" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WebP" },
  { value: "avif", label: "AVIF" },
  { value: "gif", label: "GIF" },
];

export function FormatSelector({
  value,
  onChange,
  disabled,
}: FormatSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="font-medium text-sm text-zinc-300" htmlFor="format">
        Output Format
      </label>
      <div className="flex flex-wrap gap-2">
        {FORMATS.map((format) => (
          <button
            className={`rounded-lg border px-4 py-2 font-medium text-sm transition-colors ${
              value === format.value
                ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
            }
              ${disabled ? "cursor-not-allowed opacity-50" : ""}
            `}
            disabled={disabled}
            key={format.value}
            onClick={() => onChange(format.value)}
            type="button"
          >
            {format.label}
          </button>
        ))}
      </div>
    </div>
  );
}
