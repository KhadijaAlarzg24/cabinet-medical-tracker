"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, X, Clock, User, Check, Ban } from "lucide-react";

interface Appointment {
  _id: string;
  title: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "consultation" | "suivi" | "urgence";
  status: "planifié" | "confirmé" | "annulé" | "terminé";
  notes?: string;
}

const TYPE_COLORS = {
  consultation: "bg-blue-100 text-blue-800 border-blue-200",
  suivi: "bg-green-100 text-green-800 border-green-200",
  urgence: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_COLORS = {
  planifié: "bg-yellow-100 text-yellow-800",
  confirmé: "bg-blue-100 text-blue-800",
  annulé: "bg-red-100 text-red-800",
  terminé: "bg-green-100 text-green-800",
};

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export default function AppointmentCalendar({ userId }: { userId: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    patientName: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00",
    type: "consultation" as const,
    status: "planifié" as const,
    notes: "",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    const res = await fetch("/api/appointments");
    const data = await res.json();
    setAppointments(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({
      title: "", patientName: "", date: "", startTime: "09:00",
      endTime: "10:00", type: "consultation", status: "planifié", notes: "",
    });
    fetchAppointments();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    fetchAppointments();
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchAppointments();
  }

  function getAppointmentsForDay(day: number) {
    return appointments.filter((a) => {
      const d = new Date(a.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  }

  const selectedAppointments = selectedDay ? getAppointmentsForDay(selectedDay) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{MONTHS[month]} {year}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(year, month - 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(year, month + 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-sm font-medium text-gray-400 py-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayAppointments = getAppointmentsForDay(day);
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            const isSelected = selectedDay === day;

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`min-h-[60px] p-1 rounded-lg cursor-pointer border transition-all ${
                  isSelected ? "border-blue-500 bg-blue-50" :
                  isToday ? "border-blue-300 bg-blue-50" :
                  "border-transparent hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className={`text-sm font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday ? "bg-blue-600 text-white" : "text-gray-700"
                }`}>
                  {day}
                </div>
                {dayAppointments.slice(0, 2).map((a) => (
                  <div key={a._id} className={`text-xs px-1 py-0.5 rounded mb-0.5 truncate border ${TYPE_COLORS[a.type]}`}>
                    {a.startTime} {a.patientName}
                  </div>
                ))}
                {dayAppointments.length > 2 && (
                  <div className="text-xs text-gray-400">+{dayAppointments.length - 2}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <Button className="w-full bg-blue-600" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" /> Nouveau Rendez-vous
        </Button>

        {selectedDay && (
          <div className="bg-white rounded-2xl shadow-md p-4">
            <h3 className="font-bold mb-3">{selectedDay} {MONTHS[month]}</h3>
            {selectedAppointments.length === 0 ? (
              <p className="text-gray-400 text-sm">Aucun rendez-vous</p>
            ) : (
              <div className="space-y-3">
                {selectedAppointments.map((a) => (
                  <div key={a._id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{a.title}</p>
                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                          <User className="h-3 w-3" /> {a.patientName}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <Clock className="h-3 w-3" /> {a.startTime} - {a.endTime}
                        </div>
                      </div>
                      <button onClick={() => handleDelete(a._id)} className="text-gray-400 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[a.type]}`}>{a.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[a.status]}`}>{a.status}</span>
                    </div>

                    {a.notes && <p className="text-xs text-gray-500 mt-2">{a.notes}</p>}

                    {/* أزرار تغيير الحالة */}
                    {a.status !== "terminé" && (
                      <div className="flex gap-2 mt-3">
                        {a.status !== "confirmé" && (
                          <button
                            onClick={() => handleStatusChange(a._id, "confirmé")}
                            className="flex-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-lg py-1 hover:bg-blue-100 transition"
                          >
                            ✓ Confirmer
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(a._id, "terminé")}
                          className="flex-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg py-1 hover:bg-green-100 transition"
                        >
                          ✓ Terminé
                        </button>
                        {a.status !== "annulé" && (
                          <button
                            onClick={() => handleStatusChange(a._id, "annulé")}
                            className="flex-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg py-1 hover:bg-red-100 transition"
                          >
                            ✗ Annuler
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Nouveau Rendez-vous</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3">
              <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Nom du patient" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} />
              <input className="w-full border rounded-lg px-3 py-2 text-sm" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="border rounded-lg px-3 py-2 text-sm" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                <input className="border rounded-lg px-3 py-2 text-sm" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
              </div>
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
                <option value="consultation">Consultation</option>
                <option value="suivi">Suivi</option>
                <option value="urgence">Urgence</option>
              </select>
              <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Notes (optionnel)" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Annuler</Button>
                <Button className="flex-1 bg-blue-600" onClick={handleSubmit}>Enregistrer</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}