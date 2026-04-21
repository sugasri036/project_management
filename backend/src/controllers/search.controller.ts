import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { z } from "zod";
import { HTTPSTATUS } from "../config/http.config";
import { searchService } from "../services/search.service";

export const searchController = asyncHandler(
       async (req: Request, res: Response) => {
              const workspaceId = z.string().parse(req.params.workspaceId);
              const keyword = req.query.keyword as string;
              const userId = req.user?._id;

              const results = await searchService(workspaceId, userId, keyword);

              return res.status(HTTPSTATUS.OK).json({
                     message: "Search results fetched successfully",
                     results,
              });
       }
);
