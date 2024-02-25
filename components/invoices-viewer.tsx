import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { receiptsSchema } from "@/lib/llm/schema";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { CorrectionTooltip } from "./ui/correction-tooltip";
export default function InvoicesViewer({
  verifiedInvoice,
  setVerifiedInvoice,
  corrections,
}: {
  verifiedInvoice: any;
  setVerifiedInvoice: (receipt: any) => void;
  corrections: Map<any, any>;
}) {
  const [isItemsOpen, setIsItemsOpen] = useState(true);

  return (
    <div className="w-full min-h-full p-2 overflow-scroll">
      <div className="grid grid-rows-4 gap-2.5">
        <div className="grid grid-cols-2">
          <div
            className={cn(
              corrections.has("from") ? "text-red-500" : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold font-slate-800 self-center text-base"
              htmlFor="invoice_number"
            >
              Invoice Number
            </Label>
            {corrections.has("invoice_number") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("invoice_number")}
              ></CorrectionTooltip>
            )}
          </div>

          <Input
            id="invoice_number"
            placeholder="null"
            type="text"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedInvoice({
                ...verifiedInvoice,
                invoice_number: e.target.value,
              });
            }}
            value={verifiedInvoice.invoice_number}
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className={cn(
              corrections.has("category") ? "text-red-500" : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold font-slate-800 self-center text-base"
              htmlFor="category"
            >
              Category
            </Label>
            {corrections.has("category") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("category")}
              ></CorrectionTooltip>
            )}
          </div>
          <Select
            onValueChange={(value) => {
              setVerifiedInvoice({ ...verifiedInvoice, category: value });
            }}
            defaultValue={verifiedInvoice.category}
          >
            <SelectTrigger className="w-full h-8">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {receiptsSchema.properties.category.enum.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2">
          <div
            className={cn(
              corrections.has("number") ? "text-red-500" : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold font-slate-800 self-center text-base"
              htmlFor="date"
            >
              Date
            </Label>
            {corrections.has("date") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("date")}
              ></CorrectionTooltip>
            )}
          </div>
          <Input
            id="date"
            placeholder="null"
            type="date"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedInvoice({
                ...verifiedInvoice,
                number: e.target.value,
              });
            }}
            value={verifiedInvoice.number}
          />
        </div>
        <div className="">
          <div
            className={cn(
              corrections.has("from") ? "text-red-500" : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold font-slate-800 self-center text-base"
              htmlFor="from"
            >
              From
            </Label>
            {corrections.has("from") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("from")}
              ></CorrectionTooltip>
            )}
          </div>
          <div className="rounded-md border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-1 mb-1">
              <Label
                className={cn(
                  corrections.has("from.name")
                    ? "text-red-500"
                    : "text-slate-800",
                  "-mt-0.5"
                )}
                htmlFor="from-name"
              >
                Name
              </Label>
              {corrections.has("from.name") && (
                <CorrectionTooltip
                  classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                  classNameContent="w-80"
                  correction={corrections.get("from.name")}
                ></CorrectionTooltip>
              )}
            </div>

            <Input
              id="from-name"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setVerifiedInvoice({
                  ...verifiedInvoice,
                  from: { ...verifiedInvoice.from, name: e.target.value },
                });
              }}
              value={verifiedInvoice.from.name}
            />
            <div className="flex items-center gap-1 mb-1">
              <Label
                className={cn(
                  corrections.has("from.address")
                    ? "text-red-500"
                    : "text-slate-800",
                  "-mt-0.5"
                )}
                htmlFor="from-address"
              >
                Address
              </Label>
              {corrections.has("from.address") && (
                <CorrectionTooltip
                  classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                  classNameContent="w-80"
                  correction={corrections.get("from.address")}
                ></CorrectionTooltip>
              )}
            </div>

            <Input
              id="from-address"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setVerifiedInvoice({
                  ...verifiedInvoice,
                  from: { ...verifiedInvoice.from, address: e.target.value },
                });
              }}
              value={verifiedInvoice.from.address}
            />
          </div>
        </div>
        <div className="">
          <div
            className={cn(
              corrections.has("to") ? "text-red-500" : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold font-slate-800 self-center text-base"
              htmlFor="to"
            >
              To
            </Label>
            {corrections.has("to") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("to")}
              ></CorrectionTooltip>
            )}
          </div>
          <div className="rounded-md border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-1 mb-1">
              <Label
                className={cn(
                  corrections.has("to.name")
                    ? "text-red-500"
                    : "text-slate-800",
                  "-mt-0.5"
                )}
                htmlFor="to-name"
              >
                Name
              </Label>
              {corrections.has("to.name") && (
                <CorrectionTooltip
                  classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                  classNameContent="w-80"
                  correction={corrections.get("to.name")}
                ></CorrectionTooltip>
              )}
            </div>

            <Input
              id="to-name"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setVerifiedInvoice({
                  ...verifiedInvoice,
                  to: { ...verifiedInvoice.to, name: e.target.value },
                });
              }}
              value={verifiedInvoice.to.name}
            />
            <div className="flex items-center gap-1 mb-1">
              <Label
                className={cn(
                  corrections.has("to.address")
                    ? "text-red-500"
                    : "text-slate-800",
                  "-mt-0.5"
                )}
                htmlFor="to-address"
              >
                Address
              </Label>
              {corrections.has("to.address") && (
                <CorrectionTooltip
                  classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                  classNameContent="w-80"
                  correction={corrections.get("to.address")}
                ></CorrectionTooltip>
              )}
            </div>

            <Input
              id="to-address"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setVerifiedInvoice({
                  ...verifiedInvoice,
                  to: { ...verifiedInvoice.to, address: e.target.value },
                });
              }}
              value={verifiedInvoice.to.address}
            />
          </div>
        </div>
      </div>
      <div className="my-4">
        <Collapsible open={isItemsOpen} onOpenChange={setIsItemsOpen}>
          <div className="flex items-center justify-between">
            <h4
              className={cn(
                corrections.has("items") ? "text-red-500" : "text-slate-800",
                "flex items-center gap-1"
              )}
            >
              Items{" "}
              <Icons.brackets
                strokeWidth={3}
                className="h-4 w-4 inline-block"
              />
              {corrections.has("items") && (
                <CorrectionTooltip
                  classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                  classNameContent="w-80"
                  correction={corrections.get("items")}
                ></CorrectionTooltip>
              )}
              <Button
                onClick={() => {
                  setVerifiedInvoice({
                    ...verifiedInvoice,
                    items: [
                      ...verifiedInvoice.items,
                      {
                        description: "",
                        amount: "",
                      },
                    ],
                  });
                }}
                variant={"ghost"}
                className="h-8 ml-2 text-slate-800"
              >
                <Icons.plusCircle className="h-3 w-3 mr-1" />
                <span className="text-xs">Add Item</span>
              </Button>
            </h4>
            <CollapsibleTrigger asChild>
              <div>
                <Button variant={"ghost"} size="sm" className="w-9 p-0">
                  <Icons.chevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </div>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-1.5">
            <motion.div layout className="w-full space-y-2">
              <AnimatePresence>
                {verifiedInvoice.items.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: -10,
                      transition: { duration: 0.2 },
                    }}
                    layoutId={`item-${index}`}
                    className="rounded-md border border-slate-200 px-4 py-3"
                  >
                    <Label htmlFor={`item-${index}-description`}>
                      Description
                    </Label>
                    <Input
                      id={`item-${index}-description`}
                      placeholder="null"
                      type="text"
                      className="w-full h-8"
                      onChange={(e) => {
                        const newItems = [...verifiedInvoice.items];
                        newItems[index].description = e.target.value;
                        setVerifiedInvoice({
                          ...verifiedInvoice,
                          items: newItems,
                        });
                      }}
                      value={item.description}
                    />
                    <div className="flex w-full mt-2 justify-between">
                      <div className="w-1/2 flex gap-1.5">
                        <div className="w-full">
                          <Label htmlFor={`item-${index}-amount`}>Amount</Label>
                          <Input
                            id={`item-${index}-amount`}
                            placeholder="null"
                            type="number"
                            className="w-full h-8"
                            onChange={(e) => {
                              const newItems = [...verifiedInvoice.items];
                              newItems[index].amount = e.target.value;
                              setVerifiedInvoice({
                                ...verifiedInvoice,
                                items: newItems,
                              });
                            }}
                            value={item.amount}
                          />
                        </div>
                      </div>
                      <Button
                        variant={"ghost"}
                        size={"sm"}
                        className="w-9 p-0 self-end"
                        onClick={() => {
                          const newItems = [...verifiedInvoice.items];
                          newItems.splice(index, 1);
                          setVerifiedInvoice({
                            ...verifiedInvoice,
                            items: newItems,
                          });
                        }}
                      >
                        <Icons.trash
                          strokeWidth={2.5}
                          className="h-4 w-4 text-slate-800"
                        />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      <div className="grid grid-rows-4 gap-2.5">
        <div className="grid grid-cols-2">
          <div
            className={cn(
              corrections.has("currency") ? "text-red-500" : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold font-slate-800 self-center text-base"
              htmlFor="currency"
            >
              Currency
            </Label>
            {corrections.has("currency") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("currency")}
              ></CorrectionTooltip>
            )}
          </div>
          <Input
            id="currency"
            placeholder="null"
            type="text"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedInvoice({
                ...verifiedInvoice,
                currency: e.target.value,
              });
            }}
            value={verifiedInvoice.currency}
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className={cn(
              corrections.has("total_amount_due")
                ? "text-red-500"
                : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold font-slate-800 self-center text-base"
              htmlFor="total_amount_due"
            >
              Total Amount Due
            </Label>
            {corrections.has("total_amount_due") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("total_amount_due")}
              ></CorrectionTooltip>
            )}
          </div>
          <Input
            id="total_amount_due"
            placeholder="null"
            type="text"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedInvoice({
                ...verifiedInvoice,
                total_amount_due: e.target.value,
              });
            }}
            value={verifiedInvoice.total_amount_due}
          />
        </div>
      </div>
    </div>
  );
}
