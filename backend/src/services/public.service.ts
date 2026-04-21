import WorkspaceModel from "../models/workspace.model";
import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";
import { NotFoundException } from "../utils/appError";
import mongoose from "mongoose";

export const getWorkspaceByPropietaryCodeService = async (code: string) => {
       const workspace = await WorkspaceModel.findOne({
              inviteCodeClient: code,
       }).select("name description owner inviteCodeClient");

       if (!workspace) {
              throw new NotFoundException("Invalid access code");
       }

       return { workspace };
};

export const getWorkspaceProjectsByCodeService = async (
       code: string,
       pagination: { pageNumber?: number; pageSize?: number }
) => {
       const workspace = await WorkspaceModel.findOne({
              inviteCodeClient: code,
       });

       if (!workspace) {
              throw new NotFoundException("Invalid access code");
       }

       const { pageNumber = 1, pageSize = 10 } = pagination;
       const skip = (pageNumber - 1) * pageSize;

       const projects = await ProjectModel.find({
              workspace: workspace._id,
       })
              .select("name emoji description taskStatuses createdAt updatedAt")
              .skip(skip)
              .limit(pageSize)
              .sort({ createdAt: -1 });

       const totalCount = await ProjectModel.countDocuments({
              workspace: workspace._id,
       });

       const totalPages = Math.ceil(totalCount / pageSize);

       return {
              projects,
              pagination: {
                     totalCount,
                     pageSize,
                     pageNumber,
                     totalPages,
                     skip,
                     limit: pageSize,
              },
       };
};

export const getProjectByCodeAndIdService = async (
       code: string,
       projectId: string
) => {
       const workspace = await WorkspaceModel.findOne({
              inviteCodeClient: code,
       });

       if (!workspace) {
              throw new NotFoundException("Invalid access code");
       }

       const project = await ProjectModel.findOne({
              _id: projectId,
              workspace: workspace._id,
       }).select("name emoji description taskStatuses createdAt updatedAt");

       if (!project) {
              throw new NotFoundException("Project not found or access denied");
       }

       return { project };
};

export const getTasksByCodeAndProjectIdService = async (
       code: string,
       projectId: string,
       filters: any
) => {
       const workspace = await WorkspaceModel.findOne({
              inviteCodeClient: code,
       });

       if (!workspace) {
              throw new NotFoundException("Invalid access code");
       }

       const project = await ProjectModel.findOne({
              _id: projectId,
              workspace: workspace._id,
       });

       if (!project) {
              throw new NotFoundException("Project not found or access denied");
       }

       const { pageNumber = 1, pageSize = 10, ...queryFilters } = filters;
       const skip = (pageNumber - 1) * pageSize;

       const tasks = await TaskModel.find({
              workspace: workspace._id,
              project: projectId,
              ...queryFilters,
       })
              .populate("assignedTo", "name profilePicture")
              .skip(skip)
              .limit(pageSize)
              .sort({ createdAt: -1 });

       const totalCount = await TaskModel.countDocuments({
              workspace: workspace._id,
              project: projectId,
              ...queryFilters,
       });

       return {
              tasks,
              pagination: {
                     totalCount,
                     pageSize,
                     pageNumber,
                     totalPages: Math.ceil(totalCount / pageSize),
                     skip,
                     limit: pageSize,
              },
       };
};
