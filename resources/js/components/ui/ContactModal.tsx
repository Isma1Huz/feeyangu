"use client"
import type { ContactRequest, ContactRequestStatus } from "@/types/dashboard"
import { Dialog, DialogContent } from "@/components/ui/dialog" 

interface ContactDetailsModalProps {
  request: ContactRequest
  onClose: () => void
  onStatusChange: (id: string, status: ContactRequestStatus) => void
}

export function ContactDetailsModal({ request, onClose, onStatusChange }: ContactDetailsModalProps) {
  const statusButtons = [
    {
      status: "followup" as const,
      label: "Nog opvolgen",
      className: "bg-[#F8D7DA] hover:bg-[#f5c2c7] text-[#842029]",
    },
    {
      status: "appointment" as const,
      label: "Afspraak gemaakt",
      className: "bg-[#D1E7DD] hover:bg-[#badbcc] text-[#0F5132]",
    },
    {
      status: "waiting" as const,
      label: "Wachten op reactie",
      className: "bg-[#FFE5D0] hover:bg-[#ffdab8] text-[#9A3412]",
    },
    {
      status: "archived" as const,
      label: "Archiveren",
      className: "bg-[#CFE2FF] hover:bg-[#b6d4fe] text-[#084298]",
    },
  ]

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-[700px] lg:max-w-8xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4">
         
          <div className="space-y-4 mt-2 text-[15px]">
            <div className="grid grid-cols-[200px_1fr] gap-2">
              <span className="font-semibold text-gray-900">Type aanvraag</span>
              <span className="text-gray-700">{request.type}</span>
            </div>
            <div className="grid grid-cols-[200px_1fr] gap-2">
              <span className="font-semibold text-gray-900">Naam</span>
              <span className="text-gray-700">{request.name}</span>
            </div>
            <div className="grid grid-cols-[200px_1fr] gap-2">
              <span className="font-semibold text-gray-900">Aangevraagd op</span>
              <span className="text-gray-700">{request.created_at}</span>
            </div>
            <div className="grid grid-cols-[200px_1fr] gap-2">
              <span className="font-semibold text-gray-900">Gewenste reactie termijn</span>
              <span className="text-gray-700">{request.response_time}</span>
            </div>
            <div className="grid grid-cols-[200px_1fr] gap-2">
              <span className="font-semibold text-gray-900">E-mailadres</span>
              <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline">
                {request.email}
              </a>
            </div>
            <div className="grid grid-cols-[200px_1fr] gap-2">
              <span className="font-semibold text-gray-900">Telefoonnummer</span>
              <span className="text-gray-700">{request.phone}</span>
            </div>
            <div className="grid grid-cols-[200px_1fr] gap-2">
              <span className="font-semibold text-gray-900">Bericht</span>
              <span className="text-gray-700">{request.message}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 mb-8">
            {statusButtons.map((button) => (
              <button
                key={button.status}
                onClick={() => onStatusChange(request.id, button.status)}
                className={`${button.className} px-4 py-2 text-sm font-medium transition-colors duration-200 `}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
