import React, { useState, useEffect, useMemo } from "react";
import useTableStore from "@/store/useTableStore";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  // pagination & sorted
  getPaginationRowModel,
  getSortedRowModel,
  // faceted
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

const V8TableContainer = ({ data, columns, searching, setSearching }) => {
  const defaultData = useMemo(() => [], []);

  // Row Selection
  const [rowSelection, setRowSelection] = useState({});
  // VisibilityState
  const [columnVisibility, setColumnVisibility] = useState({});
  // ColumnFiltersState
  const [columnFilters, setColumnFilters] = useState([]);
  // SortingState
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    state: {
      globalFilter: searching, // dari search input
      sorting, // ketika di klik tablenya / sorting manual
      columnFilters, // untuk memfilter tiap kolum tapi belom di terapkan
      columnVisibility,
      rowSelection,
    },
    //  - SET STATE
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection, // baru
    onSortingChange: setSorting, // sorting manual
    OnGlobalFilterChange: setSearching, // lama
    onColumnFiltersChange: setColumnFilters, // baru
    onColumnVisibilityChange: setColumnVisibility, // baru
    //  -  OPSI LAMA
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //  - OPSI BARU
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  const { setTable } = useTableStore();
  useEffect(() => {
    setTable(table); // Menyimpan instance table ke store
  }, [table]);

  // Fungsi untuk menghandle perpindahan halaman
  const nextPage = () => {
    if (table.getState().pagination.pageIndex < table.getPageCount() - 1) {
      table.setPageIndex(table.getState().pagination.pageIndex + 1);
    }
  };

  const previousPage = () => {
    if (table.getState().pagination.pageIndex > 0) {
      table.setPageIndex(table.getState().pagination.pageIndex - 1);
    }
  };

  return (
    <div className="flex flex-col mt-6 mb-12">
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 ${
                          header.column.columnDef.id === "foto"
                            ? "px-4"
                            : "py-3.5 px-4"
                        }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-4 text-sm whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center my-4">
        <button
          onClick={previousPage}
          className="p-2 text-gray-600 hover:text-gray-800 dark:hover:text-white"
          disabled={table.getState().pagination.pageIndex === 0}
        >
          <ChevronLeft size={20} />
        </button>
        <span>
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <button
          onClick={nextPage}
          className="p-2 text-gray-600 hover:text-gray-800 dark:hover:text-white"
          disabled={
            table.getState().pagination.pageIndex >= table.getPageCount() - 1
          }
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default V8TableContainer;
