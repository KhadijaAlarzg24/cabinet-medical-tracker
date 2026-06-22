import { getSession } from "@/lib/auth-server";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models"; 
import { redirect } from "next/navigation";
import KanbanBoard from "@/components/kanban-board";

export default async function Dashboard() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  await connectDB();

  const board = await Board.findOne({
    userId: session.user.id,
    name: "Medical Hub",
  }).populate({
  path: "columns",
  populate: {
    path: "patients",
  },});

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Medical Hub</h1>
          <p className="text-gray-600">Gérez vos patients et consultations</p>
        </div>
        
        {board ? (
          <KanbanBoard
            board={JSON.parse(JSON.stringify(board))}
            userId={session.user.id}
          />
        ) : (
          <div className="text-gray-500 text-center py-10">
            Aucun tableau trouvé.
          </div>
        )}
      </div>
    </div>
  );
}