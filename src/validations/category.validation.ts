import { z } from "zod";

export const CategoryValidation = {
  CREATE: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be less than 100 characters"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description must be less than 500 characters"),
  }),

  UPDATE: z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be less than 100 characters")
      .optional(),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description must be less than 500 characters")
      .optional(),
  }),

  ID: z.object({
    id: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "ID must be a positive integer",
      }),
  }),
};
