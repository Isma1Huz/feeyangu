/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { router } from "@inertiajs/react"

interface PackageConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  packageName: string
  onConfirm: () => Promise<void> | void
}

export function PackageConfirmationModal({
  isOpen,
  onClose,
  packageName,
  onConfirm,
}: PackageConfirmationModalProps) {
  const [couponCode, setCouponCode] = useState("")
  const [couponMessage, setCouponMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false) 

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return

    setLoading(true)
    setCouponMessage(null)

    router.post(
      route("coupon.apply"),
      { coupon: couponCode },
      {
        preserveScroll: true,
        onSuccess: () => {
          setLoading(false)
          setCouponMessage("✅ Coupon applied successfully!")
          setCouponCode("")
        },
        onError: (errors) => {
          setLoading(false)
          const errMsg =
            (errors?.coupon && Array.isArray(errors.coupon) && errors.coupon[0]) ||
            errors?.error ||
            "Er is iets misgegaan bij het toepassen van de coupon."
          setCouponMessage(errMsg)
        },
      }
    )
  }

  const handleConfirmClick = async () => {
    if (confirming) return 
    setConfirming(true)
    try {
      await onConfirm()
    } finally {
      setConfirming(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-w-5xl w-[90vw] bg-white rounded-none shadow-lg">
        <DialogHeader className="text-center space-y-8 pt-16 pb-8 px-8">
          <DialogTitle className="text-3xl text-center font-normal text-gray-800 leading-relaxed">
            U heeft gekozen voor het pakket{" "}
            <span className="font-bold uppercase">{packageName}</span>
          </DialogTitle>
          <p className="text-gray-600 text-center text-xl leading-relaxed">
            U wordt nu doorgestuurd naar de achterliggende pagina's
          </p>
        </DialogHeader>

        {/* Coupon Input */}
        <div className="flex flex-col items-center gap-3 px-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <Input
              placeholder="Voer couponcode in"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={loading || confirming}
              className="rounded-none border-gray-300"
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={loading || confirming}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-none"
            >
              {loading ? "Bezig..." : "Pas coupon toe"}
            </Button>
          </div>

          {couponMessage && (
            <p
              className={`text-sm ${
                couponMessage.startsWith("✅") ? "text-green-600" : "text-red-500"
              }`}
            >
              {couponMessage}
            </p>
          )}
        </div>

        {/* Confirm Button */}
        <div className="flex justify-center pb-16 px-8">
          <Button
            onClick={handleConfirmClick}
            disabled={confirming || loading}
            className={`bg-primary text-white px-12 py-4 text-lg font-bold rounded-none ${
              confirming ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {confirming ? "Verwerken..." : `Ga verder met ${packageName.toUpperCase()}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
