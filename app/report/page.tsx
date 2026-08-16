import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import { Patient, Appointment } from "@/lib/models";
import { FileText, Users, Calendar, TrendingUp, Clock, CheckCircle } from "lucide-react";

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export default async function ReportPage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  await connectDB();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const userId = session.user.id;

  // المرضى
  const totalPatients = await Patient.countDocuments({ userId });
  const newPatientsThisMonth = await Patient.countDocuments({
    userId,
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  });
  const newPatientsLastMonth = await Patient.countDocuments({
    userId,
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
  });

  // المواعيد
  const totalAppointments = await Appointment.countDocuments({ userId });
  const appointmentsThisMonth = await Appointment.countDocuments({
    userId,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });
  const completedAppointments = await Appointment.countDocuments({
    userId,
    status: "terminé",
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });
  const cancelledAppointments = await Appointment.countDocuments({
    userId,
    status: "annulé",
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  // آخر المرضى
  const recentPatients = await Patient.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5);

  // آخر المواعيد
  const recentAppointments = await Appointment.find({ userId })
    .sort({ date: -1 })
    .limit(5);

  const patientGrowth = newPatientsLastMonth > 0
    ? Math.round(((newPatientsThisMonth - newPatientsLastMonth) / newPatientsLastMonth) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Rapport Mensuel</h1>
            <p className="text-gray-600">{MONTHS[now.getMonth()]} {now.getFullYear()}</p>
          </div>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Rapport automatique</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              {patientGrowth !== 0 && (
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  patientGrowth > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {patientGrowth > 0 ? "+" : ""}{patientGrowth}%
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalPatients}</p>
            <p className="text-gray-500 text-sm mt-1">Total Patients</p>
            <p className="text-blue-600 text-xs mt-2">+{newPatientsThisMonth} ce mois</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{appointmentsThisMonth}</p>
            <p className="text-gray-500 text-sm mt-1">Rendez-vous ce mois</p>
            <p className="text-green-600 text-xs mt-2">{totalAppointments} au total</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{completedAppointments}</p>
            <p className="text-gray-500 text-sm mt-1">Consultations terminées</p>
            <p className="text-purple-600 text-xs mt-2">ce mois</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{cancelledAppointments}</p>
            <p className="text-gray-500 text-sm mt-1">Annulations</p>
            <p className="text-red-600 text-xs mt-2">ce mois</p>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Patients */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-lg">Derniers Patients</h3>
            </div>
            {recentPatients.length === 0 ? (
              <p className="text-gray-400 text-sm">Aucun patient</p>
            ) : (
              <div className="space-y-3">
                {recentPatients.map((p: any) => (
                  <div key={p._id} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {p.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{p.firstName} {p.lastName}</p>
                        <p className="text-gray-400 text-xs">{p.phone || "—"}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-green-600" />
              <h3 className="font-bold text-lg">Derniers Rendez-vous</h3>
            </div>
            {recentAppointments.length === 0 ? (
              <p className="text-gray-400 text-sm">Aucun rendez-vous</p>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((a: any) => (
                  <div key={a._id} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div>
                      <p className="font-medium text-sm">{a.title}</p>
                      <p className="text-gray-400 text-xs">{a.patientName} — {a.startTime}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      a.status === "terminé" ? "bg-green-100 text-green-700" :
                      a.status === "annulé" ? "bg-red-100 text-red-700" :
                      a.status === "confirmé" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}