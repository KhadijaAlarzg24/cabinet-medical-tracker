import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female";
  address?: string;
  bloodType?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  allergies?: string[];
  medicalHistory?: string;
  columnId: mongoose.Types.ObjectId;
  userId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female"] },
    address: { type: String },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    allergies: { type: [String] },
    medicalHistory: { type: String },
    columnId: { type: Schema.Types.ObjectId, ref: "Column", required: true },
    userId: { type: String, required: true, index: true },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Patient ||
  mongoose.model<IPatient>("Patient", PatientSchema);