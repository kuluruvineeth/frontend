"use client";

import { useState } from "react";
import MultiStep from "./multi-steps";

import { Switch } from "./ui/switch";
import { Label } from "@radix-ui/react-label";
import { HelpTooltip } from "./ui/help-tooltip";
import Balancer from "react-wrap-balancer";
import { Dropzone } from "./dropzone";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Icons } from "./icons";
import { useStepStore } from "@/lib/store";

export type UploadInfo = {
  nbFiles: number;
  success: [string, string][];
  failed: string[];
};

export default function UploadPipeline() {
  const [isBulkProcessing, setBulkProcessing] = useState(false);
  const [uploadInfos, setUploadInfos] = useState<UploadInfo | null>(null);

  const { status } = useStepStore();
  return (
    <div className="flex flex-col mx-4 flex-grow -mt-24 2xl:-mt-64">
      <div className="flex flex-col flex-1 items-center justify-center">
        {status === "active" && (
          <Dropzone updateUploadInfos={setUploadInfos} className="mt-4 mb-8" />
        )}
        {status === "complete" && (
          <>
            <Icons.checkCircle2
              strokeWidth={1.4}
              className="text-green-500 w-32 h-32 my-6"
            />
            <p className="text-center text-slate-500 mb-6">
              Your file{uploadInfos?.success.length > 1 && "s"} have been
              uploaded successfully {uploadInfos?.success[0]}
              {uploadInfos?.nbFiles > 1 && " and will be processed shortly"}
            </p>
            {(uploadInfos?.nbFiles === 1 && (
              <div className="flex gap-4">
                <Link
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "w-40"
                  )}
                  href={"/dashboard"}
                >
                  Back
                </Link>
                <Link
                  className={cn(buttonVariants(), "w-40")}
                  href={`/text-recognition/${uploadInfos.success[0][1]}`} // TODO: Change id to {uploadInfos.success[0][1]}
                >
                  Continue
                </Link>
              </div>
            )) || (
              <Link
                className={cn(buttonVariants(), "w-40")}
                href={"/dashboard"}
              >
                Back to Dashboard
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
