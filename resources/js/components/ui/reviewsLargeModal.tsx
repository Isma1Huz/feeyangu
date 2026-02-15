"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReviewLargeModalProps {
  isOpen: boolean
  onClose: () => void
  formData: {
    name: string
    email: string
  }
}

export function ReviewLargeModal({ isOpen, onClose, formData }: ReviewLargeModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-sm text-gray-600">Van</div>
            <div>Media4Moments via myFunus</div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-600">Onderwerp</div>
          <div>Beoordeel mijn dienstverlening</div>
        </div>

        <div className="space-y-4 mb-6">
          <p>Beste {formData.name},</p>
          <p>
            Onlangs heb ik voor u een uitvaart mogen verzorgen.
            <br />
            Ik hoop dat dit geheel naar wens is geweest.
          </p>
          <p>
            Ik ben benieuwd naar uw ervaring met ons.
            <br />
            Zou u via mijn persoonlijke pagina op myFunus een beoordeling willen achterlaten.
          </p>
          <p>Alvast bedankt voor uw hulp!</p>
          <Button className="bg-red-500 hover:bg-red-600 text-white">Laat uw review achter</Button>
          <div className="pt-4">
            <p>Met vriendelijke groet,</p>
            <p>Marcel ter Haar</p>
            <p>Media4Moments</p>
          </div>
        </div>

        <div className="bg-teal-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Wat biedt myFunus nog meer?</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Gratis condoleance kaarten versturen</li>
            <li>Digitale wensenlijst</li>
            <li>Digitaal nalatenschap</li>
            <li>Abonnementen opzegservice</li>
            <li>En nog heel veel meer rondom overlijden</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

