import Image from "next/image";
import icon from "@/public/icon.svg";

export function HeroSection() {
  return (
    <div className="relative space-y-3 py-10 text-center">
      <div className="-z-1 absolute inset-0 mx-auto h-full w-full max-w-xl bg-[url('/pattern.svg')] bg-center bg-contain bg-no-repeat" />
      <div className="flex justify-center">
        <Image alt="ras.sh" className="size-34" src={icon} />
      </div>

      <h1 className="font-bold text-6xl text-zinc-100 tracking-tight">
        ras.sh
      </h1>

      <p className="mx-auto max-w-xl text-xl text-zinc-400 leading-relaxed">
        A collection of side projects, experiments, and tools built with modern
        technologies
      </p>
    </div>
  );
}
