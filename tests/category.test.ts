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
    it("should have the correct structure with required fields", () => {
      const createCategoryRequest: CreateCategoryRequest = {
        name: "Technology",
        description: "Articles about technology and programming",
      };

      expect(createCategoryRequest.name).toBe("Technology");
      expect(createCategoryRequest.description).toBe(
        "Articles about technology and programming"
      );
    });

    it("should enforce required name field", () => {
      // @ts-expect-error - name is required
      const createCategoryRequest: CreateCategoryRequest = {
        description: "Articles about technology and programming",
      };
    });

    it("should enforce required description field", () => {
      // @ts-expect-error - description is required
      const createCategoryRequest: CreateCategoryRequest = {
        name: "Technology",
      };
    });
  });

  describe("UpdateCategoryRequest", () => {
    it("should have the correct structure with optional fields", () => {
      const updateCategoryRequest: UpdateCategoryRequest = {
        name: "Updated Technology",
        description: "Updated description for technology",
      };

      expect(updateCategoryRequest.name).toBe("Updated Technology");
      expect(updateCategoryRequest.description).toBe(
        "Updated description for technology"
      );
    });

    it("should allow updating only name", () => {
      const updateCategoryRequest: UpdateCategoryRequest = {
        name: "Updated Technology",
      };

      expect(updateCategoryRequest.name).toBe("Updated Technology");
      expect(updateCategoryRequest.description).toBeUndefined();
    });

    it("should allow updating only description", () => {
      const updateCategoryRequest: UpdateCategoryRequest = {
        description: "Updated description",
      };

      expect(updateCategoryRequest.name).toBeUndefined();
      expect(updateCategoryRequest.description).toBe("Updated description");
    });

    it("should allow empty object for no updates", () => {
      const updateCategoryRequest: UpdateCategoryRequest = {};

      expect(updateCategoryRequest.name).toBeUndefined();
      expect(updateCategoryRequest.description).toBeUndefined();
    });
  });

  describe("CategoryResponse", () => {
    it("should have the correct structure with all fields", () => {
      const categoryResponse: CategoryResponse = {
        id: 1,
        name: "Technology",
        description: "Articles about technology and programming",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
        postCount: 5,
      };

      expect(categoryResponse.id).toBe(1);
      expect(categoryResponse.name).toBe("Technology");
      expect(categoryResponse.description).toBe(
        "Articles about technology and programming"
      );
      expect(categoryResponse.createdAt).toBeInstanceOf(Date);
      expect(categoryResponse.updatedAt).toBeInstanceOf(Date);
      expect(categoryResponse.postCount).toBe(5);
    });

    it("should enforce required description field", () => {
      // @ts-expect-error - description is required
      const categoryResponse: CategoryResponse = {
        id: 1,
        name: "Technology",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
        postCount: 5,
      };
    });

    it("should enforce required postCount field", () => {
      // @ts-expect-error - postCount is required
      const categoryResponse: CategoryResponse = {
        id: 1,
        name: "Technology",
        description: "Articles about technology and programming",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      };
    });
  });

  describe("toCategoryResponse", () => {
    it("should correctly map a Category with post count to CategoryResponse", () => {
      const mockCategory = {
        id: 1,
        name: "Technology",
        description: "Articles about technology and programming",
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
        description: "Articles about technology and programming",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
        postCount: 5,
      });
    });

    it("should correctly map a Category without post count to CategoryResponse", () => {
      const mockCategory = {
        id: 1,
        name: "Technology",
        description: "Articles about technology and programming",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      };

      const result = toCategoryResponse(mockCategory);

      expect(result).toEqual({
        id: 1,
        name: "Technology",
        description: "Articles about technology and programming",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
        postCount: 0,
      });
    });

    it("should handle category with null post count", () => {
      const mockCategory = {
        id: 1,
        name: "Technology",
        description: "Articles about technology and programming",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
        _count: {
          posts: null,
        },
      };

      const result = toCategoryResponse(mockCategory);

      expect(result.postCount).toBe(0);
    });
  });
});

describe("Category Validation", () => {
  describe("CREATE", () => {
    it("should validate valid category data", () => {
      const validData = {
        name: "Technology",
        description: "Articles about technology and programming",
      };
      const result = CategoryValidation.CREATE.parse(validData);
      expect(result.name).toBe("Technology");
      expect(result.description).toBe(
        "Articles about technology and programming"
      );
    });

    it("should reject empty name", () => {
      const invalidData = {
        name: "",
        description: "Valid description",
      };
      expect(() => CategoryValidation.CREATE.parse(invalidData)).toThrow();
    });

    it("should reject name longer than 100 characters", () => {
      const invalidData = {
        name: "a".repeat(101),
        description: "Valid description",
      };
      expect(() => CategoryValidation.CREATE.parse(invalidData)).toThrow();
    });

    it("should reject missing name", () => {
      const invalidData = { description: "Valid description" };
      expect(() => CategoryValidation.CREATE.parse(invalidData)).toThrow();
    });

    it("should reject empty description", () => {
      const invalidData = {
        name: "Technology",
        description: "",
      };
      expect(() => CategoryValidation.CREATE.parse(invalidData)).toThrow();
    });

    it("should reject description longer than 500 characters", () => {
      const invalidData = {
        name: "Technology",
        description: "a".repeat(501),
      };
      expect(() => CategoryValidation.CREATE.parse(invalidData)).toThrow();
    });

    it("should reject missing description", () => {
      const invalidData = { name: "Technology" };
      expect(() => CategoryValidation.CREATE.parse(invalidData)).toThrow();
    });

    it("should reject empty object", () => {
      const invalidData = {};
      expect(() => CategoryValidation.CREATE.parse(invalidData)).toThrow();
    });
  });

  describe("UPDATE", () => {
    it("should validate valid category name update", () => {
      const validData = { name: "Updated Technology" };
      const result = CategoryValidation.UPDATE.parse(validData);
      expect(result.name).toBe("Updated Technology");
      expect(result.description).toBeUndefined();
    });

    it("should validate valid category description update", () => {
      const validData = { description: "Updated description" };
      const result = CategoryValidation.UPDATE.parse(validData);
      expect(result.name).toBeUndefined();
      expect(result.description).toBe("Updated description");
    });

    it("should validate valid category name and description update", () => {
      const validData = {
        name: "Updated Technology",
        description: "Updated description",
      };
      const result = CategoryValidation.UPDATE.parse(validData);
      expect(result.name).toBe("Updated Technology");
      expect(result.description).toBe("Updated description");
    });

    it("should allow empty object for no updates", () => {
      const validData = {};
      const result = CategoryValidation.UPDATE.parse(validData);
      expect(result.name).toBeUndefined();
      expect(result.description).toBeUndefined();
    });

    it("should reject empty name when provided", () => {
      const invalidData = { name: "" };
      expect(() => CategoryValidation.UPDATE.parse(invalidData)).toThrow();
    });

    it("should reject name longer than 100 characters", () => {
      const invalidData = { name: "a".repeat(101) };
      expect(() => CategoryValidation.UPDATE.parse(invalidData)).toThrow();
    });

    it("should reject empty description when provided", () => {
      const invalidData = { description: "" };
      expect(() => CategoryValidation.UPDATE.parse(invalidData)).toThrow();
    });

    it("should reject description longer than 500 characters", () => {
      const invalidData = { description: "a".repeat(501) };
      expect(() => CategoryValidation.UPDATE.parse(invalidData)).toThrow();
    });
  });

  describe("ID", () => {
    it("should validate valid positive integer ID", () => {
      const validData = { id: "1" };
      const result = CategoryValidation.ID.parse(validData);
      expect(result.id).toBe(1);
    });

    it("should validate valid large positive integer ID", () => {
      const validData = { id: "999999" };
      const result = CategoryValidation.ID.parse(validData);
      expect(result.id).toBe(999999);
    });

    it("should reject zero ID", () => {
      const invalidData = { id: "0" };
      expect(() => CategoryValidation.ID.parse(invalidData)).toThrow();
    });

    it("should reject negative ID", () => {
      const invalidData = { id: "-1" };
      expect(() => CategoryValidation.ID.parse(invalidData)).toThrow();
    });

    it("should reject non-numeric string ID", () => {
      const invalidData = { id: "abc" };
      expect(() => CategoryValidation.ID.parse(invalidData)).toThrow();
    });

    it("should reject decimal string ID", () => {
      const invalidData = { id: "1.5" };
      expect(() => CategoryValidation.ID.parse(invalidData)).toThrow();
    });

    it("should reject empty string ID", () => {
      const invalidData = { id: "" };
      expect(() => CategoryValidation.ID.parse(invalidData)).toThrow();
    });

    it("should reject missing ID", () => {
      const invalidData = {};
      expect(() => CategoryValidation.ID.parse(invalidData)).toThrow();
    });
  });
});

describe("Category Integration Tests", () => {
  describe("Data Flow", () => {
    it("should handle complete category lifecycle", () => {
      // Create request
      const createRequest: CreateCategoryRequest = {
        name: "Test Category",
        description: "Test description for the category",
      };

      // Update request
      const updateRequest: UpdateCategoryRequest = {
        name: "Updated Test Category",
        description: "Updated test description",
      };

      // Response
      const response: CategoryResponse = {
        id: 1,
        name: "Updated Test Category",
        description: "Updated test description",
        createdAt: new Date(),
        updatedAt: new Date(),
        postCount: 0,
      };

      expect(createRequest.name).toBe("Test Category");
      expect(createRequest.description).toBe(
        "Test description for the category"
      );
      expect(updateRequest.name).toBe("Updated Test Category");
      expect(updateRequest.description).toBe("Updated test description");
      expect(response.id).toBe(1);
      expect(response.postCount).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle minimum valid values", () => {
      const createRequest: CreateCategoryRequest = {
        name: "A",
        description: "B",
      };

      expect(createRequest.name.length).toBe(1);
      expect(createRequest.description.length).toBe(1);
    });

    it("should handle maximum valid values", () => {
      const createRequest: CreateCategoryRequest = {
        name: "a".repeat(100),
        description: "a".repeat(500),
      };

      expect(createRequest.name.length).toBe(100);
      expect(createRequest.description.length).toBe(500);
    });
  });
});
