import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../models/category.model";
import { CategoryService } from "../services/category.service";
import { CategoryValidation } from "../validations/category.validation";

export const categoryController = new Hono();

// Create a new category
categoryController.post("/api/categories", async (c) => {
  try {
    const request = (await c.req.json()) as CreateCategoryRequest;
    const response = await CategoryService.createCategory(request);
    return c.json({ data: response }, 201);
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in createCategory:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get all categories
categoryController.get("/api/categories", async (c) => {
  try {
    const response = await CategoryService.getAllCategories();
    return c.json({ data: response });
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in getAllCategories:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get category by ID
categoryController.get("/api/categories/:id", async (c) => {
  try {
    const { id } = CategoryValidation.ID.parse({ id: c.req.param("id") });
    const response = await CategoryService.getCategoryById(id);
    return c.json({ data: response });
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in getCategoryById:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Update category
categoryController.put("/api/categories/:id", async (c) => {
  try {
    const { id } = CategoryValidation.ID.parse({ id: c.req.param("id") });
    const request = (await c.req.json()) as UpdateCategoryRequest;
    const response = await CategoryService.updateCategory(id, request);
    return c.json({ data: response });
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in updateCategory:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Delete category
categoryController.delete("/api/categories/:id", async (c) => {
  try {
    const { id } = CategoryValidation.ID.parse({ id: c.req.param("id") });
    await CategoryService.deleteCategory(id);
    return c.json({ message: "Category deleted successfully" });
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in deleteCategory:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});
