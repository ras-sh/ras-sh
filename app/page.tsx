import { HeroSection } from "@/components/hero-section";
import { LibrariesSection } from "@/components/libraries-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12">
      <main className="mx-auto w-full max-w-4xl space-y-12 sm:space-y-16">
        <HeroSection />
        <LibrariesSection />
      </main>
    </div>
  );
}
