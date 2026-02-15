import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { DashboardType, EmailTemplate } from "@/types/admin/dashboard";
import { DialogTitle } from "@radix-ui/react-dialog";

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: DashboardType;
  template: EmailTemplate;
}

export function EmailPreviewModal({
  isOpen,
  onClose,
  type,
  template,
}: EmailPreviewModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => onClose()}
      aria-describedby={undefined}
    >
      <DialogTitle></DialogTitle>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-4xl p-0 sm:p-6 h-[100dvh] sm:h-auto w-full overflow-hidden flex flex-col sm:items-center"
      >
        <div className="flex items-center justify-between p-4 border-b sm:hidden w-full">
          <h2 className="font-semibold">Email Preview</h2>
    
        </div>


        <div className="grid gap-4 p-4 sm:py-4 overflow-y-auto flex-grow w-full sm:max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-1 sm:gap-2 text-center sm:text-left">
            <span className="font-medium">Van</span>
            <span>Marcel ter Haar via myFunus</span>

            <span className="font-medium">Onderwerp</span>
            <span>{template.subject}</span>
          </div>

          <div className="space-y-4 mt-2 sm:mt-4">
            <div className="whitespace-pre-line text-sm sm:text-base text-center sm:text-left">
              {template.body}
            </div>

            <div className="flex justify-center sm:justify-start">
              <Button className="bg-red-500 hover:bg-red-600 text-white mt-4 w-full sm:w-auto">
                {["request", "received", "archived"].includes(type)
                  ? "Laat een review achter"
                  : "Bekijk uw opties"}
              </Button>
            </div>

            <div className="bg-[#D1E7DD] p-3 sm:p-4 rounded-lg mt-4 sm:mt-6 text-sm sm:text-base">
              <h3 className="font-bold mb-2 text-center sm:text-left">
                Waarom dit belangrijk is:
              </h3>
              <ol className="list-decimal pl-4 space-y-1 text-center sm:text-left">
                {["request", "received", "archived"].includes(type) ? (
                  <>
                    <li>
                      Helpt anderen bij het kiezen van een uitvaartverzorger
                    </li>
                    <li>Verbetert de kwaliteit van onze dienstverlening</li>
                    <li>Geeft waardevolle feedback voor onze medewerkers</li>
                  </>
                ) : (
                  <>
                    <li>Vergroot uw zichtbaarheid en bereik</li>
                    <li>Genereert extra inkomsten</li>
                    <li>Verbetert uw concurrentiepositie</li>
                  </>
                )}
              </ol>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
