import mongoose, { Schema, Document } from "mongoose";

export interface IColumn extends Document {
  name: string;
  userId: string;
  boardId: mongoose.Types.ObjectId;
  order: number;
  patients: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ColumnSchema = new Schema<IColumn>(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    order: { type: Number, required: true, default: 0 },
    patients: [{ type: Schema.Types.ObjectId, ref: "Patient" }],
  },
  { timestamps: true }
);

export default mongoose.models.Column ||
  mongoose.model<IColumn>("Column", ColumnSchema);