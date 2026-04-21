import mongoose, { Document, Schema } from "mongoose";

export interface CommentDocument extends Document {
       content: string;
       taskId: mongoose.Types.ObjectId;
       userId: mongoose.Types.ObjectId;
       createdAt: Date;
       updatedAt: Date;
}

const commentSchema = new Schema<CommentDocument>(
       {
              content: {
                     type: String,
                     required: true,
                     trim: true,
              },
              taskId: {
                     type: Schema.Types.ObjectId,
                     ref: "Task",
                     required: true,
              },
              userId: {
                     type: Schema.Types.ObjectId,
                     ref: "User",
                     required: true,
              },
       },
       {
              timestamps: true,
       }
);

const CommentModel = mongoose.model<CommentDocument>("Comment", commentSchema);

export default CommentModel;
