import { z } from "zod";

export const emojiSchema = z.string().trim().optional();
export const nameSchema = z.string().trim().min(1).max(255);
export const descriptionSchema = z.string().trim().optional();
export const statusSchema = z.enum(["PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD"]).optional();

export const projectIdSchema = z.string().trim().min(1);

export const taskStatusesSchema = z.array(
  z.object({
    label: z.string().trim().min(1),
    value: z.string().trim().min(1),
    color: z.string().trim().optional(),
    order: z.number().optional(),
  })
).optional();

export const createProjectSchema = z.object({
  emoji: emojiSchema,
  name: nameSchema,
  description: descriptionSchema,
  status: statusSchema,
});

export const updateProjectSchema = z.object({
  emoji: emojiSchema,
  name: nameSchema,
  description: descriptionSchema,
  status: statusSchema,
  taskStatuses: taskStatusesSchema,
});
