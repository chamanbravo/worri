import { z } from "zod";

export const userRegistrationSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export const userLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const userUpdatePasswordSchema = z.object({
  password: z.string(),
  newPassword: z.string().min(8),
});

export const userUpdateSchema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
});
