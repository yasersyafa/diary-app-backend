import { describe, it, expect } from "bun:test";
import {
  CreatePostRequest,
  PostResponse,
  toPostResponse,
} from "../src/models/post.model";

describe("Post Model", () => {
  describe("CreatePostRequest", () => {
    it("should have the correct structure", () => {
      const createPostRequest: CreatePostRequest = {
        title: "Test Post",
        content: "This is a test post content",
        excerpt: "A brief excerpt",
        categoryId: 1,
        tags: [1, 2, 3],
      };

      expect(createPostRequest.title).toBe("Test Post");
      expect(createPostRequest.content).toBe("This is a test post content");
      expect(createPostRequest.excerpt).toBe("A brief excerpt");
      expect(createPostRequest.categoryId).toBe(1);
      expect(createPostRequest.tags).toEqual([1, 2, 3]);
    });

    it("should allow optional excerpt and tags", () => {
      const createPostRequest: CreatePostRequest = {
        title: "Test Post",
        content: "This is a test post content",
        categoryId: 1,
      };

      expect(createPostRequest.title).toBe("Test Post");
      expect(createPostRequest.content).toBe("This is a test post content");
      expect(createPostRequest.excerpt).toBeUndefined();
      expect(createPostRequest.tags).toBeUndefined();
      expect(createPostRequest.categoryId).toBe(1);
    });
  });

  describe("PostResponse", () => {
    it("should have the correct structure", () => {
      const postResponse: PostResponse = {
        id: "test-id-123",
        title: "Test Post",
        slug: "test-post",
        content: "This is a test post content",
        excerpt: "A brief excerpt",
        categoryId: 1,
        readTime: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 1,
          name: "Technology",
        },
        tags: [
          { id: 1, name: "JavaScript" },
          { id: 2, name: "TypeScript" },
          { id: 3, name: "React" },
        ],
      };

      expect(postResponse.id).toBe("test-id-123");
      expect(postResponse.title).toBe("Test Post");
      expect(postResponse.slug).toBe("test-post");
      expect(postResponse.content).toBe("This is a test post content");
      expect(postResponse.excerpt).toBe("A brief excerpt");
      expect(postResponse.categoryId).toBe(1);
      expect(postResponse.readTime).toBe(5);
      expect(postResponse.createdAt).toBeInstanceOf(Date);
      expect(postResponse.updatedAt).toBeInstanceOf(Date);
      expect(postResponse.category.id).toBe(1);
      expect(postResponse.category.name).toBe("Technology");
      expect(postResponse.tags).toHaveLength(3);
    });

    it("should allow optional excerpt and tags", () => {
      const postResponse: PostResponse = {
        id: "test-id-123",
        title: "Test Post",
        slug: "test-post",
        content: "This is a test post content",
        categoryId: 1,
        readTime: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 1,
          name: "Technology",
        },
        tags: [],
      };

      expect(postResponse.excerpt).toBeUndefined();
      expect(postResponse.tags).toEqual([]);
    });
  });

  describe("toPostResponse", () => {
    it("should correctly map a Post with tags to PostResponse", () => {
      const mockPost = {
        id: "test-id-123",
        title: "Test Post",
        slug: "test-post",
        content: "This is a test post content",
        excerpt: "A brief excerpt",
        categoryId: 1,
        readTime: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 1,
          name: "Technology",
        },
        tags: [
          { id: 1, name: "JavaScript" },
          { id: 2, name: "TypeScript" },
          { id: 3, name: "React" },
        ],
      };

      const result = toPostResponse(mockPost);

      expect(result.id).toBe("test-id-123");
      expect(result.title).toBe("Test Post");
      expect(result.category.name).toBe("Technology");
      expect(result.tags).toHaveLength(3);
    });

    it("should correctly map a Post without tags to PostResponse", () => {
      const mockPost = {
        id: "test-id-123",
        title: "Test Post",
        slug: "test-post",
        content: "This is a test post content",
        excerpt: null,
        categoryId: 1,
        readTime: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 1,
          name: "Technology",
        },
        tags: [],
      };

      const result = toPostResponse(mockPost);

      expect(result.excerpt).toBeUndefined();
      expect(result.tags).toEqual([]);
    });

    it("should handle null excerpt correctly", () => {
      const mockPost = {
        id: "test-id-123",
        title: "Test Post",
        slug: "test-post",
        content: "This is a test post content",
        excerpt: null,
        categoryId: 1,
        readTime: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 1,
          name: "Technology",
        },
        tags: [],
      };

      const result = toPostResponse(mockPost);

      expect(result.excerpt).toBeUndefined();
    });

    it("should handle empty tags array correctly", () => {
      const mockPost = {
        id: "test-id-123",
        title: "Test Post",
        slug: "test-post",
        content: "This is a test post content",
        excerpt: null,
        categoryId: 1,
        readTime: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 1,
          name: "Technology",
        },
        tags: [],
      };

      const result = toPostResponse(mockPost);

      expect(result.tags).toEqual([]);
    });
  });
});
