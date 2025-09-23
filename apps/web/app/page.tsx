import { HeroSection } from "@/components/hero-section";
import { LibrariesSection } from "@/components/libraries-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 py-12">
      <main className="mx-auto max-w-3xl sm:space-y-6">
        <HeroSection />
        <LibrariesSection />
      </main>
    </div>
  );
}
