import Image from "next/image";
import icon from "@/public/icon.svg";

export function HeroSection() {
  return (
    <div className="relative space-y-3 py-10 text-center">
      <div className="-z-1 absolute inset-0 mx-auto h-full w-full max-w-xl bg-[url('/pattern.svg')] bg-center bg-contain bg-no-repeat" />
      <div className="flex justify-center">
        <Image
          alt="ras.sh"
          className="size-24 md:size-32 lg:size-34"
          src={icon}
        />
      </div>

      <h1 className="font-bold text-4xl text-zinc-100 tracking-tight md:text-5xl lg:text-6xl">
        remove-bg.ras.sh
      </h1>

      <p className="mx-auto max-w-2xl text-base text-zinc-400 leading-relaxed md:text-lg lg:text-xl">
        AI-powered background removal running entirely in your browser. Instant
        results, complete privacy, no uploads.
      </p>
    </div>
  );
}
