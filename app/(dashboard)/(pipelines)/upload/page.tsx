import { TopMainContent } from "@/components/top-main-content";
import UploadPipeline from "@/components/upload-pipeline";

export default function UploadPipelinePage() {
  return (
    <>
      <TopMainContent title="Upload" step={1} />
      <UploadPipeline />
    </>
  );
}
