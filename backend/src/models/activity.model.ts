import mongoose, { Document, Schema } from "mongoose";

export interface ActivityInterface extends Document {
       workspaceId: mongoose.Types.ObjectId;
       userId: mongoose.Types.ObjectId;
       action: string; // e.g., "created", "updated", "deleted"
       entityType: string; // e.g., "Task", "Project", "Workspace"
       entityId?: mongoose.Types.ObjectId;
       details?: string; // Optional description
       createdAt: Date;
}

const activitySchema = new Schema<ActivityInterface>(
       {
              workspaceId: {
                     type: Schema.Types.ObjectId,
                     ref: "Workspace",
                     required: true,
              },
              userId: {
                     type: Schema.Types.ObjectId,
                     ref: "User",
                     required: true,
              },
              action: {
                     type: String,
                     required: true,
              },
              entityType: {
                     type: String,
                     required: true,
              },
              entityId: {
                     type: Schema.Types.ObjectId,
              },
              details: {
                     type: String,
              },
       },
       {
              timestamps: { createdAt: true, updatedAt: false }, // Only createdAt needed
       }
);

const ActivityModel = mongoose.model<ActivityInterface>("Activity", activitySchema);

export default ActivityModel;
