import * as z from "zod";

export const postSchema = z.object({
  title: z.string(),
  content: z.string(),
  images: z
    .any()
    .refine((files: any) => files instanceof FileList && files.length > 0),
});
