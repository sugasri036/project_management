import { Router } from "express";
import { getWorkspaceActivitiesController } from "../controllers/activity.controller";

const activityRoutes = Router();

activityRoutes.get("/workspace/:workspaceId", getWorkspaceActivitiesController);

export default activityRoutes;
