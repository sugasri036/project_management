import ActivityModel from "../models/activity.model";

export const logActivityService = async (
       userId: string,
       workspaceId: string,
       action: string,
       entityType: string,
       entityId?: string,
       details?: string
) => {
       try {
              const activity = new ActivityModel({
                     userId,
                     workspaceId,
                     action,
                     entityType,
                     entityId,
                     details,
              });
              await activity.save();
       } catch (error) {
              console.error("Failed to log activity:", error);
              // Silent failure to avoid blocking main operations
       }
};

export const getWorkspaceActivitiesService = async (workspaceId: string, limit: number = 20) => {
       const activities = await ActivityModel.find({ workspaceId })
              .populate("userId", "name profilePicture")
              .sort({ createdAt: -1 })
              .limit(limit);
       return activities;
};
