"use client";
import MultiStep from "./multi-steps";

import Link from "next/link";
import { cn } from "../lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { headers } from "next/headers";

import dynamic from "next/dynamic";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Icons } from "./icons";
import Balancer from "react-wrap-balancer";
import { useRouter } from "next/navigation";

export default function TextRecognitionPipeline({
  uuid,
  url,
  text,
  filename,
}: {
  uuid: string;
  url: string;
  text: string;
  filename: string;
}) {
  const [verifiedText, setVerifiedText] = useState(text);
  const [isUpdating, setUpdating] = useState(false);
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState(
    text === "" ? "No text found in the PDF" : ""
  );

  async function sendText(text: string) {
    setUpdating(true);
    const res = await fetch("/api/text-recognition", {
      method: "PUT",
      body: JSON.stringify({
        uuid,
        text: verifiedText,
      }),
    });

    const data = await res.json();

    setUpdating(false);

    if (res.status !== 200) {
      throw new Error(data.message);
    }
  }
  return (
    <div className="mb-10 flex-grow flex flex-col mx-4">
      <div className="flex flex-1 items-center justify-center gap-x-10">
        {/* <PdfViewer url={url} scaleValue={1} /> */}
        <object
          data={`${url}#toolbar=1&navpanes=0&statusbar=0&scrollbar=1&view=fitH`}
          type="application/pdf"
          className="bg-slate-900 rounded-lg p-2 w-3/8 h-[600px] 2xl:w-3/10 2xl:h-3/4"
        />
        <div className="w-3/8 h-[500px] 2xl:w-3/10 2xl:h-3/4 flex flex-col justify-between">
          <div className="w-full h-3/4">
            <h1 className="mb-1 text-sm text-slate-700 overflow-hidden">
              Text from{" "}
              <span className="text-ellipsis font-semibold">{filename}</span>
            </h1>
            <Textarea
              value={verifiedText}
              onChange={(e) => {
                setErrorMsg("");
                setVerifiedText(e.target.value);
              }}
              className={cn(
                errorMsg ? "border-red-500" : "",
                "w-full h-full rounded-lg"
              )}
            />
            {errorMsg !== "" && (
              <p className="mt-1 text-sm text-red-500">{errorMsg}</p>
            )}
            <div className="flex gap-2 items-center justify-center w-full mt-4">
              <Icons.help
                width={20}
                height={20}
                className="inline-block text-slate-500 flex-none"
              />
              <Balancer>
                <p className="text-sm text-slate-500">
                  Please make sure that the text above matches the text in the
                  PDF. Feel free to remove or edit any part of the text.
                </p>
              </Balancer>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Link
              className={cn(
                buttonVariants({
                  variant: "secondary",
                })
              )}
              href={`/data-extraction/${uuid}`}
            >
              Cancel
            </Link>
            <Button
              disabled={isUpdating}
              className="w-48"
              onClick={() => {
                if (verifiedText.trim() === "") {
                  setErrorMsg("Please enter some text");
                  return;
                }
                sendText(verifiedText)
                  .then(() => router.push(`/data-extraction/${uuid}`))
                  .catch(() => {
                    setErrorMsg("Something went wrong, please try again");
                    setUpdating(false);
                  });
              }}
            >
              {isUpdating && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
