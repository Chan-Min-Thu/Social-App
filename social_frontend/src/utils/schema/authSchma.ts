import * as z from "zod";

export const authSchema = z.object({
  email: z.email({ message: "Your email does not match." }),
  password: z
    .string({ message: "Password must be 10 characters." })
    .min(10, { message: "Password must be 10 characters." })
    .max(10, { message: "Password must be 10 characters." }),
});
