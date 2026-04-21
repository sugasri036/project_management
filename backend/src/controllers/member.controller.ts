import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { z } from "zod";
import { HTTPSTATUS } from "../config/http.config";
import { joinWorkspaceByInviteService, inviteMemberService, getPendingInvitesService, acceptInviteService, leaveWorkspaceService } from "../services/member.service";

export const joinWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const inviteCode = z.string().parse(req.params.inviteCode);
    const userId = req.user?._id;

    const { workspaceId, role } = await joinWorkspaceByInviteService(
      userId,
      inviteCode
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Successfully joined the workspace",
      workspaceId,
      role,
    });
  }
);

export const inviteMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);
    const workspaceId = z.string().parse(req.params.workspaceId);
    const userId = req.user?._id;

    await inviteMemberService(workspaceId, email, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Invitation sent successfully",
    });
  }
);

export const getPendingInvitesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    // We assume req.user has email. If not populated, we might need to fetch user. 
    // Usually auth middleware populates user.
    // Let's check middleware later if needed.
    const email = req.user?.email || "";

    if (!email) {
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({ message: "User email not found" });
    }

    const invites = await getPendingInvitesService(email);

    return res.status(HTTPSTATUS.OK).json({
      message: "Fetched pending invites successfully",
      invites,
    });
  }
);

export const acceptInviteController = asyncHandler(
  async (req: Request, res: Response) => {
    const inviteId = z.string().parse(req.params.inviteId);
    const userId = req.user?._id;

    const result = await acceptInviteService(inviteId, userId);

    return res.status(HTTPSTATUS.OK).json(result);
  }
);

export const leaveWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = z.string().parse(req.params.workspaceId);
    const userId = req.user?._id;

    const result = await leaveWorkspaceService(userId, workspaceId);

    return res.status(HTTPSTATUS.OK).json(result);
  }
);
