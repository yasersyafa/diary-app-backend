import { Hono } from "hono";
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
  const request = (await c.req.json()) as CreatePostRequest;
  const response = await PostService.createPost(request);
  return c.json({ data: response }, 201);
});

// Get all posts with pagination and filtering
postController.get("/api/posts", async (c) => {
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
});

// Get post by ID
postController.get("/api/posts/:id", async (c) => {
  const { id } = PostValidation.ID.parse({ id: c.req.param("id") }) as {
    id: string;
  };
  const response = await PostService.getPostById(id);
  return c.json({ data: response });
});

// Update post
postController.put("/api/posts/:id", async (c) => {
  const { id } = PostValidation.ID.parse({ id: c.req.param("id") }) as {
    id: string;
  };
  const request = (await c.req.json()) as UpdatePostRequest;
  const response = await PostService.updatePost(id, request);
  return c.json({ data: response });
});

// Delete post
postController.delete("/api/posts/:id", async (c) => {
  const { id } = PostValidation.ID.parse({ id: c.req.param("id") }) as {
    id: string;
  };
  await PostService.deletePost(id);
  return c.json({ message: "Post deleted successfully" });
});
