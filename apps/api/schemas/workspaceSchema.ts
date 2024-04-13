import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3).max(30),
});

export const updateWorkspaceSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  access_code: z.string().optional(),
});

export const deleteWorkspaceSchema = z.object({
  id: z.number(),
});
