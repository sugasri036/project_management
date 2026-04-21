import ProjectModel from "../models/project.model";
import TaskModel from "../models/task.model";
import MemberModel from "../models/member.model";

export const searchService = async (
       workspaceId: string,
       userId: string,
       keyword: string
) => {
       if (!keyword || keyword.trim() === "") {
              return { projects: [], tasks: [], members: [] };
       }

       const regex = new RegExp(keyword, "i");

       // Search Projects
       const projects = await ProjectModel.find({
              workspace: workspaceId,
              name: { $regex: regex },
       })
              .select("_id emoji name description")
              .limit(5);

       // Search Tasks
       const tasks = await TaskModel.find({
              workspace: workspaceId,
              $or: [{ title: { $regex: regex } }, { taskCode: { $regex: regex } }],
       })
              .select("_id taskCode title status priority project")
              .populate("project", "emoji name")
              .limit(5);

       // Search Members (optional, but good to have)
       const members = await MemberModel.find({
              workspaceId: workspaceId,
       })
              .populate({
                     path: "userId",
                     match: { name: { $regex: regex } }, // Match user name
                     select: "name email profilePicture"
              })
              .limit(5);

       // Filter out members where userId is null (no match)
       const filteredMembers = members
              .filter(m => m.userId)
              .map(m => m.userId);

       return { projects, tasks, members: filteredMembers };
};
