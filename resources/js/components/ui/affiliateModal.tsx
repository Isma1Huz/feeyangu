"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Share2 } from "lucide-react"
import type { AffiliateOption } from "@/types/admin/dashboard"

interface AffiliateModalProps {
  isOpen: boolean
  onClose: () => void
  onEmailClick: () => void
  data: AffiliateOption[]
}

export function AffiliateModal({ isOpen, onClose, onEmailClick, data }: AffiliateModalProps) {
  const [reviewLink, setReviewLink] = useState(data[0]?.reviewLink || "")

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[800px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-teal-600 text-center sm:text-left">
            Nodig andere uitvaartverzorgers uit en verdien allebei
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-center sm:text-left">Reviewlink versturen</h3>
            <p className="text-sm text-gray-600 text-center sm:text-left">
              Deel uw persoonlijke reviewlink met uw klanten.
            </p>
            <div className="space-y-2">
              <Input value={reviewLink} onChange={(e) => setReviewLink(e.target.value)} className="w-full" />
              <div className="flex flex-col sm:flex-row gap-2 items-center sm:items-start">
                <span className="text-sm text-gray-600">Delen via</span>
                <div className="flex gap-2">
                  <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    E-mail
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    Whatsapp
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-center sm:text-left">E-mailuitnodiging versturen</h3>
            <p className="text-sm text-gray-600 text-center sm:text-left">
              Verstuur een uitnodiging per e-mail om andere uitvaart verzorgers uit te nodigen voor myFunus.
            </p>
            <Button className="w-full bg-[#9DC4BC] hover:bg-[#8ab3aa] text-black" onClick={onEmailClick}>
              <Mail className="mr-2 h-4 w-4" />
              Uitnodiging versturen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

