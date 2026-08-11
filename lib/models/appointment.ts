import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  title: string;
  patientId: mongoose.Types.ObjectId;
  patientName: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: "consultation" | "suivi" | "urgence";
  status: "planifié" | "confirmé" | "annulé" | "terminé";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    title: { type: String, required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient" },
    patientName: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    type: {
      type: String,
      enum: ["consultation", "suivi", "urgence"],
      default: "consultation",
    },
    status: {
      type: String,
      enum: ["planifié", "confirmé", "annulé", "terminé"],
      default: "planifié",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);