import { Router } from "express";
import { searchController } from "../controllers/search.controller";

const searchRoutes = Router();

searchRoutes.get("/workspace/:workspaceId", searchController);

export default searchRoutes;
