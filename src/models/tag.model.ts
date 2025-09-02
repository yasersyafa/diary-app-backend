import { Tag } from "../generated/prisma";

export type CreateTagRequest = {
  name: string;
};

export type UpdateTagRequest = {
  name?: string;
};

export type TagResponse = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  postCount?: number;
};

export function toTagResponse(
  tag: Tag & { _count?: { posts: number } }
): TagResponse {
  return {
    id: tag.id,
    name: tag.name,
    createdAt: tag.createdAt,
    updatedAt: tag.updatedAt,
    postCount: tag._count?.posts,
  };
}
