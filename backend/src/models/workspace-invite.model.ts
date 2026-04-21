import mongoose, { Document, Schema } from "mongoose";

export interface WorkspaceInviteDocument extends Document {
       email: string;
       workspaceId: mongoose.Types.ObjectId;
       inviterId: mongoose.Types.ObjectId;
       status: "PENDING" | "ACCEPTED" | "REJECTED";
       createdAt: Date;
       updatedAt: Date;
}

const workspaceInviteSchema = new Schema<WorkspaceInviteDocument>(
       {
              email: { type: String, required: true },
              workspaceId: {
                     type: Schema.Types.ObjectId,
                     ref: "Workspace",
                     required: true,
              },
              inviterId: {
                     type: Schema.Types.ObjectId,
                     ref: "User",
                     required: true,
              },
              status: {
                     type: String,
                     enum: ["PENDING", "ACCEPTED", "REJECTED"],
                     default: "PENDING",
              },
       },
       {
              timestamps: true,
       }
);

const WorkspaceInviteModel = mongoose.model<WorkspaceInviteDocument>(
       "WorkspaceInvite",
       workspaceInviteSchema
);
export default WorkspaceInviteModel;
