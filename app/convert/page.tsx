import { ProjectLayout } from "@/components/project-layout";
import { ImageConverter } from "./components/image-converter";

export default function ConvertPage() {
  return (
    <ProjectLayout
      description="Convert images between formats (JPEG, PNG, WebP, AVIF, GIF, TIFF) with quality control. Fast, secure, and private."
      name="convert"
      path="app/convert"
    >
      <ImageConverter />
    </ProjectLayout>
  );
}
