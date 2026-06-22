import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Patient, Column } from "@/lib/models";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // استخراج معرف المريض من الرابط (المجلد [id])
    const { id: patientId } = await params;
    
    // استخراج العمود المستهدف من الـ body
    const { columnId: newColumnId } = await request.json();

    if (!patientId || !newColumnId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // البحث عن المريض لمعرفة عموده الحالي
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const oldColumnId = patient.columnId;

    // 1. إزالة المريض من مصفوفة العمود القديم
    if (oldColumnId) {
      await Column.findByIdAndUpdate(oldColumnId, {
        $pull: { patients: patientId },
      });
    }

    // 2. إضافة المريض إلى مصفوفة العمود الجديد
    await Column.findByIdAndUpdate(newColumnId, {
      $push: { patients: patientId },
    });

    // 3. تحديث العمود داخل المريض نفسه
    patient.columnId = newColumnId;
    await patient.save();

    return NextResponse.json({ success: true, patient });
  } catch (error: any) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}