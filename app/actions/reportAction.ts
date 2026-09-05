'use server';

import { GoogleGenAI } from "@google/genai";
import connectDB from "@/lib/db";
import Patient from "@/lib/models/medical-tracker";
import { getSession } from "@/lib/auth-server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function generateDatabaseSmartReport() {
  try {
    // 1. التحقق من المصادقة تماماً كما في الـ API Routes لديك
    const session = await getSession();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. الاتصال بقاعدة البيانات
    await connectDB();

    // 3. جلب جميع المرضى الخاصين بالمستخدم الحالي من MongoDB
    const patients = await Patient.find({ userId: session.user.id });

    // 4. استخراج إحصائيات حقيقية من بيانات المرضى
    const totalPatients = patients.length;

    // استخراج فصائل الدم والأمراض السابقة أو التاريخ الطبي لتحليلها
    const bloodTypes = patients.map((p: any) => p.bloodType).filter(Boolean);
    const medicalHistories = patients.map((p: any) => p.medicalHistory).filter(Boolean);
    const allergiesList = patients.map((p: any) => p.allergies).filter(Boolean);

    // تجميع الإحصائيات في كائن واحد لإرساله للـ AI Agent
    const clinicStats = {
      totalPatients,
      bloodTypesCount: bloodTypes.reduce((acc: any, bt: string) => {
        acc[bt] = (acc[bt] || 0) + 1;
        return acc;
      }, {}),
      sampleMedicalHistories: medicalHistories.slice(0, 10), // عينة من التاريخ الطبي لتحليل الحالات
      sampleAllergies: Array.from(new Set(allergiesList)).slice(0, 5),
    };

    // 5. إرسال البيانات الحقيقية للـ AI Agent ليصنع تقريراً طبياً احترافياً
    const prompt = `
      You are an AI medical practice assistant and data analyst. Based on these REAL patient statistics retrieved directly from our clinic database for the active doctor, generate a professional, structured, and concise executive summary report. 
      The report should include:
      1. Executive Overview of the Clinic's Patient Base
      2. Health Demographics & Insights (Blood types distribution, common medical conditions based on medical histories)
      3. Key Recommendations for patient care and clinic management efficiency.

      Real Database Statistics:
      - Total Registered Patients: ${clinicStats.totalPatients}
      - Blood Types Distribution: ${JSON.stringify(clinicStats.bloodTypesCount)}
      - Sample Medical Histories: ${clinicStats.sampleMedicalHistories.join(' | ')}
      - Notable Allergies/Conditions: ${clinicStats.sampleAllergies.join(', ')}

      Write the report in a professional medical tone in English. If there are no patients registered yet, provide a friendly message advising the doctor that reports will generate once patient records are added.
    `;

    const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
      contents: prompt,
    });

    return {
      success: true,
      report: response.text,
    };

 } catch (error: any) {
    console.error("Error generating database smart report:", error);
    return {
      success: false,
      error: error.message || "Failed to generate report from database.",
    };
  }
}