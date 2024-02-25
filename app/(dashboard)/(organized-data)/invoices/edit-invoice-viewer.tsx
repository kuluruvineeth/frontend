import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { invoicesSchema } from "@/lib/llm/schema";
import { cn } from "@/lib/utils";
import { Invoice } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type InvoiceItem = {
  description: string;
  amount: number | null;
};

type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
};

type EditInvoiceViewerProps = {
  editInvoice: InvoiceWithItems;
  setEditInvoice: (invoice: any) => void;
};

export function EditInvoiceViewer({
  editInvoice,
  setEditInvoice,
}: EditInvoiceViewerProps): JSX.Element {
  const [isItemsOpen, setIsItemsOpen] = useState(true);

  return (
    <div className="w-full min-h-full p-2 overflow-scroll">
      <div className="grid grid-rows-3 gap-2.5">
        <div className="grid grid-cols-2">
          <div className="flex items-center gap-1 text-slate-800">
            <Label
              className="font-semibold self-center text-base"
              htmlFor="date"
            >
              Invoice Number
            </Label>
          </div>

          <Input
            id="invoiceNumber"
            placeholder="null"
            type="text"
            className="w-full h-8"
            onChange={(e) => {
              setEditInvoice({
                ...editInvoice,
                date: e.target.value,
              });
            }}
            value={editInvoice.invoiceNumber ?? ""}
          />
        </div>
        <div className="grid grid-cols-2">
          <div className={cn("text-slate-800", "flex items-center gap-1")}>
            <Label
              className="font-semibold self-center text-base"
              htmlFor="category"
            >
              Category
            </Label>
          </div>
          <Select
            onValueChange={(value) => {
              setEditInvoice({
                ...editInvoice,
                category: value,
              });
            }}
            defaultValue={editInvoice.category}
          >
            <SelectTrigger className="w-full h-8">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {invoicesSchema.properties.category.enum.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2">
          <div className={cn("text-slate-800", "flex items-center gap-1")}>
            <Label
              className="font-semibold self-center text-base"
              htmlFor="date"
            >
              Date
            </Label>
          </div>

          <Input
            id="date"
            placeholder="null"
            type="date"
            className="w-full h-8"
            onChange={(e) => {
              setEditInvoice({
                ...editInvoice,
                date: e.target.value,
              });
            }}
            value={editInvoice.date as unknown as string}
          />
        </div>
        <div className="">
          <h4 className="font-semibold flex items-center mt-3 mb-2.5 text-slate-800">
            From
            <Icons.braces
              strokeWidth={3}
              className="h-4 w-4 ml-1 inline-block"
            />
          </h4>
          <div className="rounded-md border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-1 mb-1">
              <Label className="-mt-0.5 text-slate-800" htmlFor="fromName">
                Name
              </Label>
            </div>
            <Input
              id="fromName"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setEditInvoice({
                  ...editInvoice,
                  fromName: e.target.value,
                });
              }}
              value={editInvoice.fromName ?? ""}
            />
            <div className="flex items-center gap-1 mb-1">
              <Label className="-mt-0.5 text-slate-800" htmlFor="fromAddress">
                Address
              </Label>
            </div>
            <Input
              id="fromAddress"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setEditInvoice({
                  ...editInvoice,
                  fromAddress: e.target.value,
                });
              }}
              value={editInvoice.fromAddress ?? ""}
            />
          </div>
        </div>
        <div className="">
          <h4 className="font-semibold flex items-center mt-3 mb-2.5 text-slate-800">
            To
            <Icons.braces
              strokeWidth={3}
              className="h-4 w-4 ml-1 inline-block"
            />
          </h4>
          <div className="rounded-md border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-1 mb-1">
              <Label className="-mt-0.5 text-slate-800" htmlFor="toName">
                Name
              </Label>
            </div>
            <Input
              id="toName"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setEditInvoice({
                  ...editInvoice,
                  toName: e.target.value,
                });
              }}
              value={editInvoice.toName ?? ""}
            />
            <div className="flex items-center gap-1 mb-1">
              <Label className="-mt-0.5 text-slate-800" htmlFor="toAddress">
                Address
              </Label>
            </div>
            <Input
              id="toAddress"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setEditInvoice({
                  ...editInvoice,
                  toAddress: e.target.value,
                });
              }}
              value={editInvoice.toAddress ?? ""}
            />
          </div>
        </div>
      </div>
      <div className="my-4">
        <Collapsible open={isItemsOpen} onOpenChange={setIsItemsOpen}>
          <div className="flex items-center justify-between">
            <h4
              className={cn(
                "text-slate-800",
                "flex items-center font-semibold"
              )}
            >
              Items{" "}
              <Icons.brackets
                strokeWidth={3}
                className="h-4 w-4 inline-block"
              />
              <Button
                onClick={() => {
                  setEditInvoice({
                    ...editInvoice,
                    items: [
                      ...editInvoice.items,
                      {
                        description: "",
                        amount: null,
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
                {editInvoice.items.map((item: any, index: number) => (
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
                        const newItems = [...editInvoice.items];
                        newItems[index].description = e.target.value;
                        setEditInvoice({
                          ...editInvoice,
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
                              const newItems = [...editInvoice.items];
                              newItems[index].amount = parseFloat(
                                e.target.value
                              );
                              setEditInvoice({
                                ...editInvoice,
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
                          const newItems = [...editInvoice.items];
                          newItems.splice(index, 1);
                          setEditInvoice({
                            ...editInvoice,
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
            className={cn("text-slate-800", "flex items-center font-semibold")}
          >
            <Label
              className="font-semibold self-center text-base"
              htmlFor="currency"
            >
              Currency
            </Label>
          </div>
          <Input
            id="currency"
            placeholder="null"
            type="text"
            className="w-full h-8"
            onChange={(e) => {
              setEditInvoice({
                ...editInvoice,
                currency: e.target.value,
              });
            }}
            value={editInvoice.currency ?? ""}
          />
        </div>
        <div className="grid grid-cols-2">
          <div className={cn("text-slate-800", "flex items-center gap-1")}>
            <Label
              className="font-semibold self-center text-base"
              htmlFor="total_amount_due"
            >
              Total Amount Due
            </Label>
          </div>
          <Input
            id="total_amount_due"
            placeholder="null"
            type="text"
            className="w-full h-8"
            onChange={(e) => {
              setEditInvoice({
                ...editInvoice,
                total_amount_due: e.target.value,
              });
            }}
            value={editInvoice.totalAmountDue ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
