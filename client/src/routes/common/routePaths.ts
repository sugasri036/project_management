export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};

export const AUTH_ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
  GOOGLE_OAUTH_CALLBACK: "/google/oauth/callback",
  GOOGLE_SUCCESS: "/auth/success",
};

export const PROTECTED_ROUTES = {
  WORKSPACE: "/workspace/:workspaceId",
  TASKS: "/workspace/:workspaceId/tasks",
  MEMBERS: "/workspace/:workspaceId/members",
  SETTINGS: "/workspace/:workspaceId/settings",
  PROJECT_DETAILS: "/workspace/:workspaceId/project/:projectId",
  PROJECT_SETTINGS: "/workspace/:workspaceId/project/:projectId/settings",
  CALENDAR: "/workspace/:workspaceId/calendar",
  REPORTS: "/workspace/:workspaceId/reports",
  DISCUSS: "/workspace/:workspaceId/discuss",
};

export const BASE_ROUTE = {
  INVITE_URL: "/invite/workspace/:inviteCode/join",
  SHARED_LINK: "/shared/:code",
};
