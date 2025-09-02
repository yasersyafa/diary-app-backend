import { z } from "zod";

export const CategoryValidation = {
  CREATE: z.object({
    name: z
      .string()
      .min(1, "Category name is required")
      .max(100, "Category name must be less than 100 characters"),
  }),

  UPDATE: z.object({
    name: z
      .string()
      .min(1, "Category name is required")
      .max(100, "Category name must be less than 100 characters")
      .optional(),
  }),

  ID: z.object({
    id: z.coerce
      .number()
      .int()
      .positive("Category ID must be a positive integer"),
  }),
};
