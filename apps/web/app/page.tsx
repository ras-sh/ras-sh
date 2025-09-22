import { HeroSection } from "@/components/hero-section";
import { LibrariesSection } from "@/components/libraries-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 py-12">
      <main className="mx-auto max-w-xl space-y-16">
        <HeroSection />
        <LibrariesSection />
      </main>
    </div>
  );
}
