"use client";

type QualitySliderProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export function QualitySlider({
  value,
  onChange,
  disabled,
}: QualitySliderProps) {
  return (
    <div className="space-y-3">
      <label className="font-medium text-sm text-zinc-300" htmlFor="quality">
        Quality: {value}%
      </label>
      <input
        className="w-full accent-zinc-500"
        disabled={disabled}
        max="100"
        min="1"
        onChange={(e) => onChange(Number.parseInt(e.target.value, 10))}
        type="range"
        value={value}
      />
    </div>
  );
}
