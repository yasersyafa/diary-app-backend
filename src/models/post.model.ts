import { Post } from "../generated/prisma";

export type CreatePostRequest = {
  title: string;
  content: string;
  excerpt?: string;
  categoryId: number;
  tags?: number[]; // Array of tag IDs for the many-to-many relationship
};

export type PostResponse = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  categoryId: number;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
  tags?: number[];
};

export function toPostResponse(
  post: Post & { tags?: { id: number }[] }
): PostResponse {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt ?? undefined,
    categoryId: post.categoryId,
    readTime: post.readTime,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    tags: post.tags?.map((tag) => tag.id) ?? [],
  };
}
