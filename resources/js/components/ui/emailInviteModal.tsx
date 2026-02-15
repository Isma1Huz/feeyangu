"use client"

import React, { useState } from "react"
import {Mail, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmailInvite, DashboardType } from "@/types/admin/dashboard"
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface EmailInviteModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (invites: EmailInvite[]) => void
  onPreview: () => void
  type: DashboardType
}

export function EmailInviteModal({ isOpen, onClose, onSend, onPreview, type }: EmailInviteModalProps) {
  const [invites, setInvites] = useState<Omit<EmailInvite, "type">[]>([{ name: "", email: "" }])

  const addPerson = () => {
    setInvites([...invites, { name: "", email: "" }])
  }

  const updateInvite = (index: number, field: keyof Omit<EmailInvite, "type">, value: string) => {
    const newInvites = [...invites]
    newInvites[index][field] = value
    setInvites(newInvites)
  }

  const handleSend = () => {
    const formattedInvites: EmailInvite[] = invites.map((invite) => ({
      ...invite,
      type,
    }))
    onSend(formattedInvites)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent          
        className="max-w-4xl p-0 sm:p-6 h-[100dvh] sm:h-auto w-full overflow-hidden flex flex-col sm:items-center"
        >
     
     <div className="bg-white ">
        <div className=" py-6">
          <h2 className="text-2xl font-bold mb-4">E-mail uitnodiging versturen</h2>
          <p className="text-sm text-gray-600 mb-6">
            Voer een Naam en E-mailadres in en klik op 'Versturen' om bekenden uit te nodigen
          </p>

          <div className="space-y-4">
            {invites.map((invite, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Naam"
                  value={invite.name}
                  onChange={(e) => updateInvite(index, "name", e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="E-mailadres"
                  value={invite.email}
                  onChange={(e) => updateInvite(index, "email", e.target.value)}
                />
              </div>
            ))}
          </div>

          <Button variant="link" className="justify-start text-teal-600 hover:text-teal-700 mt-4" onClick={addPerson}>
            <Plus className="h-4 w-4 mr-2" />
            voeg extra personen toe
          </Button>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={onPreview}>
              Voorbeeld bekijken
            </Button>
            <Button onClick={handleSend}>
              <Mail className="mr-2 h-4 w-4" />
              Uitnodiging versturen
            </Button>
          </div>
        </div>
      </div>
      </DialogContent>
    </Dialog>
  )
}