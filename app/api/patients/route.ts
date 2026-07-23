import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Patient from "@/lib/models/medical-tracker";
import { getSession } from "@/lib/auth-server";
import { Column } from "@/lib/models";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patients = await Patient.find({ userId: session.user.id }).sort({
      order: 1,
    });

    return NextResponse.json({ patients }, { status: 200 });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      bloodType,
      allergies,
      medicalHistory,
      columnId,
    } = body;

    if (!firstName || !lastName || !columnId) {
      return NextResponse.json(
        { error: "firstName, lastName et columnId sont requis" },
        { status: 400 }
      );
    }

    const lastPatient = await Patient.findOne({ columnId }).sort({
      order: -1,
    });
    const newOrder = lastPatient ? lastPatient.order + 1 : 0;

    const newPatient = await Patient.create({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      bloodType,
      allergies,
      medicalHistory,
      columnId,
      userId: session.user.id,
      order: newOrder,
    });
    await Column.findByIdAndUpdate(columnId, {
  $push: { patients: newPatient._id },
});
    return NextResponse.json(
      { message: "Patient added successfully", patient: newPatient },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding patient:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}