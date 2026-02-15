/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/general";

export interface ColumnConfig<T> {
  key: string;
  label: string;
  width?: number;
  flexGrow?: number;
  render?: (rowData: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  keyField: string;
  selectedRowKeys: string[];
  setSelectedRowKeys: (keys: string[]) => void;
  onRowClick?: (rowData: T) => void;
  emptyState?: React.ReactNode;
  isLoading?: boolean;
}

export function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  keyField,
  selectedRowKeys,
  setSelectedRowKeys,
  onRowClick,
  emptyState,
}: DataTableProps<T>) {
  const checkAllRef = useRef<HTMLInputElement | null>(null);
  const isMobile = useIsMobile();

  // Sync "check all" indeterminate
  useEffect(() => {
    if (checkAllRef.current) {
      checkAllRef.current.indeterminate =
        selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;
    }
  }, [selectedRowKeys, data]);

  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(data.map((item) => String(item[keyField])));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleCheck = (value: string, checked: boolean) => {
    let keys: string[];
    if (checked) {
      keys = [...selectedRowKeys, value];
    } else {
      keys = selectedRowKeys.filter((item) => item !== value);
    }
    setSelectedRowKeys(keys);
  };

  const calculateColumnWidths = () => {
    const totalFlexGrow = columns.reduce(
      (sum, col) => sum + (col.flexGrow || 0),
      0
    );
    return columns.map((col) => ({
      ...col,
      width: col.flexGrow
        ? `${(col.flexGrow / totalFlexGrow) * 100}%`
        : undefined,
    }));
  };

  const columnWithWidths = calculateColumnWidths();

  if (data.length === 0 && emptyState) {
    return <div className="w-full">{emptyState}</div>;
  }

  return (
    <div className="w-full">
      <div className="w-full">
        <table className="w-full border-collapse whitespace-nowrap text-sm bg-white shadow-md">
          <thead className="text-teal-600 font-medium sticky top-0 bg-white">
            <tr>
              <th className={`p-${isMobile ? "2" : "3"} w-12 text-center`}>
                <input
                  ref={checkAllRef}
                  type="checkbox"
                  checked={
                    data.length > 0 &&
                    selectedRowKeys.length === data.map((d) => String(d[keyField])).length
                  }
                  onChange={(e) => handleCheckAll(e.target.checked)}
                />
              </th>
              {columnWithWidths.map((column) => (
                <th
                  key={column.key}
                  className={`p-${isMobile ? "2" : "3"} text-left text-${
                    isMobile ? "xs" : "sm"
                  }`}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 || columns.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center text-sm text-gray-500 py-4"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((rowData) => {
                const rowKey = String(rowData[keyField]); // normalize to string
                return (
                  <tr
                    key={rowKey}
                    className={`text-${isMobile ? "xs" : "sm"} bg-white hover:bg-gray-50 cursor-pointer`}
                    onClick={(e) => {
                      if (!(e.target as HTMLElement).closest("input")) {
                        onRowClick?.(rowData);
                      }
                    }}
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRowKeys.includes(rowKey)}
                        onChange={(e) => handleCheck(rowKey, e.target.checked)}
                      />
                    </td>
                    {columnWithWidths.map((column) => (
                      <td
                        key={column.key}
                        className={`p-${isMobile ? "2" : "3"} text-left`}
                      >
                        {column.render
                          ? column.render(rowData)
                          : rowData[column.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
