import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import DiscussionModel from "../models/discussion.model";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.enum";

export const createDiscussionController = asyncHandler(
       async (req: Request, res: Response) => {
              const { workspaceId } = req.params;
              const { content } = req.body;
              const userId = req.user?._id;

              // Verify member has access
              await getMemberRoleInWorkspace(userId, workspaceId);

              const discussion = new DiscussionModel({
                     workspace: workspaceId,
                     author: userId,
                     content,
              });

              await discussion.save();

              return res.status(HTTPSTATUS.CREATED).json({
                     message: "Message posted",
                     discussion,
              });
       }
);

export const getWorkspaceDiscussionsController = asyncHandler(
       async (req: Request, res: Response) => {
              const { workspaceId } = req.params;
              const userId = req.user?._id;

              await getMemberRoleInWorkspace(userId, workspaceId);

              const discussions = await DiscussionModel.find({ workspace: workspaceId })
                     .populate("author", "name profilePicture")
                     .sort({ createdAt: -1 }); // Newest first

              return res.status(HTTPSTATUS.OK).json({
                     message: "Discussions retrieved",
                     discussions,
              });
       }
);
