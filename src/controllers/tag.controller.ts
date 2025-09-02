import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { CreateTagRequest, UpdateTagRequest } from "../models/tag.model";
import { TagService } from "../services/tag.service";
import { TagValidation } from "../validations/tag.validation";

export const tagController = new Hono();

// Create a new tag
tagController.post("/tags", async (c) => {
  try {
    const request = (await c.req.json()) as CreateTagRequest;
    const response = await TagService.createTag(request);
    return c.json({ data: response }, 201);
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in createTag:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get all tags
tagController.get("/tags", async (c) => {
  try {
    const response = await TagService.getAllTags();
    return c.json({ data: response });
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in getAllTags:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get tag by ID
tagController.get("/tags/:id", async (c) => {
  try {
    const { id } = TagValidation.ID.parse({ id: c.req.param("id") });
    const response = await TagService.getTagById(id);
    return c.json({ data: response });
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in getTagById:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Update tag
tagController.put("/tags/:id", async (c) => {
  try {
    const { id } = TagValidation.ID.parse({ id: c.req.param("id") });
    const request = (await c.req.json()) as UpdateTagRequest;
    const response = await TagService.updateTag(id, request);
    return c.json({ data: response });
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in updateTag:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Delete tag
tagController.delete("/tags/:id", async (c) => {
  try {
    const { id } = TagValidation.ID.parse({ id: c.req.param("id") });
    await TagService.deleteTag(id);
    return c.json({ message: "Tag deleted successfully" });
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in deleteTag:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});
