import { Router } from "express";
import { joinWorkspaceController, inviteMemberController, getPendingInvitesController, acceptInviteController, leaveWorkspaceController } from "../controllers/member.controller";

const memberRoutes = Router();

memberRoutes.post("/workspace/:inviteCode/join", joinWorkspaceController);
memberRoutes.post("/workspace/:workspaceId/invite", inviteMemberController);
memberRoutes.get("/invites", getPendingInvitesController);
memberRoutes.post("/invites/:inviteId/accept", acceptInviteController);
memberRoutes.delete("/leave/:workspaceId", leaveWorkspaceController);



export default memberRoutes;
