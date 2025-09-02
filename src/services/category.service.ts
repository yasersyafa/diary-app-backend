import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
  toCategoryResponse,
} from "../models/category.model";
import { CategoryValidation } from "../validations/category.validation";

export class CategoryService {
  static async createCategory(
    request: CreateCategoryRequest
  ): Promise<CategoryResponse> {
    // validation request
    request = CategoryValidation.CREATE.parse(request) as CreateCategoryRequest;

    // check if category name already exists
    const nameExists = await prismaClient.category.count({
      where: { name: request.name },
    });
    if (nameExists !== 0) {
      throw new HTTPException(400, {
        message: "Category name already exists, please choose a different name",
      });
    }

    // save to database
    const newCategory = await prismaClient.category.create({
      data: {
        name: request.name,
      },
    });

    // return response
    return toCategoryResponse(newCategory);
  }

  static async getAllCategories(): Promise<CategoryResponse[]> {
    const categories = await prismaClient.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories.map(toCategoryResponse);
  }

  static async getCategoryById(id: number): Promise<CategoryResponse> {
    const category = await prismaClient.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!category) {
      throw new HTTPException(404, {
        message: "Category not found",
      });
    }

    return toCategoryResponse(category);
  }

  static async updateCategory(
    id: number,
    request: UpdateCategoryRequest
  ): Promise<CategoryResponse> {
    // validation request
    request = CategoryValidation.UPDATE.parse(request) as UpdateCategoryRequest;

    // check if category exists
    const existingCategory = await prismaClient.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new HTTPException(404, {
        message: "Category not found",
      });
    }

    // if name is being updated, check if new name already exists
    if (request.name && request.name !== existingCategory.name) {
      const nameExists = await prismaClient.category.count({
        where: {
          name: request.name,
          id: { not: id }, // exclude current category
        },
      });
      if (nameExists !== 0) {
        throw new HTTPException(400, {
          message:
            "Category name already exists, please choose a different name",
        });
      }
    }

    // update category
    const updatedCategory = await prismaClient.category.update({
      where: { id },
      data: {
        ...(request.name && { name: request.name }),
      },
    });

    return toCategoryResponse(updatedCategory);
  }

  static async deleteCategory(id: number): Promise<void> {
    // check if category exists
    const existingCategory = await prismaClient.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!existingCategory) {
      throw new HTTPException(404, {
        message: "Category not found",
      });
    }

    // check if category has posts
    if (existingCategory._count.posts > 0) {
      throw new HTTPException(400, {
        message:
          "Cannot delete category that has posts. Please remove or reassign posts first.",
      });
    }

    // delete category
    await prismaClient.category.delete({
      where: { id },
    });
  }
}
