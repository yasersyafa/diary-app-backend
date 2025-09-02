import { describe, it, expect } from "bun:test";
import {
  CreateTagRequest,
  UpdateTagRequest,
  TagResponse,
  toTagResponse,
} from "../src/models/tag.model";
import { TagValidation } from "../src/validations/tag.validation";

describe("Tag Model", () => {
  describe("CreateTagRequest", () => {
    it("should have the correct structure", () => {
      const createTagRequest: CreateTagRequest = {
        name: "Technology",
      };

      expect(createTagRequest.name).toBe("Technology");
    });
  });

  describe("UpdateTagRequest", () => {
    it("should have the correct structure", () => {
      const updateTagRequest: UpdateTagRequest = {
        name: "Updated Technology",
      };

      expect(updateTagRequest.name).toBe("Updated Technology");
    });

    it("should allow optional name", () => {
      const updateTagRequest: UpdateTagRequest = {};

      expect(updateTagRequest.name).toBeUndefined();
    });
  });

  describe("TagResponse", () => {
    it("should have the correct structure", () => {
      const tagResponse: TagResponse = {
        id: 1,
        name: "Technology",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
        postCount: 5,
      };

      expect(tagResponse.id).toBe(1);
      expect(tagResponse.name).toBe("Technology");
      expect(tagResponse.createdAt).toBeInstanceOf(Date);
      expect(tagResponse.updatedAt).toBeInstanceOf(Date);
      expect(tagResponse.postCount).toBe(5);
    });

    it("should allow optional postCount", () => {
      const tagResponse: TagResponse = {
        id: 1,
        name: "Technology",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      };

      expect(tagResponse.postCount).toBeUndefined();
    });
  });

  describe("toTagResponse", () => {
    it("should correctly map a Tag with post count to TagResponse", () => {
      const mockTag = {
        id: 1,
        name: "Technology",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
        _count: {
          posts: 5,
        },
      };

      const result = toTagResponse(mockTag);

      expect(result).toEqual({
        id: 1,
        name: "Technology",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
        postCount: 5,
      });
    });

    it("should correctly map a Tag without post count to TagResponse", () => {
      const mockTag = {
        id: 1,
        name: "Technology",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      };

      const result = toTagResponse(mockTag);

      expect(result).toEqual({
        id: 1,
        name: "Technology",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
        postCount: undefined,
      });
    });
  });
});

describe("Tag Validation", () => {
  describe("CREATE", () => {
    it("should validate valid tag name", () => {
      const validData = { name: "Technology" };
      const result = TagValidation.CREATE.parse(validData);
      expect(result.name).toBe("Technology");
    });

    it("should reject empty name", () => {
      const invalidData = { name: "" };
      expect(() => TagValidation.CREATE.parse(invalidData)).toThrow();
    });

    it("should reject name longer than 100 characters", () => {
      const invalidData = { name: "a".repeat(101) };
      expect(() => TagValidation.CREATE.parse(invalidData)).toThrow();
    });

    it("should reject missing name", () => {
      const invalidData = {};
      expect(() => TagValidation.CREATE.parse(invalidData)).toThrow();
    });
  });

  describe("UPDATE", () => {
    it("should validate valid tag name", () => {
      const validData = { name: "Updated Technology" };
      const result = TagValidation.UPDATE.parse(validData);
      expect(result.name).toBe("Updated Technology");
    });

    it("should allow empty object", () => {
      const validData = {};
      const result = TagValidation.UPDATE.parse(validData);
      expect(result.name).toBeUndefined();
    });

    it("should reject empty name when provided", () => {
      const invalidData = { name: "" };
      expect(() => TagValidation.UPDATE.parse(invalidData)).toThrow();
    });

    it("should reject name longer than 100 characters", () => {
      const invalidData = { name: "a".repeat(101) };
      expect(() => TagValidation.UPDATE.parse(invalidData)).toThrow();
    });
  });

  describe("ID", () => {
    it("should validate valid positive integer ID", () => {
      const validData = { id: 1 };
      const result = TagValidation.ID.parse(validData);
      expect(result.id).toBe(1);
    });

    it("should reject zero ID", () => {
      const invalidData = { id: 0 };
      expect(() => TagValidation.ID.parse(invalidData)).toThrow();
    });

    it("should reject negative ID", () => {
      const invalidData = { id: -1 };
      expect(() => TagValidation.ID.parse(invalidData)).toThrow();
    });

    it("should reject non-integer ID", () => {
      const invalidData = { id: 1.5 };
      expect(() => TagValidation.ID.parse(invalidData)).toThrow();
    });

    it("should reject string ID", () => {
      const invalidData = { id: "abc" };
      expect(() => TagValidation.ID.parse(invalidData)).toThrow();
    });
  });
});
