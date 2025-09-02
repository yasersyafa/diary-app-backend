import z, { ZodType } from "zod";

export class PostValidation {
  static readonly CREATE: ZodType = z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be less than 200 characters"),
    content: z.string().min(1, "Content is required"),
    excerpt: z
      .string()
      .max(500, "Excerpt must be less than 500 characters")
      .optional(),
    categoryId: z
      .number()
      .int()
      .positive("Category ID must be a positive integer"),
    tags: z
      .array(z.number().int().positive("Tag ID must be a positive integer"))
      .optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be less than 200 characters")
      .optional(),
    content: z.string().min(1, "Content is required").optional(),
    excerpt: z
      .string()
      .max(500, "Excerpt must be less than 500 characters")
      .optional(),
    categoryId: z
      .number()
      .int()
      .positive("Category ID must be a positive integer")
      .optional(),
    tags: z
      .array(z.number().int().positive("Tag ID must be a positive integer"))
      .optional(),
  });

  static readonly ID: ZodType = z.object({
    id: z.string().min(1, "Post ID is required"),
  });

  static readonly PAGINATION: ZodType = z.object({
    page: z.coerce.number().int().min(1, "Page must be at least 1").default(1),
    limit: z.coerce
      .number()
      .int()
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
      .default(6),
  });

  static readonly FILTERS: ZodType = z.object({
    month: z.coerce
      .number()
      .int()
      .min(1, "Month must be between 1-12")
      .max(12, "Month must be between 1-12")
      .optional(),
    year: z.coerce
      .number()
      .int()
      .min(1900, "Year must be at least 1900")
      .max(2100, "Year cannot exceed 2100")
      .optional(),
    search: z.string().max(100, "Search term too long").optional(),
    categoryId: z.coerce
      .number()
      .int()
      .positive("Category ID must be a positive integer")
      .optional(),
    tagId: z.coerce
      .number()
      .int()
      .positive("Tag ID must be a positive integer")
      .optional(),
  });
}
