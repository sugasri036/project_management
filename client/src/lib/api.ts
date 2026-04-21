import API from "./axios-client";
import {
  AllMembersInWorkspaceResponseType,
  AllProjectPayloadType,
  AllProjectResponseType,
  AllTaskPayloadType,
  AllTaskResponseType,
  AnalyticsResponseType,
  ChangeWorkspaceMemberRoleType,
  CreateProjectPayloadType,
  CreateTaskPayloadType,
  EditTaskPayloadType,
  CreateWorkspaceResponseType,
  EditProjectPayloadType,
  ProjectByIdPayloadType,
  ProjectResponseType,
} from "../types/api.type";
import {
  AllWorkspaceResponseType,
  CreateWorkspaceType,
  CurrentUserResponseType,
  LoginResponseType,
  loginType,
  registerType,
  WorkspaceByIdResponseType,
  EditWorkspaceType,
} from "@/types/api.type";

export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerMutationFn = async (data: registerType) =>
  await API.post("/auth/register", data);

export const logoutMutationFn = async () => await API.post("/auth/logout");

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get(`/user/current`);
    return response.data;
  };

//********* WORKSPACE ****************
//************* */

export const createWorkspaceMutationFn = async (
  data: CreateWorkspaceType
): Promise<CreateWorkspaceResponseType> => {
  const response = await API.post(`/workspace/create/new`, data);
  return response.data;
};

export const editWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: EditWorkspaceType) => {
  const response = await API.put(`/workspace/update/${workspaceId}`, data);
  return response.data;
};

export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspaceResponseType> => {
    const response = await API.get(`/workspace/all`);
    return response.data;
  };

export const getWorkspaceByIdQueryFn = async (
  workspaceId: string
): Promise<WorkspaceByIdResponseType> => {
  const response = await API.get(`/workspace/${workspaceId}`);
  return response.data;
};

export const getMembersInWorkspaceQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get(`/workspace/members/${workspaceId}`);
  return response.data;
};

export const getWorkspaceAnalyticsQueryFn = async (
  workspaceId: string
): Promise<AnalyticsResponseType> => {
  const response = await API.get(`/workspace/analytics/${workspaceId}`);
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data,
}: ChangeWorkspaceMemberRoleType) => {
  const response = await API.put(
    `/workspace/change/member/role/${workspaceId}`,
    data
  );
  return response.data;
};

export const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<{
  message: string;
  currentWorkspace: string;
}> => {
  const response = await API.delete(`/workspace/delete/${workspaceId}`);
  return response.data;
};

//*******MEMBER ****************

export const getWorkspaceByInviteCodeQueryFn = async (
  inviteCode: string
): Promise<{
  workspace: {
    name: string;
    description: string;
    owner: {
      name: string;
    }
    inviteCode: string;
  };
}> => {
  const response = await API.get(`/workspace/invite/${inviteCode}`);
  return response.data;
};

export const invitedUserJoinWorkspaceMutationFn = async (
  iniviteCode: string
): Promise<{
  message: string;
  workspaceId: string;
}> => {
  const response = await API.post(`/member/workspace/${iniviteCode}/join`);
  return response.data;
};

export const inviteMemberMutationFn = async ({
  workspaceId,
  email,
}: {
  workspaceId: string;
  email: string;
}): Promise<{
  message: string;
}> => {
  const response = await API.post(`/member/workspace/${workspaceId}/invite`, {
    email,
  });
  return response.data;
};

export const getPendingInvitesQueryFn = async () => {
  const response = await API.get("/member/invites");
  return response.data;
};

export const acceptInviteMutationFn = async (inviteId: string) => {
  const response = await API.post(`/member/invites/${inviteId}/accept`);
  return response.data;
};

//********* */
//********* PROJECTS
export const createProjectMutationFn = async ({
  workspaceId,
  data,
}: CreateProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.post(
    `/project/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const editProjectMutationFn = async ({
  projectId,
  workspaceId,
  data,
}: EditProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.put(
    `/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

export const getProjectsInWorkspaceQueryFn = async ({
  workspaceId,
  pageSize = 10,
  pageNumber = 1,
}: AllProjectPayloadType): Promise<AllProjectResponseType> => {
  const response = await API.get(
    `/project/workspace/${workspaceId}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

export const getProjectByIdQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}`
  );
  return response.data;
};

export const getProjectAnalyticsQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<AnalyticsResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}/analytics`
  );
  return response.data;
};

export const deleteProjectMutationFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<{
  message: string;
}> => {
  const response = await API.delete(
    `/project/${projectId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

//*******TASKS ********************************
//************************* */

export const createTaskMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: CreateTaskPayloadType) => {
  const response = await API.post(
    `/task/project/${projectId}/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};


export const editTaskMutationFn = async ({
  taskId,
  projectId,
  workspaceId,
  data,
}: EditTaskPayloadType): Promise<{ message: string; }> => {
  const response = await API.put(
    `/task/${taskId}/project/${projectId}/workspace/${workspaceId}/update/`,
    data
  );
  return response.data;
};

export const getAllTasksQueryFn = async ({
  workspaceId,
  keyword,
  projectId,
  assignedTo,
  priority,
  status,
  dueDate,
  pageNumber,
  pageSize,
}: AllTaskPayloadType): Promise<AllTaskResponseType> => {
  const baseUrl = `/task/workspace/${workspaceId}/all`;

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  if (projectId) queryParams.append("projectId", projectId);
  if (assignedTo) queryParams.append("assignedTo", assignedTo);
  if (priority) queryParams.append("priority", priority);
  if (status) queryParams.append("status", status);
  if (dueDate) queryParams.append("dueDate", dueDate);
  if (pageNumber) queryParams.append("pageNumber", pageNumber?.toString());
  if (pageSize) queryParams.append("pageSize", pageSize?.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;
  const response = await API.get(url);
  return response.data;
};

export const deleteTaskMutationFn = async ({
  workspaceId,
  taskId,
}: {
  workspaceId: string;
  taskId: string;
}): Promise<{
  message: string;
}> => {
  const response = await API.delete(
    `task/${taskId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

export const leaveWorkspaceMutationFn = async (workspaceId: string) => {
  const response = await API.delete(`/member/leave/${workspaceId}`);
  return response.data;
};

// ********** COMMENTS **********
export const createCommentMutationFn = async ({
  taskId,
  content,
}: {
  taskId: string;
  content: string;
}) => {
  const response = await API.post(`/comment/task/${taskId}`, { content });
  return response.data;
};

export const getTaskCommentsQueryFn = async (taskId: string) => {
  const response = await API.get(`/comment/task/${taskId}`);
  return response.data;
};

export const deleteCommentMutationFn = async (commentId: string) => {
  const response = await API.delete(`/comment/${commentId}`);
  return response.data;
};

// ********** ACTIVITY **********
export const getWorkspaceActivitiesQueryFn = async (workspaceId: string) => {
  const response = await API.get(`/activity/workspace/${workspaceId}`);
  return response.data;
};

// ********** SEARCH **********
export const searchWorkspaceQueryFn = async ({
  workspaceId,
  keyword
}: {
  workspaceId: string;
  keyword: string;
}) => {
  const response = await API.get(`/search/workspace/${workspaceId}?keyword=${keyword}`);
  return response.data;
}

// ********** DISCUSSION **********
export const createDiscussionMutationFn = async ({
  workspaceId,
  content,
}: {
  workspaceId: string;
  content: string;
}) => {
  const response = await API.post(`/discussion/workspace/${workspaceId}/create`, { content });
  return response.data;
};

export const getWorkspaceDiscussionsQueryFn = async (workspaceId: string) => {
  const response = await API.get(`/discussion/workspace/${workspaceId}/all`);
  return response.data;
};

// ********** PUBLIC ACCESS **********
export const getPublicWorkspaceQueryFn = async (code: string) => {
  const response = await API.get(`/public/workspace/${code}`);
  return response.data;
};

export const getPublicProjectsQueryFn = async ({
  code,
  pageNumber = 1,
  pageSize = 10,
}: {
  code: string;
  pageNumber?: number;
  pageSize?: number;
}) => {
  const response = await API.get(
    `/public/workspace/${code}/projects?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return response.data;
};

export const getPublicProjectQueryFn = async ({
  code,
  projectId,
}: {
  code: string;
  projectId: string;
}) => {
  const response = await API.get(
    `/public/workspace/${code}/project/${projectId}`
  );
  return response.data;
};

export const getPublicProjectTasksQueryFn = async ({
  code,
  projectId,
  pageNumber = 1,
  pageSize = 10,
  status,
  priority,
  keyword,
}: {
  code: string;
  projectId: string;
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  priority?: string;
  keyword?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  if (priority) queryParams.append("priority", priority);
  if (status) queryParams.append("status", status);
  if (pageNumber) queryParams.append("pageNumber", pageNumber.toString());
  if (pageSize) queryParams.append("pageSize", pageSize.toString());

  const response = await API.get(
    `/public/workspace/${code}/project/${projectId}/tasks?${queryParams.toString()}`
  );
  return response.data;
};
