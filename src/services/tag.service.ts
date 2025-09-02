import { HTTPException } from "hono/http-exception";
import { prismaClient } from "../application/database";
import {
  CreateTagRequest,
  UpdateTagRequest,
  TagResponse,
  toTagResponse,
} from "../models/tag.model";
import { TagValidation } from "../validations/tag.validation";

export class TagService {
  static async createTag(request: CreateTagRequest): Promise<TagResponse> {
    // validation request
    request = TagValidation.CREATE.parse(request) as CreateTagRequest;

    // check if tag name already exists
    const nameExists = await prismaClient.tag.count({
      where: { name: request.name },
    });
    if (nameExists !== 0) {
      throw new HTTPException(400, {
        message: "Tag name already exists, please choose a different name",
      });
    }

    // save to database
    const newTag = await prismaClient.tag.create({
      data: {
        name: request.name,
      },
    });

    // return response
    return toTagResponse(newTag);
  }

  static async getAllTags(): Promise<TagResponse[]> {
    const tags = await prismaClient.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return tags.map(toTagResponse);
  }

  static async getTagById(id: number): Promise<TagResponse> {
    const tag = await prismaClient.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!tag) {
      throw new HTTPException(404, {
        message: "Tag not found",
      });
    }

    return toTagResponse(tag);
  }

  static async updateTag(
    id: number,
    request: UpdateTagRequest
  ): Promise<TagResponse> {
    // validation request
    request = TagValidation.UPDATE.parse(request) as UpdateTagRequest;

    // check if tag exists
    const existingTag = await prismaClient.tag.findUnique({
      where: { id },
    });

    if (!existingTag) {
      throw new HTTPException(404, {
        message: "Tag not found",
      });
    }

    // if name is being updated, check if new name already exists
    if (request.name && request.name !== existingTag.name) {
      const nameExists = await prismaClient.tag.count({
        where: {
          name: request.name,
          id: { not: id }, // exclude current tag
        },
      });
      if (nameExists !== 0) {
        throw new HTTPException(400, {
          message: "Tag name already exists, please choose a different name",
        });
      }
    }

    // update tag
    const updatedTag = await prismaClient.tag.update({
      where: { id },
      data: {
        ...(request.name && { name: request.name }),
      },
    });

    return toTagResponse(updatedTag);
  }

  static async deleteTag(id: number): Promise<void> {
    // check if tag exists
    const existingTag = await prismaClient.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!existingTag) {
      throw new HTTPException(404, {
        message: "Tag not found",
      });
    }

    // check if tag has posts
    if (existingTag._count.posts > 0) {
      throw new HTTPException(400, {
        message:
          "Cannot delete tag that has posts. Please remove or reassign posts first.",
      });
    }

    // delete tag
    await prismaClient.tag.delete({
      where: { id },
    });
  }
}
