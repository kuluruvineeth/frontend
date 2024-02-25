import { cn, formatBytes } from "@/lib/utils";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { HelpTooltip } from "./ui/help-tooltip";
import Balancer from "react-wrap-balancer";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { UploadInfo } from "./upload-pipeline";
import { useStepStore } from "@/lib/store";

type SettledResult = {
  status: "fulfilled" | "rejected";
  value?: {
    message: {
      filename: string;
      id: string;
    };
    reason?: any;
  };
};

export function Dropzone({
  className,
  updateUploadInfos,
}: {
  className?: string;
  updateUploadInfos: (uploadInfos: UploadInfo) => void;
}) {
  const [isBulkProcessing, setBulkProcessing] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<FileRejection[]>([]);
  const [isUploading, setUploading] = useState(false);
  const [hasUploadFailed, setUploadFailed] = useState(false);

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (res.status !== 201) {
      throw new Error(data.message);
    }
    return data;
  }

  async function uploadFiles(files: File[]) {
    setUploadFailed(false);
    setUploading(true);
    const results = await Promise.allSettled([
      ...files.map(uploadFile),
      new Promise((resolve) => setTimeout(resolve, 700)),
    ]);
    const success = results.filter(
      (result) => result.status === "fulfilled"
    ) as SettledResult[];
    const failed = results.filter(
      (result) => result.status === "rejected"
    ) as SettledResult[];
    setUploading(false);
    updateUploadInfos({
      nbFiles: files.length,
      success: success
        .filter((result) => result.value)
        .map((result) => [
          result.value!.message.filename,
          result.value!.message.id,
        ]),
      failed: files
        .filter(
          (file) =>
            success.find(
              (result) => result.value?.message.filename === file.name
            ) === undefined
        )
        .map((file) => file.name),
    });

    if (failed.length) {
      setUploadFailed(true);
    } else {
      useStepStore.setState({ status: "complete" });
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length) {
        setFiles(acceptedFiles);
      }
      setRejected(rejectedFiles);
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/octet-stream": [".pdf"],
    },
    maxFiles: isBulkProcessing ? 10 : 1,
    multiple: isBulkProcessing,
    maxSize: 5242880, //5 MB
    onDrop,
  });
  return (
    <div className={cn(className, "flex flex-col items-center justify-center")}>
      <div className="flex items-center gap-2">
        <Switch
          id="bulk-processing"
          disabled
          onCheckedChange={() =>
            setBulkProcessing((previousState) => !previousState)
          }
          checked={isBulkProcessing}
        />
        <Label htmlFor="bulk-processing">Bulk Processing</Label>
        <HelpTooltip>
          <Balancer>
            <p className="mb-4">
              Bulk processing allows you to upload multiple files at once.
            </p>
            <p>
              It will automatically process the files and stop at its current
              pipeline when it encounters an error.
            </p>
          </Balancer>
        </HelpTooltip>
      </div>
      <div
        className="border border-dashed rounded-xl border-slate-300 bg-slate-50 px-16 py-10 text-slate-600 cursor-pointer"
        {...getRootProps()}
      >
        <input {...getInputProps({ name: "file" })} />{" "}
        <div>
          <Icons.upload
            width={40}
            height={40}
            strokeWidth={1.5}
            className="mx-auto text-slate-400"
          />
          <div className="text-center">
            <p>
              Drag & Drop or <span className="font-semibold">browse files</span>
            </p>
            <em className="text-xs text-slate-500">
              {isBulkProcessing ? (
                <>PDF files only (max 10), </>
              ) : (
                <>One PDF file only, </>
              )}
              up to 5MB
            </em>
          </div>
        </div>
      </div>
      {rejected.length > 0 && (
        <section className="mt-2 w-full">
          <h4 className="font-medium text-red-500 text-xs mb-1">
            Rejected files
          </h4>
          {rejected.map(({ file, errors }) => (
            <div
              key={file.name}
              className="flex items-center gap-1 text-red-400 text-xs w-72"
            >
              <Icons.file width={12} height={12} />
              <span className="font-medium text-ellipsis overflow-hidden">
                {file.name}
              </span>
              <span className="flex-none">({formatBytes(file.size)})</span>
              <HelpTooltip
                classNameTrigger="h-5 w-5 p-1"
                classNameContent="px-2 py-1 text-slate-600"
              >
                <ul className="list-disc list-inside">
                  {errors.map((e) => (
                    <span key={e.code} className="text-xs">
                      {(e.code === "file-invalid-type" && (
                        <>Invalid file type. Only PDF files are allowed.</>
                      )) ||
                        e.message}
                    </span>
                  ))}
                </ul>
              </HelpTooltip>
            </div>
          ))}
        </section>
      )}
      {files.length > 0 && (
        <section className="mt-2 w-full">
          {files.map((file, index) => (
            <div
              key={file.name}
              className="flex items-center gap-1 text-slate-700 text-xs mb-1"
            >
              <Icons.file width={12} height={12} />
              <span className="font-medium text-ellipsis overflow-hidden">
                {file.name}
              </span>
              <span className="flex-none">({formatBytes(file.size)})</span>
              <Icons.close
                onClick={() => {
                  setFiles((previousState) => {
                    const newState = [...previousState];
                    newState.splice(index, 1);
                    return newState;
                  });
                }}
                width={12}
                height={12}
                className="cursor-pointer hover:text-red-500"
              />
            </div>
          ))}
          <Button
            disabled={isUploading}
            onClick={() => uploadFiles(files)}
            className="mt-3 w-full"
          >
            {isUploading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Upload
          </Button>
          {hasUploadFailed && (
            <p className="mt-2 text-red-500 text-xs">
              Some upload failed. Please try again.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
