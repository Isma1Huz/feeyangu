"use client"

import { useState, useEffect, useCallback } from "react"
import type { PromotionalOption, IncomeOption } from "@/types/admin/dashboard"
import { DateRange } from "./dateRange"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

type ModalData = PromotionalOption | IncomeOption

interface PremiumModalProps {
  data: ModalData
  onClose: () => void
  onPeriodChange: (value: [Date, Date] | null) => void
  onSelect: () => void
  onActivate: () => void
}

export function PremiumModal({ data, onClose, onPeriodChange, onSelect, onActivate }: PremiumModalProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const textClass = "text-sm font-semibold text-black"

  const isPromotionalData = useCallback((data: ModalData): data is PromotionalOption => {
    return data.type === "promotional"
  }, [])

  useEffect(() => {
    if (isPromotionalData(data) && data.dateRange) {
      const [startStr, endStr] = data.dateRange.split(" - ")
      const start = new Date(startStr)
      const end = new Date(endStr)
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        setDateRange([start, end])
      }
    } else {
      setDateRange([null, null])
    }
  }, [data, isPromotionalData])

  const handleDateRangeChange = (range: [Date | null, Date | null]) => {
    setDateRange(range)
    if (range[0] && range[1]) {
      onPeriodChange([range[0], range[1]])
    } else {
      onPeriodChange(null)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
         

          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-2 items-start">
              <span className={textClass}>Product/dienst</span>
              <span className="text-sm">{data.product}</span>

              <span className={textClass}>{isPromotionalData(data) ? "Prijs promotie" : "Vergoeding (excl BTW)"}</span>
              <span className="text-sm">
                {isPromotionalData(data) ? data.price : (data as IncomeOption).vergoeding}
              </span>

              {isPromotionalData(data) && (
                <>
                  <span className={textClass}>Periode</span>
                  <div className="flex items-center gap-2 sm:gap-3 w-full">
                    <DateRange value={dateRange} onChange={handleDateRangeChange} />
                  </div>
                </>
              )}

              <span className={textClass}>Weergave</span>
              <img src="/img/previewPremium.png" alt="Premium preview" className="w-[260px]" />

              <h3 className={textClass}>Omschrijving</h3>
              <p className="text-sm text-black leading-relaxed">{data.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-10 pt-2">
              {isPromotionalData(data) ? (
                <Button
                  onClick={onSelect}
                  disabled={!dateRange[0] || !dateRange[1]}
                  className={`${
                    data.dateRange
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-[#9DC4BC] hover:bg-[#8ab3aa] disabled:opacity-50 disabled:cursor-not-allowed"
                  } text-black px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold transition-colors rounded-md w-full sm:w-auto`}
                >
                  {data.dateRange ? "Verwijder deze optie" : "Selecteer deze optie"}
                </Button>
              ) : (
                <Button
                  // onClick={onActivate}
                  disabled={true}
                  className="bg-[#9DC4BC] hover:bg-[#8ab3aa] text-black px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold transition-colors rounded-md w-full sm:w-auto"
                >
                  Activeer
                </Button>
              )}
              <Button
                variant="link"
                onClick={onClose}
                className="text-gray-600 underline text-xs sm:text-sm hover:text-gray-900"
              >
                Terug naar overzicht opties
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
