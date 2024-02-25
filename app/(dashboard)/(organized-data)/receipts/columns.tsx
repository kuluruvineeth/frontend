"use client";
import { SheetReceipt } from "@/components/sheet-receipt";
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { deleteExtraction } from "@/lib/client-requests";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, PanelRightOpen, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export type Extraction = {
  id: string;
  extractionId: string;
  extraction: {
    filename: string;
  };
  category: "retail" | "groceries" | "restaurant" | "cafe" | "other";
  from: string;
  total: number;
  number: string | null;
  createdAt: Date;
  date: Date | null;
};

export const categories = [
  {
    value: "retail",
    label: "Retail",
    textClass: "text-sky-500",
    borderClass: "border-sky-300",
    fillColorClass: "fill-sky-800",
    bgColorClass: "bg-sky-800",
  },
  {
    value: "groceries",
    label: "Groceries",
    textClass: "text-orange-500",
    borderClass: "border-orange-300",
    fillColorClass: "fill-orange-800",
    bgColorClass: "bg-orange-800",
  },
  {
    value: "restaurant",
    label: "Restaurant",
    textClass: "text-violet-500",
    borderClass: "border-violet-300",
    fillColorClass: "fill-violet-800",
    bgColorClass: "bg-violet-800",
  },
  {
    value: "cafe",
    label: "Cafe",
    textClass: "text-cyan-500",
    borderClass: "border-cyan-300",
    fillColorClass: "fill-sky-800",
    bgColorClass: "bg-sky-800",
  },
  {
    value: "other",
    label: "Other",
    textClass: "text-gray-500",
    borderClass: "border-gray-300",
    fillColorClass: "fill-gray-800",
    bgColorClass: "bg-gray-800",
  },
];

export const columns: ColumnDef<Extraction>[] = [
  {
    accessorKey: "number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number" />
    ),
    cell: ({ row }) => {
      const value = row.original.number === "" ? "None" : row.original.number;
      return (
        <div
          className={cn(
            value === "None"
              ? "text-slate-400"
              : "text-slate-900 overflow-hidden truncate 2xl:w-full 2xl:max-w-3xl",
            "w-16"
          )}
          title={row.getValue("number")}
        >
          {value}
        </div>
      );
    },
  },
  {
    id: "category",
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="category" />
    ),
    cell: ({ row }) => {
      const category = categories.find(
        (category) => category.value === row.original.category
      );
      return (
        <div className="w-24">
          {(category?.value && (
            <Badge
              variant={"outline"}
              className={cn("py-1", category.textClass, category.borderClass)}
            >
              {category.label}
            </Badge>
          )) || (
            <div className="text-xs font-medium text-slate-400 ml-4">None</div>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "from",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="From" />
    ),
    cell: ({ row }) => (
      <div
        title={row.getValue("from")}
        className="w-40 2xl:w-full 2xl:max-w-3xl truncate overflow-hidden text-slate-900"
      >
        {row.getValue("from")}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div
        title={row.getValue("date")}
        className={cn(
          row.original.date === null ? "text-slate-400" : "text-slate-900",
          "w-32"
        )}
      >
        {row.original.date === null
          ? "None"
          : row.getValue<Date>("date").toLocaleDateString("en-US")}
      </div>
    ),
  },

  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => (
      <div
        title={row.getValue("total")}
        className="w-20 2xl:w-full 2xl:max-w-3xl truncate overflow-hidden text-slate-900"
      >
        {row.getValue("total")}
      </div>
    ),
  },
  {
    id: "filename",
    accessorFn: (row) => row.extraction.filename,
    accessorKey: "filename",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File name" />
    ),
    cell: ({ row }) => (
      <div
        title={row.getValue("filename")}
        className="w-32 2xl:w-full 2xl:max-w-3xl truncate overflow-hidden text-slate-900"
      >
        {row.getValue("filename")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Extraction Date" />
    ),
    cell: ({ row }) => (
      <div className="w-32 text-slate-900">
        {row.getValue<Date>("createdAt").toLocaleDateString("en-US")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const router = useRouter();

      return (
        <Sheet>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="flex h-8 w-8 p-0 data-[state=open]:bg-slate-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem className="cursor-pointer">
                  <SheetTrigger asChild>
                    <div className="flex items-center w-full">
                      <PanelRightOpen className="mr-2 h-3.5 w-3.5 text-slate-900/70" />
                      Show
                    </div>
                  </SheetTrigger>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <AlertDialogTrigger asChild>
                    <div className="flex items-center w-full">
                      <Trash className="mr-2 h-3.5 w-3.5 text-slate-900/70" />
                      Delete
                    </div>
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                    await deleteExtraction(row.original.extractionId);
                    router.refresh();
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <SheetContent className="w-[512px]">
            <SheetReceipt uuid={row.original.id} />
          </SheetContent>
        </Sheet>
      );
    },
  },
];
