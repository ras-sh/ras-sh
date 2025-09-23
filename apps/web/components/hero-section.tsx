import Image from "next/image";
import icon from "@/public/icon.svg";

export function HeroSection() {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <Image alt="ras.sh" className="size-24" src={icon} />
      </div>

      <h1 className="font-bold text-6xl text-zinc-100 tracking-tight">
        ras.sh
      </h1>

      <p className="mx-auto max-w-2xl text-xl text-zinc-400 leading-relaxed">
        A collection of side projects, experiments, and tools built with modern
        technologies
      </p>
    </div>
  );
}
