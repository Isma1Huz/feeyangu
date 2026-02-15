"use client";
import { format } from 'date-fns';
import { Dialog, DialogContent } from "@/components/ui/dialog"; 
import { MessageStatus, NotificationItem } from '@/types/dashboard';

interface MessageDetailsModalProps {
  message: NotificationItem;
  onClose: () => void;
  onStatusChange: (id: string, status: MessageStatus) => void;
}

export function MessageDetailsModal({
  message,
  onClose,
  onStatusChange,
}: MessageDetailsModalProps) {
  const statusButtons = [
    {
      status: "unread" as const,
      label: "Ongelezen",
      className: "bg-[#F8D7DA] hover:bg-[#f5c2c7] text-[#842029]",
    },
    {
      status: "read" as const,
      label: "Gelezen",
      className: "bg-[#D1E7DD] hover:bg-[#badbcc] text-[#0F5132]",
    },
  ];
  const subject = message.data.message || "Geen onderwerp";
  const from = message.data.user_name || "Onbekend";
  const content = message.data.message || "Geen berichtinhoud";
  const date = format(new Date(message.created_at), 'dd-MM-yyyy HH:mm');

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-[700px] lg:max-w-8xl max-h-[90vh] overflow-y-auto">
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">

          <div className="text-sm sm:text-[15px] mt-6 sm:mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start mb-4">
              <span className="font-semibold text-gray-900">Onderwerp</span>
              <span className="text-gray-700">{subject}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start mb-4">
              <span className="font-semibold text-gray-900">Van</span>
              <span className="text-gray-700">{from}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start mb-4">
              <span className="font-semibold text-gray-900">Bericht</span>
              <div className="text-gray-700 space-y-4 sm:space-y-6 min-h-[80px]">
                <p>Beste {message.data.user_name || 'gebruiker'},</p>
                <p className="leading-relaxed">{content}</p>
                <div className="min-h-[10px]">
                  <button className="bg-[#DC3545] hover:bg-[#bb2d3b] text-white px-4 sm:px-6 py-2 sm:py-2.5 text-sm transition-colors duration-200 w-full sm:w-auto">
                    Ontdek Premium
                  </button>
                  <p className="mt-4 text-sm sm:text-[15px]">
                    Wist u dat u naast de promotie op myFunus tevens{" "}
                    <a href="#" className="underline hover:text-gray-900">
                      extra inkomsten genereren
                    </a>{" "}
                    via onze Producten? Deze kunt u ook vinden onder Premium.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 items-start mb-4">
              <span className="font-semibold text-gray-900">Ontvangen op</span>
              <span className="text-gray-700">{date}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-5">
            {statusButtons.map((button) => (
              <button
                key={button.status}
                onClick={() => onStatusChange(message.id, button.status)}
                className={`${button.className} px-4 py-2.5 text-sm font-medium transition-colors duration-200 w-full`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
