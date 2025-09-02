import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  CreatePostRequest,
  UpdatePostRequest,
  PaginationParams,
  PostFilters,
} from "../models/post.model";
import { PostService } from "../services/post.service";
import { PostValidation } from "../validations/post.validation";

export const postController = new Hono();

// Create a new post
postController.post("/api/posts", async (c) => {
  try {
    const request = (await c.req.json()) as CreatePostRequest;
    const response = await PostService.createPost(request);
    return c.json({ data: response }, 201);
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in createPost:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get all posts with pagination and filtering
postController.get("/api/posts", async (c) => {
  try {
    // Parse query parameters
    const pagination = PostValidation.PAGINATION.parse({
      page: c.req.query("page"),
      limit: c.req.query("limit"),
    }) as PaginationParams;

    const filters = PostValidation.FILTERS.parse({
      month: c.req.query("month"),
      year: c.req.query("year"),
      search: c.req.query("search"),
      categoryId: c.req.query("categoryId"),
      tagId: c.req.query("tagId"),
    }) as PostFilters;

    const response = await PostService.getAllPosts(pagination, filters);
    return c.json(response);
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in getAllPosts:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get post by ID
postController.get("/api/posts/:id", async (c) => {
  try {
    const { id } = PostValidation.ID.parse({ id: c.req.param("id") }) as {
      id: string;
    };
    const response = await PostService.getPostById(id);
    return c.json({ data: response });
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in getPostById:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Update post
postController.put("/api/posts/:id", async (c) => {
  try {
    const { id } = PostValidation.ID.parse({ id: c.req.param("id") }) as {
      id: string;
    };
    const request = (await c.req.json()) as UpdatePostRequest;
    const response = await PostService.updatePost(id, request);
    return c.json({ data: response });
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in updatePost:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Delete post
postController.delete("/api/posts/:id", async (c) => {
  try {
    const { id } = PostValidation.ID.parse({ id: c.req.param("id") }) as {
      id: string;
    };
    await PostService.deletePost(id);
    return c.json({ message: "Post deleted successfully" });
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    console.error("Unexpected error in deletePost:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});
