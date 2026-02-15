"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface TableFiltersProps {
  bulkActions?: { label: string; value: string }[];
  onBulkAction?: (action: string) => void;
  showBulkActions?: boolean; 
}

export default function TableFilters({
  bulkActions = [],
  onBulkAction,
  showBulkActions = false,
}: TableFiltersProps) {

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {showBulkActions && bulkActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {bulkActions.map((action) => (
              <DropdownMenuItem
                key={action.value}
                onClick={() => onBulkAction?.(action.value)}
              >
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
