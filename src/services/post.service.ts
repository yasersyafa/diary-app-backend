import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import {
  CreatePostRequest,
  PostResponse,
  toPostResponse,
} from "../models/post.model";
import { PostValidation } from "../validations/post.validation";
import { slugify } from "../helpers/slug";
import { generateReadTime } from "../helpers/readTime";

export class PostService {
  static async createPost(request: CreatePostRequest): Promise<PostResponse> {
    // validation request
    request = PostValidation.CREATE.parse(request) as CreatePostRequest;

    const titleExist = await prismaClient.post.count({
      where: { title: request.title },
    });
    if (titleExist != 0) {
      // throw an error
      throw new HTTPException(400, {
        message: "Title already exist, please change your title",
      });
    }

    // making slug from title
    const slug = slugify(request.title);
    // making readTime from content
    const readTime = generateReadTime(request.content);

    // save to database
    const newPost = await prismaClient.post.create({
      data: {
        title: request.title,
        slug,
        content: request.content,
        excerpt: request.excerpt,
        readTime,
        categoryId: request.categoryId,
        tags: request.tags
          ? { connect: request.tags.map((tag) => ({ id: tag })) }
          : undefined,
      },
    });
    // return response
    return toPostResponse(newPost);
  }
}
