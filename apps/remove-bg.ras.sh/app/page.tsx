import { HeroSection } from "@/components/hero-section";
import { ImageUploader } from "@/components/image-uploader";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 py-12">
      <HeroSection />
      <ImageUploader />
    </div>
  );
}
