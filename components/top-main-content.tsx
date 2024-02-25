"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "./icons";
import MultiStep from "./multi-steps";
import { useEffect } from "react";
import { useStepStore } from "@/lib/store";

export function TopMainContent({
  title,
  displayUploadButton = false,
  step = undefined,
}: {
  title: string;
  displayUploadButton?: boolean;
  step?: number;
}) {
  useEffect(() => {
    useStepStore.setState(() => ({
      current: step ?? 0,
      status: "active",
    }));
  }, [step]);
  return (
    <div className="h-32 relative flex-none border-slate-200 border-b-2 flex items-end justify-center">
      <h1
        className={cn(
          step !== undefined ? "lg:text-3xl" : "lg:text-4xl",
          "hidden lg:block mb-6 ml-10 absolute left-0 bottom-0"
        )}
      >
        {title}
      </h1>
      {step !== undefined && <MultiStep />}
      {displayUploadButton && (
        <Link
          className={cn(
            buttonVariants(),
            "mb-4 mr-4 absolute right-0 bottom-0"
          )}
          href={"/upload"}
        >
          <Icons.upload
            width={18}
            height={18}
            className="mr-2 stroke-slate-100"
          />
          Upload Files
        </Link>
      )}
    </div>
  );
}
