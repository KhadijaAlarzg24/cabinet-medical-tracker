import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import AppointmentCalendar from "@/components/appointment-calendar";

export default async function AppointmentsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Rendez-vous</h1>
          <p className="text-gray-600">Gérez vos rendez-vous et consultations</p>
        </div>
        <AppointmentCalendar userId={session.user.id} />
      </div>
    </div>
  );
}