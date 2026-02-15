import * as React from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  searchKey?: keyof TData | string; // optional; used by callers for client-side filtering
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData>({ columns, data, searchKey, onRowClick }: DataTableProps<TData>) {
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    if (!query) return data;
    const key = (searchKey as string) || '';
    try {
      return data.filter((item: any) => {
        if (!key) {
          // shallow scan common scalar fields
          return Object.values(item || {}).some((v) => String(v ?? '').toLowerCase().includes(query.toLowerCase()));
        }
        const v = item?.[key];
        return String(v ?? '').toLowerCase().includes(query.toLowerCase());
      });
    } catch {
      return data;
    }
  }, [data, query, searchKey]);

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto">
      {searchKey ? (
        <div className="p-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full max-w-sm rounded border px-3 py-2 text-sm"
          />
        </div>
      ) : null}

      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row.original)}
              className={`${onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
