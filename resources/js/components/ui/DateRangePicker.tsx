// This component was not provided, so I'm providing a basic placeholder.
// You might need to replace this with your actual DateRangePicker implementation.
"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "@/types/admin/dashboard" // Assuming DateRange type is defined here
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !value.startDate && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value.startDate ? (
              value.endDate ? (
                <>
                  {format(value.startDate, "LLL dd, y")} - {format(value.endDate, "LLL dd, y")}
                </>
              ) : (
                format(value.startDate, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value.startDate || new Date()}
            selected={{ from: value.startDate || undefined, to: value.endDate || undefined }}
            onSelect={(range) => onChange({ startDate: range?.from || null, endDate: range?.to || null })}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
