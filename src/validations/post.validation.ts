import z, { ZodType } from "zod";

export class PostValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().optional(),
    categoryId: z.number().min(1),
    tags: z.array(z.number()).optional(),
  });
}
