import { Hono } from "hono";
import { CreateTagRequest, UpdateTagRequest } from "../models/tag.model";
import { TagService } from "../services/tag.service";
import { TagValidation } from "../validations/tag.validation";

export const tagController = new Hono();

// Create a new tag
tagController.post("/api/tags", async (c) => {
  const request = (await c.req.json()) as CreateTagRequest;
  const response = await TagService.createTag(request);
  return c.json({ data: response }, 201);
});

// Get all tags
tagController.get("/api/tags", async (c) => {
  const response = await TagService.getAllTags();
  return c.json({ data: response });
});

// Get tag by ID
tagController.get("/api/tags/:id", async (c) => {
  const { id } = TagValidation.ID.parse({ id: c.req.param("id") });
  const response = await TagService.getTagById(id);
  return c.json({ data: response });
});

// Update tag
tagController.put("/api/tags/:id", async (c) => {
  const { id } = TagValidation.ID.parse({ id: c.req.param("id") });
  const request = (await c.req.json()) as UpdateTagRequest;
  const response = await TagService.updateTag(id, request);
  return c.json({ data: response });
});

// Delete tag
tagController.delete("/api/tags/:id", async (c) => {
  const { id } = TagValidation.ID.parse({ id: c.req.param("id") });
  await TagService.deleteTag(id);
  return c.json({ message: "Tag deleted successfully" });
});
