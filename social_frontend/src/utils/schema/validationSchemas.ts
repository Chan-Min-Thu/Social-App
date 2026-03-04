import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z
    .string()
    .min(8, "Confirm Password must be at least 8 characters long"),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits long.")
    .max(6, "OTP must be 6 digits long."),
});

export const emailSchema = z.object({
  email: z.email("Invalid email address"),
});

export const updatePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    newPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters long"),
    newConfirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.newConfirmPassword, {
    message: "New passwords and new confirm passwords do not match",
    path: ["newConfirmPassword"],
  });

export const userProfileSchema = z.object({
  username: z.string().min(1, "Username must be at least 1 letter long."),
  profileImage: z
    .any()
    .refine((files) => files?.length > 0, "Avatar photo is required.")
    .transform((files) => files[0]) // Convert FileList to a single File
    .refine((file) => file instanceof File, "Input must be a file.")
    .refine((file) => file.size <= 5000000, "Max file size is 5MB")
    .refine((file) => file.size <= MAX_FILE_SIZE, "File is less than 5 Mb.")
   
});
