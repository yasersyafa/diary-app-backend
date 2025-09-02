import { Post } from "../generated/prisma";

export type CreatePostRequest = {
  title: string;
  content: string;
  excerpt?: string;
  categoryId: number;
  tags?: number[]; // Array of tag IDs for the many-to-many relationship
};

export type UpdatePostRequest = {
  title?: string;
  content?: string;
  excerpt?: string;
  categoryId?: number;
  tags?: number[];
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
  category: {
    id: number;
    name: string;
  };
  tags: {
    id: number;
    name: string;
  }[];
};

export type PostListResponse = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  readTime: number;
  createdAt: Date;
  category: {
    id: number;
    name: string;
  };
  tags: {
    id: number;
    name: string;
  }[];
};

export type PostFilters = {
  month?: number; // 1-12
  year?: number;
  search?: string;
  categoryId?: number;
  tagId?: number;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export function toPostResponse(
  post: Post & {
    category: { id: number; name: string };
    tags: { id: number; name: string }[];
  }
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
    category: post.category,
    tags: post.tags,
  };
}

export function toPostListResponse(
  post: Post & {
    category: { id: number; name: string };
    tags: { id: number; name: string }[];
  }
): PostListResponse {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? undefined,
    readTime: post.readTime,
    createdAt: post.createdAt,
    category: post.category,
    tags: post.tags,
  };
}
