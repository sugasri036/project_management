import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { z } from "zod";
import { HTTPSTATUS } from "../config/http.config";
import {
       createCommentService,
       getTaskCommentsService,
       deleteCommentService,
} from "../services/comment.service";

export const createCommentController = asyncHandler(
       async (req: Request, res: Response) => {
              const taskId = z.string().parse(req.params.taskId);
              const body = z.object({ content: z.string().min(1) }).parse(req.body);
              const userId = req.user?._id;

              const comment = await createCommentService(userId, taskId, body.content);

              return res.status(HTTPSTATUS.CREATED).json({
                     message: "Comment added successfully",
                     comment,
              });
       }
);

export const getTaskCommentsController = asyncHandler(
       async (req: Request, res: Response) => {
              const taskId = z.string().parse(req.params.taskId);
              const comments = await getTaskCommentsService(taskId);

              return res.status(HTTPSTATUS.OK).json({
                     message: "Comments fetched successfully",
                     comments,
              });
       }
);

export const deleteCommentController = asyncHandler(
       async (req: Request, res: Response) => {
              const commentId = z.string().parse(req.params.commentId);
              const userId = req.user?._id;

              const result = await deleteCommentService(userId, commentId);

              return res.status(HTTPSTATUS.OK).json(result);
       }
);
