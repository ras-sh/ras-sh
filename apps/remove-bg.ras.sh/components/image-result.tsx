"use client";

import Image from "next/image";

type ProcessedImage = {
  original: string;
  processed: string;
  filename: string;
  processingTime: number;
};

type ImageResultProps = {
  image: ProcessedImage;
};

export function ImageResult({ image }: ImageResultProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <Image
          alt="Original"
          className="w-full rounded-lg border border-zinc-800"
          height={500}
          src={image.original}
          width={500}
        />
        <h4 className="text-center font-medium text-sm text-zinc-500 uppercase">
          Original
        </h4>
      </div>

      <div className="space-y-3">
        <div className="relative rounded-lg bg-[conic-gradient(#404040_90deg,transparent_90deg_180deg,#404040_180deg_270deg,transparent_270deg)] bg-[length:20px_20px] opacity-60">
          <Image
            alt="Processed"
            className="w-full rounded-lg border border-zinc-800"
            height={500}
            src={image.processed}
            width={500}
          />
        </div>
        <h4 className="text-center font-medium text-sm text-zinc-500 uppercase">
          Background Removed
        </h4>
      </div>
    </div>
  );
}
