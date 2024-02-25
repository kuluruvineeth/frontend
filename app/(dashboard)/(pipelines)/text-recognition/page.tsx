import { TopMainContent } from "@/components/top-main-content";
import { DataTable } from "@/components/ui/data-table";
import { getExtractions } from "@/lib/requests";
import { Extraction, Status } from "@prisma/client";
import { columns } from "./columns";

export default async function TextRecognitionPage() {
  const extractions = await getExtractions(Status.TO_RECOGNIZE);
  return (
    <div className="flex flex-col h-full">
      <TopMainContent title="Text Recognition" displayUploadButton />
      <div className="m-8 flex flex-col flex-grow items-center justify-center space-y-12 2xl:space-y-20">
        <DataTable
          title="Documents in Current Pipeline"
          pageSize={10}
          emptyMessage="No documents in Text Recognition Pipeline"
          filterColumn={{
            columnId: "filename",
            placeholder: "Filter by file name",
          }}
          columns={columns}
          data={extractions as Extraction[]}
        />
      </div>
    </div>
  );
}
