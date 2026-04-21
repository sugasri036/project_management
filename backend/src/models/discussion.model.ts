import mongoose, { Document, Schema } from "mongoose";

export interface DiscussionDocument extends Document {
       workspace: mongoose.Types.ObjectId;
       author: mongoose.Types.ObjectId;
       content: string;
       createdAt: Date;
       updatedAt: Date;
}

const discussionSchema = new Schema<DiscussionDocument>(
       {
              workspace: {
                     type: Schema.Types.ObjectId,
                     ref: "Workspace",
                     required: true,
              },
              author: {
                     type: Schema.Types.ObjectId,
                     ref: "User",
                     required: true,
              },
              content: {
                     type: String,
                     required: true,
              },
       },
       {
              timestamps: true,
       }
);

const DiscussionModel = mongoose.model<DiscussionDocument>(
       "Discussion",
       discussionSchema
);

export default DiscussionModel;
