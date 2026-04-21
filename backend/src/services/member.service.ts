import { ErrorCodeEnum } from "../enums/error-code.enum";
import { Roles, Permissions } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import WorkspaceModel from "../models/workspace.model";
import WorkspaceInviteModel from "../models/workspace-invite.model";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";
import { sendEmail } from "./mail.service";
import { config } from "../config/app.config";

export const inviteMemberService = async (
  workspaceId: string,
  email: string,
  userId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  // Check if inviter is a member (and has permission - simplified to just member check for now)
  const inviter = await MemberModel.findOne({
    userId,
    workspaceId,
  });

  if (!inviter) {
    throw new UnauthorizedException("You are not a member of this workspace");
  }

  // Check if user is already a member (optional, but good UX)
  // For now, we assume they might not be in the system or we just send the email.

  const inviteLink = `${config.FRONTEND_ORIGIN}/invite/workspace/${workspace.inviteCode}/join`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>You've been invited to join ${workspace.name}</h2>
      <p>Click the link below to join the workspace:</p>
      <a href="${inviteLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Join Workspace</a>
      <p>Or copy this link: ${inviteLink}</p>
    </div>
  `;

  const newInvite = new WorkspaceInviteModel({
    email,
    workspaceId,
    inviterId: userId,
  });
  await newInvite.save();

  await sendEmail(email, `Invitation to join ${workspace.name}`, html);

  return { message: "Invitation sent successfully" };
};

export const getMemberRoleInWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate("role");

  if (!member) {
    throw new UnauthorizedException(
      "You are not a member of this workspace",
      ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }

  const roleName = member.role?.name;

  return { role: roleName };
};

export const joinWorkspaceByInviteService = async (
  userId: string,
  inviteCode: string
) => {
  // Find workspace by invite code (check both codes)
  const workspace = await WorkspaceModel.findOne({
    $or: [{ inviteCode }, { inviteCodeClient: inviteCode }],
  }).exec();

  if (!workspace) {
    throw new NotFoundException("Invalid invite code or workspace not found");
  }

  // Determine role based on which code matched
  const isClientCode = workspace.inviteCodeClient === inviteCode;
  const roleName = isClientCode ? Roles.CLIENT : Roles.MEMBER;

  // Check if user is already a member
  const existingMember = await MemberModel.findOne({
    userId,
    workspaceId: workspace._id,
  }).exec();

  if (existingMember) {
    throw new BadRequestException("You are already a member of this workspace");
  }

  let role = await RoleModel.findOne({ name: roleName });

  if (!role) {
    // If Client role is missing, ensure we have it or fallback/error?
    // We should probably ensure roles exist.
    role = await RoleModel.findOne({ name: Roles.MEMBER }); // Fallback (should ideally throw or seed)
    if (!role) {
      // Auto-create MEMBER as last resort
      role = await RoleModel.create({
        name: Roles.MEMBER,
        permissions: [
          Permissions.CREATE_TASK,
          Permissions.EDIT_TASK,
          Permissions.VIEW_ONLY,
        ],
      });
    }
    // Ideally we'd seed Client role too if missing, but let's assume it exists from previous steps
    if (roleName === Roles.CLIENT) {
      const clientRole = await RoleModel.findOne({ name: Roles.CLIENT });
      if (clientRole) role = clientRole;
    }
  }

  // Add user to workspace
  const newMember = new MemberModel({
    userId,
    workspaceId: workspace._id,
    role: role._id,
  });
  await newMember.save();

  return { workspaceId: workspace._id, role: role.name };
};

export const getPendingInvitesService = async (email: string) => {
  const invites = await WorkspaceInviteModel.find({
    email,
    status: "PENDING",
  }).populate("workspaceId", "name description").populate("inviterId", "name email");
  return invites;
};

export const acceptInviteService = async (inviteId: string, userId: string) => {
  const invite = await WorkspaceInviteModel.findById(inviteId);
  if (!invite) {
    throw new NotFoundException("Invite not found");
  }

  if (invite.status !== "PENDING") {
    throw new BadRequestException("Invite is not pending");
  }

  // Check if workspace exists
  const workspace = await WorkspaceModel.findById(invite.workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  // Check if user is already a member
  const existingMember = await MemberModel.findOne({
    userId,
    workspaceId: invite.workspaceId,
  });

  if (existingMember) {
    throw new BadRequestException("You are already a member of this workspace");
  }

  let role = await RoleModel.findOne({ name: Roles.MEMBER });
  if (!role) {
    // Auto-create the role if it doesn't exist (Lazy Seeding)
    role = await RoleModel.create({
      name: Roles.MEMBER,
      permissions: [
        Permissions.CREATE_TASK,
        Permissions.EDIT_TASK,
        Permissions.VIEW_ONLY,
      ],
    });
  }

  // Add member
  const newMember = new MemberModel({
    userId,
    workspaceId: invite.workspaceId,
    role: role._id,
  });
  await newMember.save();

  // Update invite status
  invite.status = "ACCEPTED";
  await invite.save();

  return { workspaceId: invite.workspaceId, message: "Joined workspace successfully" };
};

export const leaveWorkspaceService = async (userId: string, workspaceId: string) => {
  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace) {
    throw new NotFoundException("Workspace not found");
  }

  // Check if member exists
  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate("role");

  if (!member) {
    throw new NotFoundException("You are not a member of this workspace");
  }

  // Prevent owner from leaving (they must delete workspace or transfer ownership)
  if (member.role?.name === Roles.OWNER) {
    throw new BadRequestException("Owners cannot leave the workspace. You must delete it or transfer ownership.");
  }

  await member.deleteOne();

  return { message: "You have left the workspace successfully" };
};
