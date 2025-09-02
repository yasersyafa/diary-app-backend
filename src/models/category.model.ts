import { Category } from "../generated/prisma";

export type CreateCategoryRequest = {
  name: string;
};

export type UpdateCategoryRequest = {
  name?: string;
};

export type CategoryResponse = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  postCount?: number;
};

export function toCategoryResponse(
  category: Category & { _count?: { posts: number } }
): CategoryResponse {
  return {
    id: category.id,
    name: category.name,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    postCount: category._count?.posts,
  };
}
