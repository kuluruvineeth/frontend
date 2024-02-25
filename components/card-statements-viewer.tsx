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
import { cardStatementsSchema, receiptsSchema } from "@/lib/llm/schema";

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
export default function CardStatementsViewer({
  verifiedCardStatement,
  setVerifiedCardStatement,
  corrections,
}: {
  verifiedCardStatement: any;
  setVerifiedCardStatement: (receipt: any) => void;
  corrections: Map<any, any>;
}) {
  const [isItemsOpen, setIsItemsOpen] = useState(true);

  return (
    <div className="w-full min-h-full p-2 overflow-scroll">
      <div className="">
        <div className="grid grid-cols-2">
          <div
            className={cn(
              corrections.has("date") ? "text-red-500" : "text-slate-800",
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
            type="text"
            className="w-full h-8"
            onChange={(e) => {
              setVerifiedCardStatement({
                ...verifiedCardStatement,
                date: e.target.value,
              });
            }}
            value={verifiedCardStatement.date}
          />
        </div>
        <div className="">
          <div
            className={cn(
              corrections.has("issuer") ? "text-red-500" : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold font-slate-800 self-center text-base"
              htmlFor="issuer"
            >
              issuer
            </Label>
            {corrections.has("issuer") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("issuer")}
              ></CorrectionTooltip>
            )}
          </div>
          <div className="rounded-md border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-1 mb-1">
              <Label
                className={cn(
                  corrections.has("issuer.name")
                    ? "text-red-500"
                    : "text-slate-800",
                  "-mt-0.5"
                )}
                htmlFor="issuer.name"
              >
                Name
              </Label>
              {corrections.has("issuer.name") && (
                <CorrectionTooltip
                  classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                  classNameContent="w-80"
                  correction={corrections.get("issuer.name")}
                ></CorrectionTooltip>
              )}
            </div>
            <Input
              id="issuer-name"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setVerifiedCardStatement({
                  ...verifiedCardStatement,
                  name: e.target.value,
                });
              }}
              value={verifiedCardStatement.issuerName ?? ""}
            />
            <div className="flex items-center gap-1 mb-1">
              <Label
                className={cn(
                  corrections.has("issuer.address")
                    ? "text-red-500"
                    : "text-slate-800",
                  "-mt-0.5"
                )}
                htmlFor="issuer.address"
              >
                Address
              </Label>
              {corrections.has("issuer.address") && (
                <CorrectionTooltip
                  classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                  classNameContent="w-80"
                  correction={corrections.get("issuer.address")}
                ></CorrectionTooltip>
              )}
            </div>
            <Input
              id="issuer-address"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setVerifiedCardStatement({
                  ...verifiedCardStatement,
                  address: e.target.value,
                });
              }}
              value={verifiedCardStatement.issuerAddress}
            />
          </div>
        </div>
        <div className="">
          <div
            className={cn(
              corrections.has("recipient") ? "text-red-500" : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold font-slate-800 self-center text-base"
              htmlFor="recipient"
            >
              recipient
            </Label>
            {corrections.has("recipient") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("recipient")}
              ></CorrectionTooltip>
            )}
          </div>
          <div className="rounded-md border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-1 mb-1">
              <Label
                className={cn(
                  corrections.has("recipient.name")
                    ? "text-red-500"
                    : "text-slate-800",
                  "-mt-0.5"
                )}
                htmlFor="recipient.name"
              >
                Name
              </Label>
              {corrections.has("recipient.name") && (
                <CorrectionTooltip
                  classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                  classNameContent="w-80"
                  correction={corrections.get("recipient.name")}
                ></CorrectionTooltip>
              )}
            </div>
            <Input
              id="recipient-name"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setVerifiedCardStatement({
                  ...verifiedCardStatement,
                  recipientName: e.target.value,
                });
              }}
              value={verifiedCardStatement.recipientName}
            />
            <div className="flex items-center gap-1 mb-1">
              <Label
                className={cn(
                  corrections.has("recipient.address")
                    ? "text-red-500"
                    : "text-slate-800",
                  "-mt-0.5"
                )}
                htmlFor="recipient.address"
              >
                Address
              </Label>
              {corrections.has("recipient.address") && (
                <CorrectionTooltip
                  classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                  classNameContent="w-80"
                  correction={corrections.get("recipient.address")}
                ></CorrectionTooltip>
              )}
            </div>
            <Input
              id="recipient-address"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setVerifiedCardStatement({
                  ...verifiedCardStatement,
                  recipientAddress: e.target.value,
                });
              }}
              value={verifiedCardStatement.recipientAddress}
            />
          </div>
        </div>
        <div className="">
          <div
            className={cn(
              corrections.has("credit_card")
                ? "text-red-500"
                : "text-slate-800",
              "flex items-center gap-1"
            )}
          >
            <Label
              className="font-semibold font-slate-800 self-center text-base"
              htmlFor="credit_card"
            >
              Credit Card
            </Label>
            {corrections.has("credit_card") && (
              <CorrectionTooltip
                classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                classNameContent="w-80"
                correction={corrections.get("credit_card")}
              ></CorrectionTooltip>
            )}
          </div>
          <div className="rounded-md border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-1 mb-1">
              <Label
                className={cn(
                  corrections.has("credit_card.name")
                    ? "text-red-500"
                    : "text-slate-800",
                  "-mt-0.5"
                )}
                htmlFor="credit_card-name"
              >
                Name
              </Label>
              {corrections.has("credit_card.name") && (
                <CorrectionTooltip
                  classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                  classNameContent="w-80"
                  correction={corrections.get("credit_card.name")}
                ></CorrectionTooltip>
              )}
            </div>
            <Input
              id="credit_card-name"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setVerifiedCardStatement({
                  ...verifiedCardStatement,
                  credit_card: {
                    ...verifiedCardStatement.credit_card,
                    creditCardName: e.target.value,
                  },
                });
              }}
              value={verifiedCardStatement.creditCardName}
            />
            <div className="flex items-center gap-1 mb-1">
              <Label
                className={cn(
                  corrections.has("credt_card.holder")
                    ? "text-red-500"
                    : "text-slate-800",
                  "-mt-0.5"
                )}
                htmlFor="credt_card-holder"
              >
                Holder
              </Label>
              {corrections.has("credt_card.holder") && (
                <CorrectionTooltip
                  classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                  classNameContent="w-80"
                  correction={corrections.get("credt_card.holder")}
                ></CorrectionTooltip>
              )}
            </div>
            <Input
              id="credit_card-holder"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setVerifiedCardStatement({
                  ...verifiedCardStatement,
                  credit_card: {
                    ...verifiedCardStatement.credit_card,
                    holder: e.target.value,
                  },
                });
              }}
              value={verifiedCardStatement.creditCardHolder}
            />
            <div className="flex items-center gap-1 mb-1">
              <Label
                className={cn(
                  corrections.has("credt_card.number")
                    ? "text-red-500"
                    : "text-slate-800",
                  "-mt-0.5"
                )}
                htmlFor="credt_card-number"
              >
                Number
              </Label>
              {corrections.has("credt_card.number") && (
                <CorrectionTooltip
                  classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                  classNameContent="w-80"
                  correction={corrections.get("credt_card.number")}
                ></CorrectionTooltip>
              )}
            </div>
            <Input
              id="credit_card-number"
              placeholder="null"
              type="text"
              className="w-full h-8"
              onChange={(e) => {
                setVerifiedCardStatement({
                  ...verifiedCardStatement,
                  credit_card: {
                    ...verifiedCardStatement.credit_card,
                    number: e.target.value,
                  },
                });
              }}
              value={verifiedCardStatement.creditCardNumber}
            />
          </div>
        </div>
      </div>
      <div className="my-4">
        <Collapsible open={isItemsOpen} onOpenChange={setIsItemsOpen}>
          <div className="flex items-center justify-between">
            <h4
              className={cn(
                corrections.has("transactions")
                  ? "text-red-500"
                  : "text-slate-800",
                "flex items-center gap-1"
              )}
            >
              Transactions{" "}
              <Icons.brackets
                strokeWidth={3}
                className="h-4 w-4 inline-block"
              />
              {corrections.has("transactions") && (
                <CorrectionTooltip
                  classNameTrigger="h-6 w-6 p-1 hover:bg-red-100 hover:text-red-600"
                  classNameContent="w-80"
                  correction={corrections.get("transactions")}
                ></CorrectionTooltip>
              )}
              <Button
                onClick={() => {
                  setVerifiedCardStatement({
                    ...verifiedCardStatement,
                    transactions: [
                      ...verifiedCardStatement.transactions,
                      {
                        name: "",
                        category: "",
                        amount: "",
                      },
                    ],
                  });
                }}
                variant={"ghost"}
                className="h-8 ml-2 text-slate-800"
              >
                <Icons.plusCircle className="h-3 w-3 mr-1" />
                <span className="text-xs">Add Transaction</span>
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
                {verifiedCardStatement.transactions.map(
                  (transaction: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={false}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -10,
                        transition: { duration: 0.2 },
                      }}
                      layoutId={`transaction-${index}`}
                      className="rounded-md border border-slate-200 px-4 py-3"
                    >
                      <Label htmlFor={`transaction-${index}-description`}>
                        Description
                      </Label>
                      <Input
                        id={`transaction-${index}-description`}
                        placeholder="null"
                        type="text"
                        className="w-full h-8"
                        onChange={(e) => {
                          const newTransactions = [
                            ...verifiedCardStatement.transactions,
                          ];
                          newTransactions[index].description = e.target.value;
                          setVerifiedCardStatement({
                            ...verifiedCardStatement,
                            transactions: newTransactions,
                          });
                        }}
                        value={transaction.description}
                      />
                      <div className="flex w-full mt-2 justify-between">
                        <div className="w-2/3 flex gap-1.5">
                          <div className="w-3/5">
                            <Label htmlFor={`transaction-${index}-category`}>
                              Category
                            </Label>
                            <Select
                              onValueChange={(value) => {
                                const newTransations = [
                                  ...verifiedCardStatement.transactions,
                                ];
                                newTransations[index].category = value;
                                setVerifiedCardStatement({
                                  ...verifiedCardStatement,
                                  transactions: newTransations,
                                });
                              }}
                              defaultValue={transaction.category}
                            >
                              <SelectTrigger className="w-full h-8">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {cardStatementsSchema.properties.transactions.items.properties.category.enum.map(
                                  (category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="w-1/2">
                            <Label htmlFor={`transaction-${index}-amount`}>
                              Amount
                            </Label>
                            <Input
                              id={`transaction-${index}-amount`}
                              placeholder="null"
                              type="number"
                              className="w-full h-8"
                              onChange={(e) => {
                                const newTransactions = [
                                  ...verifiedCardStatement.transactions,
                                ];
                                newTransactions[index].amount = e.target.value;
                                setVerifiedCardStatement({
                                  ...verifiedCardStatement,
                                  transactions: newTransactions,
                                });
                              }}
                              value={transaction.amount}
                            />
                          </div>
                        </div>
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          className="w-9 p-0 self-end"
                          onClick={() => {
                            const newTransactions = [
                              ...verifiedCardStatement.transactions,
                            ];
                            newTransactions.splice(index, 1);
                            setVerifiedCardStatement({
                              ...verifiedCardStatement,
                              transactions: newTransactions,
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
                  )
                )}
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
              setVerifiedCardStatement({
                ...verifiedCardStatement,
                currency: e.target.value,
              });
            }}
            value={verifiedCardStatement.currency}
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
              setVerifiedCardStatement({
                ...verifiedCardStatement,
                total_amount_due: e.target.value,
              });
            }}
            value={verifiedCardStatement.total_amount_due}
          />
        </div>
      </div>
    </div>
  );
}
