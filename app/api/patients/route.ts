import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Patient, Column } from "@/lib/models";


export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const { firstName, lastName, phone, email, dateOfBirth, address, notes, columnId, boardId, userId } = body;

    if (!firstName || !lastName || !columnId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

   
    const currentUserId = userId || "65f1a2b3c4d5e6f7a8b9c0d1"; 

    const patientData: any = {
      firstName,
      lastName,
      phone,
      email,
      address,
      notes,
      columnId,
      boardId,
      userId: currentUserId, 
    };

    if (dateOfBirth && dateOfBirth.trim() !== "") {
      patientData.birthDate = new Date(dateOfBirth);
    }

 // Patient document successfully created
    const newPatient = await Patient.create(patientData);

    // Connecting the patient to the target column
    await Column.findByIdAndUpdate(columnId, {
      $push: { patients: newPatient._id },
    });

    return NextResponse.json({ success: true, patient: newPatient }, { status: 201 });
  } catch (error: any) {
    console.error("POST Error Details:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}