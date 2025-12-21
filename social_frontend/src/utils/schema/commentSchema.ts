import * as z from "zod";

export const commentSchema = z.object({
  content: z.string().min(1, "Content is required"),
});
