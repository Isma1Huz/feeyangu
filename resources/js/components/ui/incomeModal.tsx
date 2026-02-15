"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { IncomeOption } from "@/types/admin/dashboard"

interface IncomePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  data: IncomeOption
  onActivate: () => void
}

export function IncomePreviewModal({ isOpen, onClose, data, onActivate }: IncomePreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{data.product}</DialogTitle>
        </DialogHeader>
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-[180px_1fr] gap-4">
            <span className="font-medium">Product/dienst</span>
            <span>{data.product}</span>

            <span className="font-medium">Prijs promotie</span>
            <span>
              € {data.vergoeding} {data.vergodingUnit}
            </span>

            <span className="font-medium">Omschrijving</span>
            <p className="text-sm text-gray-600">{data.description}</p>
          </div>

          <div className="flex justify-between pt-6">
            <Button onClick={onActivate} className="bg-[#9DC4BC] hover:bg-[#8ab3aa] text-black">
              Activeer
            </Button>
            <Button variant="link" onClick={onClose}>
              Terug naar overzicht opties
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

