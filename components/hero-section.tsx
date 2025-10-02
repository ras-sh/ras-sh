import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative space-y-4 py-8 text-center sm:space-y-6 sm:py-10">
      <div className="-z-1 absolute inset-0 mx-auto h-full w-full max-w-xl bg-[url('https://r2.ras.sh/pattern.svg')] bg-center bg-contain bg-no-repeat" />
      <div className="flex justify-center">
        <Image
          alt="ras.sh"
          className="size-20 sm:size-24 md:size-32"
          height={200}
          priority
          src="https://r2.ras.sh/icon.svg"
          width={200}
        />
      </div>

      <h1 className="font-bold text-4xl text-zinc-100 tracking-tight sm:text-5xl md:text-6xl">
        ras.sh
      </h1>

      <p className="mx-auto max-w-xl px-4 text-base text-zinc-400 leading-relaxed sm:px-0 sm:text-lg md:text-xl">
        A collection of side projects, experiments, and tools built with modern
        technologies
      </p>
    </div>
  );
}
