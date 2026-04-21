import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
       getWorkspaceByPropietaryCodeService,
       getWorkspaceProjectsByCodeService,
       getProjectByCodeAndIdService,
       getTasksByCodeAndProjectIdService,
} from "../services/public.service";

export const getPublicWorkspaceController = asyncHandler(
       async (req: Request, res: Response) => {
              const { code } = req.params;
              const { workspace } = await getWorkspaceByPropietaryCodeService(code);

              return res.status(HTTPSTATUS.OK).json({
                     message: "Workspace fetched successfully",
                     workspace,
              });
       }
);

export const getPublicProjectsController = asyncHandler(
       async (req: Request, res: Response) => {
              const { code } = req.params;
              const pageNumber = Number(req.query.pageNumber) || 1;
              const pageSize = Number(req.query.pageSize) || 10;

              const { projects, pagination } = await getWorkspaceProjectsByCodeService(
                     code,
                     {
                            pageNumber,
                            pageSize,
                     }
              );

              return res.status(HTTPSTATUS.OK).json({
                     message: "Projects fetched successfully",
                     projects,
                     pagination,
              });
       }
);

export const getPublicProjectController = asyncHandler(
       async (req: Request, res: Response) => {
              const { code, projectId } = req.params;
              const { project } = await getProjectByCodeAndIdService(code, projectId);

              return res.status(HTTPSTATUS.OK).json({
                     message: "Project fetched successfully",
                     project,
              });
       }
);

export const getPublicProjectTasksController = asyncHandler(
       async (req: Request, res: Response) => {
              const { code, projectId } = req.params;

              // Extract filters from query
              const filters = {
                     pageNumber: Number(req.query.pageNumber) || 1,
                     pageSize: Number(req.query.pageSize) || 10,
                     status: req.query.status as string,
                     priority: req.query.priority as string,
                     keyword: req.query.keyword as string,
              }

              const { tasks, pagination } = await getTasksByCodeAndProjectIdService(
                     code,
                     projectId,
                     filters
              );

              return res.status(HTTPSTATUS.OK).json({
                     message: "Tasks fetched successfully",
                     tasks,
                     pagination,
              });
       }
);
