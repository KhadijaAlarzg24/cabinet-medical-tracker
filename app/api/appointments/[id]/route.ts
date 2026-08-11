import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Appointment } from "@/lib/models";
import { getSession } from "@/lib/auth-server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  await Appointment.findOneAndDelete({ _id: params.id, userId: session.user.id });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const appointment = await Appointment.findOneAndUpdate(
    { _id: params.id, userId: session.user.id },
    body,
    { new: true }
  );
  return NextResponse.json(appointment);
}