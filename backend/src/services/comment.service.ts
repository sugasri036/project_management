import CommentModel from "../models/comment.model";
import TaskModel from "../models/task.model";
import { NotFoundException } from "../utils/appError";

export const createCommentService = async (
       userId: string,
       taskId: string,
       content: string
) => {
       const task = await TaskModel.findById(taskId);
       if (!task) {
              throw new NotFoundException("Task not found");
       }

       const comment = new CommentModel({
              content,
              taskId,
              userId,
       });

       await comment.save();
       return comment;
};

export const getTaskCommentsService = async (taskId: string) => {
       const comments = await CommentModel.find({ taskId })
              .populate("userId", "name profilePicture email")
              .sort({ createdAt: -1 });
       return comments;
};

export const deleteCommentService = async (userId: string, commentId: string) => {
       const comment = await CommentModel.findOneAndDelete({
              _id: commentId,
              userId: userId // Ensure only the creator can delete
       });

       if (!comment) {
              throw new NotFoundException("Comment not found or you are not authorized to delete it");
       }
       return { message: "Comment deleted successfully" };
}
