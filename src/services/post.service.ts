import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import {
  CreatePostRequest,
  UpdatePostRequest,
  PostResponse,
  PostListResponse,
  PostFilters,
  PaginationParams,
  PaginatedResponse,
  toPostResponse,
  toPostListResponse,
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
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    // return response
    return toPostResponse(newPost);
  }

  static async getAllPosts(
    pagination: PaginationParams,
    filters: PostFilters
  ): Promise<PaginatedResponse<PostListResponse>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};

    // Search by title
    if (filters.search) {
      where.title = {
        contains: filters.search,
        mode: "insensitive",
      };
    }

    // Filter by month and year
    if (filters.month || filters.year) {
      where.createdAt = {};
      if (filters.year) {
        where.createdAt.gte = new Date(filters.year, 0, 1); // Start of year
        where.createdAt.lt = new Date(filters.year + 1, 0, 1); // Start of next year
      }
      if (filters.month) {
        const year = filters.year || new Date().getFullYear();
        where.createdAt.gte = new Date(year, filters.month - 1, 1); // Start of month
        where.createdAt.lt = new Date(year, filters.month, 1); // Start of next month
      }
    }

    // Filter by category
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    // Filter by tag
    if (filters.tagId) {
      where.tags = {
        some: {
          id: filters.tagId,
        },
      };
    }

    // Get total count for pagination
    const total = await prismaClient.post.count({ where });

    // Get posts with pagination and relations
    const posts = await prismaClient.post.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: posts.map(toPostListResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }

  static async getPostById(id: string): Promise<PostResponse> {
    const post = await prismaClient.post.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      throw new HTTPException(404, {
        message: "Post not found",
      });
    }

    return toPostResponse(post);
  }

  static async updatePost(
    id: string,
    request: UpdatePostRequest
  ): Promise<PostResponse> {
    // validation request
    request = PostValidation.UPDATE.parse(request) as UpdatePostRequest;

    // check if post exists
    const existingPost = await prismaClient.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new HTTPException(404, {
        message: "Post not found",
      });
    }

    // if title is being updated, check if new title already exists
    if (request.title && request.title !== existingPost.title) {
      const titleExists = await prismaClient.post.count({
        where: {
          title: request.title,
          id: { not: id }, // exclude current post
        },
      });
      if (titleExists !== 0) {
        throw new HTTPException(400, {
          message: "Title already exists, please choose a different title",
        });
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (request.title) {
      updateData.title = request.title;
      updateData.slug = slugify(request.title);
    }

    if (request.content) {
      updateData.content = request.content;
      updateData.readTime = generateReadTime(request.content);
    }

    if (request.excerpt !== undefined) {
      updateData.excerpt = request.excerpt;
    }

    if (request.categoryId) {
      updateData.categoryId = request.categoryId;
    }

    // Update post
    const updatedPost = await prismaClient.post.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Update tags if provided
    if (request.tags !== undefined) {
      // First, disconnect all existing tags
      await prismaClient.post.update({
        where: { id },
        data: {
          tags: {
            set: [],
          },
        },
      });

      // Then connect new tags if any
      if (request.tags.length > 0) {
        await prismaClient.post.update({
          where: { id },
          data: {
            tags: {
              connect: request.tags.map((tagId) => ({ id: tagId })),
            },
          },
        });
      }

      // Fetch updated post with relations for response
      const finalPost = await prismaClient.post.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (finalPost) {
        return toPostResponse(finalPost);
      }
    }

    return toPostResponse(updatedPost);
  }

  static async deletePost(id: string): Promise<void> {
    // check if post exists
    const existingPost = await prismaClient.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new HTTPException(404, {
        message: "Post not found",
      });
    }

    // delete post (tags will be automatically disconnected due to cascade)
    await prismaClient.post.delete({
      where: { id },
    });
  }
}
