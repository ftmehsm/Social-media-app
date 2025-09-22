import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");
export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-z0-9_-]{3,15}$/,
    "Only lowercase letters, numbers, underscores and dashes are allowed",
  ),
  password: requiredString.min(8, "must at least 8 chracters"),
});

export type signUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type loginValues = z.infer<typeof loginSchema>;
