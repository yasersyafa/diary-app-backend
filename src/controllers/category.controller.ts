import { Hono } from "hono";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../models/category.model";
import { CategoryService } from "../services/category.service";
import { CategoryValidation } from "../validations/category.validation";

export const categoryController = new Hono();

// Create a new category
categoryController.post("/api/categories", async (c) => {
  const request = (await c.req.json()) as CreateCategoryRequest;
  const response = await CategoryService.createCategory(request);
  return c.json({ data: response }, 201);
});

// Get all categories
categoryController.get("/api/categories", async (c) => {
  const response = await CategoryService.getAllCategories();
  return c.json({ data: response });
});

// Get category by ID
categoryController.get("/api/categories/:id", async (c) => {
  const { id } = CategoryValidation.ID.parse({ id: c.req.param("id") });
  const response = await CategoryService.getCategoryById(id);
  return c.json({ data: response });
});

// Update category
categoryController.put("/api/categories/:id", async (c) => {
  const { id } = CategoryValidation.ID.parse({ id: c.req.param("id") });
  const request = (await c.req.json()) as UpdateCategoryRequest;
  const response = await CategoryService.updateCategory(id, request);
  return c.json({ data: response });
});

// Delete category
categoryController.delete("/api/categories/:id", async (c) => {
  const { id } = CategoryValidation.ID.parse({ id: c.req.param("id") });
  await CategoryService.deleteCategory(id);
  return c.json({ message: "Category deleted successfully" });
});
