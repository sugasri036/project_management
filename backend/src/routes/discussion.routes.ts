import { Router } from "express";
import {
       createDiscussionController,
       getWorkspaceDiscussionsController,
} from "../controllers/discussion.controller";

const discussionRoutes = Router();

discussionRoutes.post("/workspace/:workspaceId/create", createDiscussionController);
discussionRoutes.get("/workspace/:workspaceId/all", getWorkspaceDiscussionsController);

export default discussionRoutes;
