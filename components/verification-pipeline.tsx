"use client";

import { useState } from "react";
import MultiStep from "./multi-steps";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useStepStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Icons, SparklesIcon } from "./icons";
import { ObjectViewer } from "./object-viewer";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function VerificationPipeline({
  uuid,
  url,
  text,
  category,
  json,
}: {
  uuid: string;
  url: string;
  text: string;
  category: string;
  json: any;
}) {
  async function sendJson(json: any) {
    const res = await fetch("/api/verification", {
      method: "POST",
      body: JSON.stringify({
        uuid,
        json: JSON.stringify(verifiedJson),
      }),
    });
    const data = await res.json();
    if (res.status !== 200) {
      throw new Error(data.message);
    }
  }
  async function analyze() {
    const res = await fetch("/api/analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        category,
        json: JSON.stringify(verifiedJson),
      }),
    });
    if (!res.ok) {
      throw new Error("An error occurred while analyzing the JSON object");
    }

    const data = await res.json();
    return data;
  }

  const [isAnalyzing, setisAnalyzing] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [analysisResult, setAnalysisResult] = useState<{
    corrections: any[];
    textAnalysis: string;
  } | null>(null);
  const [verifiedJson, setVerifiedJson] = useState(JSON.parse(json));
  return (
    <div className="mb-4 mx-4 flex flex-col flex-grow">
      <div className="flex flex-1 justify-center">
        {isProcessed ? (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Icons.checkCircle2
              strokeWidth={1.4}
              className="text-green-500 w-32 h-32 my-6"
            />
            <p className="text-center text-slate-500 mb-6">
              Your file has been processed successfully!
            </p>
            <Link className={cn(buttonVariants(), "w-40")} href={"/dashboard"}>
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div
            style={{
              height: "80%",
            }}
            className="w-full flex justify-center items-start gap-x-10"
          >
            <Tabs
              style={{
                height: "calc(100% - 48px)",
              }}
              defaultValue="text"
              className="w-3/8 2xl:w-3/10"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pdf">PDF View</TabsTrigger>
                <TabsTrigger value="text">Text View</TabsTrigger>
              </TabsList>
              <TabsContent
                value="pdf"
                className="p-2 w-full h-full bg-slate-900 rounded-lg"
              >
                <object
                  data={`${url}#toolbar=1&navpanes=0&statusbar=0&scrollbar=1&view=fitH`}
                  type="application/pdf"
                  className="w-full h-full rounded-md"
                />
              </TabsContent>
              <TabsContent
                value="text"
                className="p-4 border border-slate-200 w-full h-full  rounded-lg"
              >
                <div
                  style={{
                    maxHeight: "57vh",
                  }}
                  className="w-full text-xs text-slate-700 whitespace-break-spaces overflow-auto"
                >
                  {text}
                </div>
              </TabsContent>
            </Tabs>
            <div className="w-2/5 h-full flex flex-col justify-center relative">
              <div className="mb-2 flex justify-between">
                <h1 className="text-2xl mb-2 font-bold text-slate-800">
                  Extracted Data
                </h1>
                <SparklesIcon
                  className={cn(
                    isAnalyzing ? "opacity-100" : "opacity-0",
                    "w-12 h-auto mb-4 transition-opacity duration-500 absolute right-14 -top-2"
                  )}
                />
                {analysisResult !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"ghost"} className="h-10">
                          <Icons.sparkles
                            width={18}
                            height={18}
                            className="mr-2"
                          />
                          Show Textual Analysis
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        style={{
                          width: "400px",
                          maxHeight: "550px",
                        }}
                        className="px-6 py-4 h-auto mr-20 overflow-scroll"
                      >
                        <div className="w-full text-sm whitespace-pre-wrap text-justify text-slate-700 mb-2">
                          {analysisResult.textAnalysis}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </motion.div>
                )}
              </div>
              <div className="border border-slate-200 p-3 overflow-hidden rounded-lg w-full h-full">
                <ObjectViewer
                  category={category}
                  json={verifiedJson}
                  setVerifiedJson={setVerifiedJson}
                  corrections={analysisResult?.corrections ?? []}
                />
              </div>
              <div className="flex justify-end gap-2 items-center absolute -bottom-12 right-0">
                <Link
                  className={cn(
                    buttonVariants({
                      variant: "secondary",
                    })
                  )}
                  href="/dashboard"
                >
                  Cancel
                </Link>
                {analysisResult === null && (
                  <Button
                    disabled={isAnalyzing}
                    variant={"secondary"}
                    className="relative inline-flex w-40 overflow-hidden bg-slate-100 p-[1.5px] group"
                    onClick={() => {
                      setisAnalyzing(true);
                      analyze()
                        .then((data) => {
                          setAnalysisResult(data);
                          setisAnalyzing(false);
                        })
                        .catch((err) => {
                          console.error(err);
                          setisAnalyzing(false);
                        });
                    }}
                  >
                    <span className="absolute inset-[-1000%] group-hover:animate-[spin_2s_linear_infinite] bg-slate-100" />
                    <span className="inline-flex h-full w-full items-center rounded justify-center bg-slate-100 px-3 py-1 backdrop-blur-3xl">
                      {(isAnalyzing && (
                        <Icons.spinner
                          width={18}
                          height={18}
                          className="mr-2 animate-spin inline-block"
                        />
                      )) || (
                        <Icons.sparkles
                          width={18}
                          height={18}
                          className="inline-block mr-2 group-hover:pulse"
                        />
                      )}
                      Analyze
                    </span>
                  </Button>
                )}
                <Button
                  disabled={isAnalyzing || isUpdating}
                  className="w-40"
                  onClick={() => {
                    setUpdating(true);
                    setErrorMsg("");
                    sendJson(json)
                      .then(() => {
                        setIsProcessed(true);
                        useStepStore.setState({ status: "complete" });
                        setUpdating(false);
                      })
                      .catch(() => {
                        setErrorMsg("Something went wrong, please try again");
                        setUpdating(false);
                      });
                  }}
                >
                  {isUpdating && (
                    <Icons.spinner
                      width={18}
                      height={18}
                      className="mr-2 animate-spin inline-block"
                    />
                  )}
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
