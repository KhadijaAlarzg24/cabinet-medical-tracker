import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Patient from "@/lib/models/medical-tracker";
import Column from "@/lib/models/column";
import { getSession } from "@/lib/auth-server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { columnId: newColumnId } = body;

    if (!newColumnId) {
      return NextResponse.json(
        { error: "columnId est requis" },
        { status: 400 }
      );
    }

    // Récupérer le patient pour connaître son ancienne colonne
    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ error: "Patient introuvable" }, { status: 404 });
    }

    const oldColumnId = patient.columnId;

    // Si la colonne n'a pas changé, aucune mise à jour n'est nécessaire
    if (oldColumnId.toString() === newColumnId) {
      return NextResponse.json(
        { message: "Patient déplacé avec succès", id },
        { status: 200 }
      );
    }

    // 1. Mettre à jour le columnId dans le document du patient
    await Patient.findByIdAndUpdate(id, { columnId: newColumnId });

    // 2. Retirer le patient du tableau de l'ancienne colonne
    await Column.findByIdAndUpdate(oldColumnId, {
      $pull: { patients: id },
    });

    // 3. Ajouter le patient au tableau de la nouvelle colonne
    await Column.findByIdAndUpdate(newColumnId, {
      $push: { patients: id },
    });

    return NextResponse.json(
      { message: "Patient déplacé avec succès", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du patient:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}