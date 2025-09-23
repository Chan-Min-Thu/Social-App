import * as z from "zod";

export const OtpSchema = z.object({
  otp: z.string().length(6, { message: "Your otp must be 6 digits." }),
});

export const emailSchema = z.object({
  email: z.email({ message: "Invalid Email" }),
});

export const passwordSchema = z
  .object({
    password: z.string().length(8,{message:"Password must have 8 charactors."}),
    confirmPassword: z.string().length(8,{message:"Password must have 8 charactors."}),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords and confirmPassword do not match.",
    path: ["confirmPassword"],
  });
