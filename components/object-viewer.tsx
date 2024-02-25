import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

import ReceiptsViewer from "./receipts-viewer";
import InvoicesViewer from "./invoices-viewer";
import CardStatementsViewer from "./card-statements-viewer";

export function ObjectViewer({
  className,
  category,
  json,
  corrections,
  setVerifiedJson,
}: {
  className?: string;
  category: string;
  json: string;
  corrections: any[];
  setVerifiedJson: (json: any) => void;
}) {
  const correctionsMap = new Map();
  corrections.forEach((correction) => {
    correctionsMap.set(correction.field, correction);
  });
  return (
    <ScrollArea className={cn(className, "w-full h-full rounded-lg p-2")}>
      {category === "receipts" && (
        <ReceiptsViewer
          verifiedReceipt={json}
          setVerifiedReceipt={setVerifiedJson}
          corrections={correctionsMap}
        />
      )}
      {category === "invoices" && (
        <InvoicesViewer
          verifiedInvoice={json}
          setVerifiedInvoice={setVerifiedJson}
          corrections={correctionsMap}
        />
      )}
      {category === "credit card statements" && (
        <CardStatementsViewer
          verifiedCardStatement={json}
          setVerifiedCardStatement={setVerifiedJson}
          corrections={correctionsMap}
        />
      )}
    </ScrollArea>
  );
}
