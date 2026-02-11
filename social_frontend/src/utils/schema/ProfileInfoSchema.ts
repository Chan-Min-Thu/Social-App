import * as z from "zod";

const Gender = ["Female", "Male", "None"] as const;

export const profileInfoSchema = z.object({
  bio: z.string().min(1, "Bio is required"),
  location: z.string().min(1, "Location is required"),
  website: z.string().min(1),
  birthDate: z.coerce
    .date({ message: "Date should be correct date. " })
    .refine((date) => date < new Date(), { message: "Date cannot be before" }),
  gender: z.enum(Gender, {
    error: () => ({ message: "Please select gender!" }),
  }),
  userId: z.string().optional(),
});
