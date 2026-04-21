import mongoose, { Document, Schema } from "mongoose";

export interface ProjectDocument extends Document {
  name: string;
  description: string | null; // Optional description for the project
  emoji: string;
  workspace: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  budget: number;
  currency: string;
  taskStatuses: { label: string; value: string; color: string; order: number }[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    emoji: {
      type: String,
      required: false,
      trim: true,
      default: "📊",
    },
    description: { type: String, required: false },
    status: {
      type: String,
      enum: ["PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD"],
      default: "IN_PROGRESS",
    },
    budget: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    taskStatuses: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
        color: { type: String, default: "#6366f1" },
        order: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProjectModel = mongoose.model<ProjectDocument>("Project", projectSchema);
export default ProjectModel;
