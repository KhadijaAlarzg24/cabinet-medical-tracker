"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreatePatientDialogProps {
  columnId: string;
  boardId: string;
}

export default function CreatePatientDialog({
  columnId,
  boardId,
}: CreatePatientDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit() {
    if (!firstName || !lastName) return;

    await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        phone,
        email,
        dateOfBirth,
        address,
        notes,
        columnId,
        boardId,
      }),
    });

    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setDateOfBirth("");
    setAddress("");
    setNotes("");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-blue-600 hover:bg-white/90 text-sm font-medium">
          <Plus className="h-4 w-4 mr-1" />
          Ajouter un patient
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau Patient</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Prénom *</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prénom" />
            </div>
            <div>
              <Label>Nom *</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nom de famille" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Téléphone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 00 00 00 00" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date de naissance</Label>
              <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
            </div>
            <div>
              <Label>Adresse</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Adresse" />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes médicales..." />
          </div>
          <Button onClick={handleSubmit} className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Ajouter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}