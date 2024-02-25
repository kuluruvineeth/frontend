"use client";

import { CardStatement, CardTransaction } from "@prisma/client";
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { deleteExtraction, updateCardStatement } from "@/lib/client-requests";
import { useRouter } from "next/navigation";
import { Icons } from "./icons";
import CardStatementsViewer from "./card-statements-viewer";

type CardStatementWithTransactions = CardStatement & {
  transactions: CardTransaction[];
};

export function SheetCardStatement({ uuid }: { uuid: string }) {
  const router = useRouter();
  const [cardStatement, setCardStatement] =
    useState<CardStatementWithTransactions | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfDisplayed, setIsPdfDisplayed] = useState(false);
  const [editedCardStatement, setEditedCardStatement] =
    useState<CardStatementWithTransactions | null>(null);

  async function fetchCardStatement(uuid: string) {
    const res = await fetch(`/api/card-statements?uuid=${uuid}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("No receipt found");
    }
    const cardStatement = await res.json();
    return cardStatement;
  }

  useEffect(() => {
    const fetch = async () => {
      const cardStatement = await fetchCardStatement(uuid);
      cardStatement.date = cardStatement?.date
        ? new Date(cardStatement.date).toISOString().split("T")[0]
        : null;
      setCardStatement(cardStatement);
      setEditedCardStatement(cardStatement);
    };

    fetch();
  }, []);

  return (
    <div className="h-full w-full my-4 relative">
      <h1 className="text-2xl font-bold">Card Statement</h1>
      {!isEditing && cardStatement && (
        <div className="w-full">
          <div className="mt-10 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">
              Credit Card
            </h2>
            <p className="text-slate-700">
              {cardStatement.creditCardNumber ?? "No Number"}
            </p>
            <p className="text-slate-700">
              {" "}
              {cardStatement.creditCardName ?? ""}
            </p>
            <p className="text-slate-700">
              {" "}
              {cardStatement.creditCardHolder ?? ""}
            </p>
          </div>
          <div className="mt-3">
            <div>
              <h3 className="font-semibold text-slate-900">Date</h3>
              <p className="text-slate-700 tex-sm leading-snug">
                <span>{cardStatement.date as unknown as string}</span>
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Issuer</h3>
              <p className="text-slate-700 text-sm leading-snug">
                {cardStatement.issuerName}
              </p>
              {cardStatement.issuerAddress && (
                <p className="text-slate-700 text-sm leading-snug">
                  {cardStatement.issuerAddress}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Recipient</h3>
              <p className="text-slate-700 text-sm leading-snug">
                {cardStatement.recipientName ?? "Unknown"}
              </p>
              {cardStatement.recipientAddress && (
                <p className="text-slate-700 text-sm leading-snug">
                  {cardStatement.recipientAddress}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Items</h2>
              <div className="mt-2 mb-1 grid grid-cols-8 font-medium">
                <h4 className="col-span-4">Description</h4>
                <h4 className="col-span-2 justify-self-end">Category</h4>
                <h4 className="col-span-2 justify-self-end">Amount</h4>
              </div>
              <div className="h-full max-h-52 2xl:max-h-96 overflow-scroll">
                {cardStatement.transactions.map((item) => (
                  <div
                    key={item.id}
                    className="mt-1 grid grid-cols-8 text-sm text-slate-700"
                  >
                    <p
                      className="col-span-4 truncate overflow-hidden"
                      title={item.description ?? ""}
                    >
                      {item.description}
                    </p>
                    <p className="col-span-2 justify-self-end">
                      {item.category.charAt(0).toUpperCase() +
                        item.category.slice(1)}
                    </p>
                    <p className="col-span-2 justify-self-end">
                      {item.amount?.toFixed(2) ?? "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-rows-1 justify-items-end">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900 text-end">
                Total Amount Due
              </h3>
              <p className="text-slate-700 text-lg leading-snug text-end">
                {cardStatement.totalAmountDue?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
      {isEditing && cardStatement && (
        <div className="w-full h-full">
          <div className="w-full h-3/4 p-1 mt-2 border border-slate-200 border-dashed rounded-lg">
            <CardStatementsViewer
              verifiedCardStatement={editedCardStatement}
              setVerifiedCardStatement={setEditedCardStatement}
              corrections={new Map()}
            />
          </div>
          <div className="mt-2 flex gap-2 justify-end">
            <Button
              variant={"secondary"}
              className="w-20"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-40"
              disabled={isUpdating}
              onClick={async () => {
                setIsUpdating(true);
                await updateCardStatement(editedCardStatement);
                const newReceipt = await fetchCardStatement(uuid);
                setCardStatement(newReceipt);
                setEditedCardStatement(newReceipt);
                setIsEditing(false);
                setIsUpdating(false);
                router.refresh();
                router.push("/card-statements");
              }}
            >
              {isUpdating && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm
            </Button>
          </div>
        </div>
      )}
      <div className="w-full flex gap-2 items-center justify-between absolute bottom-2 right-0">
        <div className="flex items-center gap-1">
          <Switch
            id="display-pdf"
            onCheckedChange={async () => {
              if (!isPdfDisplayed) {
                const res = await fetch(
                  `/api/signed-url?uuid=${cardStatement?.extractionId}`,
                  {
                    method: "GET",
                  }
                );

                const { url } = await res.json();
                setPdfUrl(url);
              }
              setIsPdfDisplayed((isPdfDisplayed) => !isPdfDisplayed);
            }}
            checked={isPdfDisplayed}
          />
          <Label htmlFor="bulk-processing">Display PDF</Label>
        </div>

        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Receipt</AlertDialogTitle>
                <AlertDialogDescription className="pt-4">
                  Are you sure? This will permanently delete the current receipt
                  and remove the associated file. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    setIsPdfDisplayed(false);
                    await deleteExtraction(cardStatement!.extractionId);
                    window.location.reload();
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"} className="w-20">
                Delete
              </Button>
            </AlertDialogTrigger>
          </AlertDialog>
          {!isEditing && (
            <Button
              className="w-20"
              onClick={() => {
                setEditedCardStatement(cardStatement);
                setIsEditing(true);
              }}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
      {isPdfDisplayed && pdfUrl !== null && (
        <object
          data={`${pdfUrl}#toolbar=1&navpanes=0&statusbar=0&scrollbar=1&view=fit`}
          type="application/pdf"
          style={{ width: "calc(100vw - 512px)", marginRight: "488px" }}
          className="h-screen absolute -top-10 right-0"
        />
      )}
    </div>
  );
}
