import { Hono } from "hono";
import { CreatePostRequest } from "../models/post.model";

export const postController = new Hono();

postController.post("api/posts", async (c) => {
  const request = (await c.req.json()) as CreatePostRequest;

  // kirim ke service

  // kirim response
});
