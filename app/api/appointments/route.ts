import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Appointment } from "@/lib/models";
import { getSession } from "@/lib/auth-server";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const appointments = await Appointment.find({ userId: session.user.id }).sort({ date: 1 });
  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const appointment = await Appointment.create({ ...body, userId: session.user.id });
  return NextResponse.json(appointment, { status: 201 });
}