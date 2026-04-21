export const ProjectStatusEnum = {
       PLANNING: "PLANNING",
       IN_PROGRESS: "IN_PROGRESS",
       COMPLETED: "COMPLETED",
       ON_HOLD: "ON_HOLD",
} as const;

export type ProjectStatusEnumType = keyof typeof ProjectStatusEnum;
