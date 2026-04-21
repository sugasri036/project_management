import { Router } from "express";
import {
       createCommentController,
       getTaskCommentsController,
       deleteCommentController,
} from "../controllers/comment.controller";

const commentRoutes = Router();

commentRoutes.post("/task/:taskId", createCommentController);
commentRoutes.get("/task/:taskId", getTaskCommentsController);
commentRoutes.delete("/:commentId", deleteCommentController);

export default commentRoutes;
