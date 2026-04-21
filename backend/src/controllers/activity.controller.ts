import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { z } from "zod";
import { HTTPSTATUS } from "../config/http.config";
import { getWorkspaceActivitiesService } from "../services/activity.service";

export const getWorkspaceActivitiesController = asyncHandler(
       async (req: Request, res: Response) => {
              const workspaceId = z.string().parse(req.params.workspaceId);

              // Optional: pagination or limit from query
              const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

              const activities = await getWorkspaceActivitiesService(workspaceId, limit);

              return res.status(HTTPSTATUS.OK).json({
                     message: "Activities fetched successfully",
                     activities,
              });
       }
);
