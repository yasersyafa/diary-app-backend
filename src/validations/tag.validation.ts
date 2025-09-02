import { z } from "zod";

export const TagValidation = {
  CREATE: z.object({
    name: z
      .string()
      .min(1, "Tag name is required")
      .max(100, "Tag name must be less than 100 characters"),
  }),

  UPDATE: z.object({
    name: z
      .string()
      .min(1, "Tag name is required")
      .max(100, "Tag name must be less than 100 characters")
      .optional(),
  }),

  ID: z.object({
    id: z.coerce.number().int().positive("Tag ID must be a positive integer"),
  }),
};
