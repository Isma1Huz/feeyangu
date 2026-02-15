'use client';
import { X } from 'lucide-react';
import type { Invoice } from "@/types/admin/dashboard";
import { Dialog, DialogContent } from "./dialog";
import { Button } from './button';

interface InvoiceModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export function InvoiceModal({ invoice, onClose }: InvoiceModalProps) {
const handleExport = () => {
  window.location.href = `/invoices/${invoice.id}/download`;
};

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-full max-w-[700px] lg:max-w-8xl max-h-[90vh] overflow-y-auto
                   bg-white shadow-lg  p-0"
      >
        <div className="px-6 py-4">
          <div className="flex justify-between items-start sticky top-0 bg-white z-10 ">
            <div className="flex items-center gap-2">
              <img src="/myfunus-logo.png" alt="myFunus logo" className="h-6 sm:h-8" />
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <h2 className="text-lg sm:text-xl font-bold w-full text-center mb-2">
            FACTUUR
          </h2>
          <div className="px-2 py-0 space-y-0">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="space-y-1">
                  <div className="grid grid-cols-[120px_1fr] gap-1 text-[13px] whitespace-nowrap">
                    <span className="text-gray-600">Datum</span>
                    <span>: {new Date(invoice.invoice_date).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-1 text-[13px] whitespace-nowrap">
                    <span className="text-gray-600">Factuurnummer</span>
                    <span>: {invoice.invoice_number}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-1 text-[13px] whitespace-nowrap">
                    <span className="text-gray-600">Debiteurennummer</span>
                    <span>: {invoice.customer_details?.debtor_number || 'N.v.t.'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-1 text-[13px] whitespace-nowrap">
                    <span className="text-gray-600">Specificatie</span>
                    <span>: {invoice.customer_details?.specification || 'N.v.t.'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full mt-8 min-w-[600px]">
                <thead className="border-b">
                  <tr className="">
                    <th className="text-left py-2">Omschrijving</th>
                    <th className="text-right py-2">Aantal</th>
                    <th className="text-right py-2">Prijs/eenh</th>
                    <th className="text-right py-2">Bedrag</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.line_items && invoice.line_items.length > 0 ? (
                    invoice.line_items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3">
                          <div>{item.description}</div>
                        </td>
                        <td className="text-right py-3">{item.quantity}</td>
                        <td className="text-right py-3">
                          € {item.unit_price.toFixed(2)}
                        </td>
                        <td className="text-right py-3">
                          € {(item.quantity * item.unit_price).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-500">Geen specificaties beschikbaar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-8">
              <Button
                className="bg-[#DC3545] hover:bg-[#bb2d3b] text-white px-6 py-2 transition-colors duration-200"
                onClick={handleExport}
                type='button'
              >
                Exporteren
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
