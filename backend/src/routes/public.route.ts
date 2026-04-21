import { Router } from "express";
import {
       getPublicProjectsController,
       getPublicWorkspaceController,
       getPublicProjectController,
       getPublicProjectTasksController,
} from "../controllers/public.controller";

const publicRoutes = Router();

publicRoutes.get("/workspace/:code", getPublicWorkspaceController);
publicRoutes.get("/workspace/:code/projects", getPublicProjectsController);
publicRoutes.get("/workspace/:code/project/:projectId", getPublicProjectController);
publicRoutes.get("/workspace/:code/project/:projectId/tasks", getPublicProjectTasksController);

export default publicRoutes;
