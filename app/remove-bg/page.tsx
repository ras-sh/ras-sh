import { ProjectLayout } from "@/components/project-layout";
import { ImageUploader } from "./components/image-uploader";

export default function RemoveBgPage() {
  return (
    <ProjectLayout
      description="AI-powered background removal running entirely in your browser. Instant results, complete privacy, no uploads."
      name="remove-bg"
      path="app/remove-bg"
    >
      <ImageUploader />
    </ProjectLayout>
  );
}
