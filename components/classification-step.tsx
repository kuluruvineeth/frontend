import Balancer from "react-wrap-balancer";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "./ui/select";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ClassificationStep({
  categories,
  text,
  updateCategory,
  setLlmCall,
}: {
  categories: { value: string; name: string }[];
  text: string;
  updateCategory: (category: string) => void;
  setLlmCall: (llmCall: boolean) => void;
}) {
  async function getClassification() {
    setLlmCall(true);
    const res = await fetch("/api/classification", {
      method: "POST",
      body: JSON.stringify({
        text,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to classify text");
    }

    const { classification, confidence } = (await res.json()) as {
      classification: string;
      confidence: number;
    };
    setLlmCall(false);
    if (confidence < 60) return "other";
    return classification;
  }

  const [status, setStatus] = useState<
    "active" | "complete" | "failed" | "confirmed"
  >("active");
  const [classification, setClassification] = useState("other");

  useEffect(() => {
    const classify = async () => {
      try {
        const category = await getClassification();
        setClassification(category);
        setStatus("complete");
      } catch (e) {
        setStatus("failed");
      }
    };

    classify();
  }, []);

  return (
    <motion.div>
      <motion.div
        layout="position"
        className="border rounded-lg border-slate-200 px-5 py-3 bg-white"
      >
        <div
          className={cn(
            status === "complete" ? "text-slate-400" : "text-slate-700",
            "text-xl font-medium"
          )}
        >
          <span className="font-bold">Step 1 : </span>
          <span>Classifying text</span>
          {status === "active" && (
            <Icons.spinner className="w-6 ml-3 mb-0.5 h-auto animate-spin inline-block" />
          )}
          {status === "complete" && (
            <Icons.checkCircle
              strokeWidth={2}
              className="text-green-500 w-6 ml-3 mb-0.5 h-auto inline-block"
            />
          )}
          {status === "failed" && (
            <Icons.close
              strokeWidth={2}
              className="text-red-500 w-6 ml-3 mb-0.5 h-auto inline-block"
            />
          )}
        </div>
        {status === "active" && (
          <p className="text-slate-400 text-sm mt-1 mb-2 w-64 leading-snug">
            <span>
              <Balancer>
                The text is being classified. This might take a few seconds.
              </Balancer>
            </span>
          </p>
        )}
        {status === "complete" && (
          <div className="text-slate-700 text-sm mt-1 mb-2 w-64 leading-snug">
            <p>
              <span>
                <Balancer>
                  Text Classified as
                  <span className="font-semibold mt-1">
                    {categories.find((c) => c.value === classification)?.name ??
                      "Other"}
                  </span>
                </Balancer>
              </span>
            </p>
            <p>
              {(classification === "other" && (
                <span>
                  <Balancer>Please specify the correct category.</Balancer>
                </span>
              )) || (
                <span>
                  <Balancer>Please confirm if it&apos;s correct.</Balancer>
                </span>
              )}
            </p>
          </div>
        )}
        {status === "failed" && (
          <p className="text-slate-400 text-sm mt-1 mb-2 w-64 leading-snug">
            <span>
              <Balancer>
                The text could not be classified. Please specify the correct
                category
              </Balancer>
            </span>
          </p>
        )}
        {status !== "active" && (
          <Select
            onValueChange={(value) => {
              if (status === "failed") setStatus("complete");
              setClassification(value);
            }}
            defaultValue={classification === "other" ? "" : classification}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((catgory) => (
                <SelectItem key={catgory.value} value={catgory.value}>
                  {catgory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </motion.div>
      <div className="flex gap-2 mt-3">
        <Link
          className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
          href={"/dashboard"}
        >
          Cancel
        </Link>
        {status !== "active" && (
          <Button
            disabled={
              categories.find((c) => c.value === classification) === undefined
            }
            className={cn("w-full")}
            onClick={() => {
              updateCategory(classification);
              setStatus("confirmed");
            }}
          >
            Confirm
          </Button>
        )}
      </div>
    </motion.div>
  );
}
