import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
  toCategoryResponse,
} from "../src/models/category.model";
import { CategoryValidation } from "../src/validations/category.validation";

describe("Category Model", () => {
  describe("CreateCategoryRequest", () => {
    it("should have the correct structure", () => {
      const createCategoryRequest: CreateCategoryRequest = {
        name: "Technology",
      };

      expect(createCategoryRequest.name).toBe("Technology");
    });
  });

  describe("UpdateCategoryRequest", () => {
    it("should have the correct structure", () => {
      const updateCategoryRequest: UpdateCategoryRequest = {
        name: "Updated Technology",
      };

      expect(updateCategoryRequest.name).toBe("Updated Technology");
    });

    it("should allow optional name", () => {
      const updateCategoryRequest: UpdateCategoryRequest = {};

      expect(updateCategoryRequest.name).toBeUndefined();
    });
  });

  describe("CategoryResponse", () => {
    it("should have the correct structure", () => {
      const categoryResponse: CategoryResponse = {
        id: 1,
        name: "Technology",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
        postCount: 5,
      };

      expect(categoryResponse.id).toBe(1);
      expect(categoryResponse.name).toBe("Technology");
      expect(categoryResponse.createdAt).toBeInstanceOf(Date);
      expect(categoryResponse.updatedAt).toBeInstanceOf(Date);
      expect(categoryResponse.postCount).toBe(5);
    });

    it("should allow optional postCount", () => {
      const categoryResponse: CategoryResponse = {
        id: 1,
        name: "Technology",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      };

      expect(categoryResponse.postCount).toBeUndefined();
    });
  });

  describe("toCategoryResponse", () => {
    it("should correctly map a Category with post count to CategoryResponse", () => {
      const mockCategory = {
        id: 1,
        name: "Technology",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
        _count: {
          posts: 5,
        },
      };

      const result = toCategoryResponse(mockCategory);

      expect(result).toEqual({
        id: 1,
        name: "Technology",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
        postCount: 5,
      });
    });

    it("should correctly map a Category without post count to CategoryResponse", () => {
      const mockCategory = {
        id: 1,
        name: "Technology",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      };

      const result = toCategoryResponse(mockCategory);

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

describe("Category Validation", () => {
  describe("CREATE", () => {
    it("should validate valid category name", () => {
      const validData = { name: "Technology" };
      const result = CategoryValidation.CREATE.parse(validData);
      expect(result.name).toBe("Technology");
    });

    it("should reject empty name", () => {
      const invalidData = { name: "" };
      expect(() => CategoryValidation.CREATE.parse(invalidData)).toThrow();
    });

    it("should reject name longer than 100 characters", () => {
      const invalidData = { name: "a".repeat(101) };
      expect(() => CategoryValidation.CREATE.parse(invalidData)).toThrow();
    });

    it("should reject missing name", () => {
      const invalidData = {};
      expect(() => CategoryValidation.CREATE.parse(invalidData)).toThrow();
    });
  });

  describe("UPDATE", () => {
    it("should validate valid category name", () => {
      const validData = { name: "Updated Technology" };
      const result = CategoryValidation.UPDATE.parse(validData);
      expect(result.name).toBe("Updated Technology");
    });

    it("should allow empty object", () => {
      const validData = {};
      const result = CategoryValidation.UPDATE.parse(validData);
      expect(result.name).toBeUndefined();
    });

    it("should reject empty name when provided", () => {
      const invalidData = { name: "" };
      expect(() => CategoryValidation.UPDATE.parse(invalidData)).toThrow();
    });

    it("should reject name longer than 100 characters", () => {
      const invalidData = { name: "a".repeat(101) };
      expect(() => CategoryValidation.UPDATE.parse(invalidData)).toThrow();
    });
  });

  describe("ID", () => {
    it("should validate valid positive integer ID", () => {
      const validData = { id: 1 };
      const result = CategoryValidation.ID.parse(validData);
      expect(result.id).toBe(1);
    });

    it("should reject zero ID", () => {
      const invalidData = { id: 0 };
      expect(() => CategoryValidation.ID.parse(invalidData)).toThrow();
    });

    it("should reject negative ID", () => {
      const invalidData = { id: -1 };
      expect(() => CategoryValidation.ID.parse(invalidData)).toThrow();
    });

    it("should reject non-integer ID", () => {
      const invalidData = { id: 1.5 };
      expect(() => CategoryValidation.ID.parse(invalidData)).toThrow();
    });

    it("should reject string ID", () => {
      const invalidData = { id: "abc" };
      expect(() => CategoryValidation.ID.parse(invalidData)).toThrow();
    });
  });
});
