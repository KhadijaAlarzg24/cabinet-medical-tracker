import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Patient, Column } from "@/lib/models";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    // Extract patient ID from the link (folder [id])
    const { id: patientId } = await params;
    
    // Extracting the target column from the body
    const { columnId: newColumnId } = await request.json();

    if (!patientId || !newColumnId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Searching for the patient to find their current column
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const oldColumnId = patient.columnId;

    // 1. Remove the patient from the old column matrix
    if (oldColumnId) {
      await Column.findByIdAndUpdate(oldColumnId, {
        $pull: { patients: patientId },
      });
    }

     // 2. Add the patient to the new column matrix
    await Column.findByIdAndUpdate(newColumnId, {
      $push: { patients: patientId },
    });
    // 3. Update the column within the same patient:
    patient.columnId = newColumnId;
    await patient.save();

    return NextResponse.json({ success: true, patient });
  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}