import { Hono } from "hono";
import { CreatePostRequest } from "../models/post.model";
import { PostService } from "../services/post.service";

export const postController = new Hono();

postController.post("api/posts", async (c) => {
  const request = (await c.req.json()) as CreatePostRequest;

  const response = await PostService.createPost(request);

  return c.json({ data: response }, 201);
});
