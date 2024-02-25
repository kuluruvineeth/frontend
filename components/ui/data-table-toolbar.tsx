"use client";
import { Table } from "@tanstack/react-table";
import { Input } from "./input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Button } from "./button";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterColumn: {
    columnId: string;
    placeholder: string;
  };
  categories?: {
    label: string;
    value: string;
  }[];
  statuses?: {
    label: string;
    value: string;
  }[];
}

export function DataTableToolbar<TData>({
  table,
  filterColumn,
  categories,
  statuses,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center space-x-2">
        <Input
          placeholder={filterColumn.placeholder}
          value={
            (table
              .getColumn(filterColumn.columnId)
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn(filterColumn.columnId)
              ?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[200px]"
        />
        {statuses && table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {categories && table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="category"
            options={categories}
          />
        )}
        {isFiltered && (
          <Button
            variant={"ghost"}
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
