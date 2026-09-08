'use server';

import { GoogleGenAI } from "@google/genai";
import connectDB from "@/lib/db";
import Patient from "@/lib/models/medical-tracker";
import { getSession } from "@/lib/auth-server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function generateDatabaseSmartReport() {
  try {
    // 1. Verify user authentication
    const session = await getSession();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Connect to the database
    await connectDB();

    // 3. Fetch all patients associated with the active user
    const patients = await Patient.find({ userId: session.user.id });

    // 4. Extract patient statistics
    const totalPatients = patients.length;

    const bloodTypes = patients.map((p: any) => p.bloodType).filter(Boolean);
    const medicalHistories = patients.map((p: any) => p.medicalHistory).filter(Boolean);
    const allergiesList = patients.map((p: any) => p.allergies).filter(Boolean);

    const clinicStats = {
      totalPatients,
      bloodTypesCount: bloodTypes.reduce((acc: any, bt: string) => {
        acc[bt] = (acc[bt] || 0) + 1;
        return acc;
      }, {}),
      sampleMedicalHistories: medicalHistories.slice(0, 10),
      sampleAllergies: Array.from(new Set(allergiesList)).slice(0, 5),
    };

    // Format current date explicitly for the AI (e.g., September 8, 2026)
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    // 5. Generate medical report using AI with specified date mandate
    const prompt = `
      You are an AI medical practice assistant and data analyst. Based on these REAL patient statistics retrieved directly from our clinic database for the active doctor, generate a professional, structured, and concise executive summary report. 

      CRITICAL MANDATE:
      - Set the report date explicitly to: ${currentDate}
      - Format the header as: **Date:** ${currentDate}

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