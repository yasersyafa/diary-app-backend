import { Category } from "../generated/prisma";

export type CreateCategoryRequest = {
  name: string;
  description: string;
};

export type UpdateCategoryRequest = {
  name?: string;
  description?: string;
};

export type CategoryResponse = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  postCount: number;
};

export const toCategoryResponse = (category: any): CategoryResponse => {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    postCount: category._count?.posts || 0,
  };
};
