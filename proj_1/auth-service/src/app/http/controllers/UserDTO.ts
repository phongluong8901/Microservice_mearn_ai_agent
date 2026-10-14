import { z } from "zod";

export const userInputSchema = z.object({
    email: z.email()
        .min(5, "email must be at least 5 characters")
        .max(100, "email must be at most 100 characters"),
    // otpCode: z.string()
    // .min(6, "otpCode must be at least 6 characters")
    // .max(6, "otpCode must be at most 6 characters"),
    password: z
        .string({
            error: "password is required"
        })
        .min(6, "password is required")
        .max(255, "password is too long")
})