# API SPECIFICATIONS

## 📋 **Overview**

This document provides comprehensive specifications for the Diary App API, including endpoints, request/response formats, error handling, and examples.

## 🌐 **Base URL**

```
Production: https://your-domain.vercel.app
Development: http://localhost:3000
```

## 🔐 **Authentication**

Currently, the API does not require authentication. All endpoints are publicly accessible.

## 📊 **Response Format**

All API responses follow a consistent format:

### **Success Response:**

```json
{
  "data": {
    // Response data here
  }
}
```

### **Error Response:**

```json
{
  "error": "Error message description"
}
```

### **Paginated Response:**

```json
{
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 6,
    "total": 25,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 📝 **POSTS API**

### **Create Post**

- **Endpoint:** `POST /api/posts`
- **Description:** Create a new blog post
- **Request Body:**

```json
{
  "title": "My First Post",
  "content": "This is the content of my first post...",
  "excerpt": "A brief summary of the post",
  "categoryId": 1,
  "tags": [1, 2, 3]
}
```

- **Response:** `201 Created`

```json
{
  "data": {
    "id": "post-id-123",
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "This is the content of my first post...",
    "excerpt": "A brief summary of the post",
    "categoryId": 1,
    "readTime": 3,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "category": {
      "id": 1,
      "name": "Technology"
    },
    "tags": [
      { "id": 1, "name": "JavaScript" },
      { "id": 2, "name": "TypeScript" },
      { "id": 3, "name": "React" }
    ]
  }
}
```

### **Get All Posts**

- **Endpoint:** `GET /api/posts`
- **Description:** Retrieve all posts with pagination and filtering
- **Query Parameters:**

  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Posts per page (default: 6, max: 100)
  - `search` (optional): Search posts by title
  - `month` (optional): Filter by month (1-12)
  - `year` (optional): Filter by year (1900-2100)
  - `categoryId` (optional): Filter by category ID
  - `tagId` (optional): Filter by tag ID

- **Example Request:** `GET /api/posts?page=1&limit=10&search=technology&year=2024`
- **Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "post-id-123",
      "title": "Technology Post",
      "slug": "technology-post",
      "excerpt": "A brief summary",
      "readTime": 5,
      "createdAt": "2024-01-01T00:00:00Z",
      "category": {
        "id": 1,
        "name": "Technology"
      },
      "tags": [
        { "id": 1, "name": "JavaScript" },
        { "id": 2, "name": "TypeScript" }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### **Get Post by ID**

- **Endpoint:** `GET /api/posts/:id`
- **Description:** Retrieve a specific post by ID
- **Path Parameters:**
  - `id`: Post ID (string)
- **Response:** `200 OK`

```json
{
  "data": {
    "id": "post-id-123",
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "Full post content...",
    "excerpt": "A brief summary",
    "categoryId": 1,
    "readTime": 5,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "category": {
      "id": 1,
      "name": "Technology"
    },
    "tags": [
      { "id": 1, "name": "JavaScript" },
      { "id": 2, "name": "TypeScript" }
    ]
  }
}
```

### **Update Post**

- **Endpoint:** `PUT /api/posts/:id`
- **Description:** Update an existing post
- **Path Parameters:**
  - `id`: Post ID (string)
- **Request Body:**

```json
{
  "title": "Updated Post Title",
  "content": "Updated content...",
  "excerpt": "Updated excerpt",
  "categoryId": 2,
  "tags": [4, 5]
}
```

- **Response:** `200 OK`

```json
{
  "data": {
    "id": "post-id-123",
    "title": "Updated Post Title",
    "slug": "updated-post-title",
    "content": "Updated content...",
    "excerpt": "Updated excerpt",
    "categoryId": 2,
    "readTime": 4,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "tags": [4, 5]
  }
}
```

### **Delete Post**

- **Endpoint:** `DELETE /api/posts/:id`
- **Description:** Delete a post
- **Path Parameters:**
  - `id`: Post ID (string)
- **Response:** `200 OK`

```json
{
  "message": "Post deleted successfully"
}
```

## 🏷️ **CATEGORIES API**

### **Create Category**

- **Endpoint:** `POST /api/categories`
- **Description:** Create a new category
- **Request Body:**

```json
{
  "name": "Technology",
  "description": "Articles about technology, programming, and software development"
}
```

- **Response:** `201 Created`

```json
{
  "data": {
    "id": 1,
    "name": "Technology",
    "description": "Articles about technology, programming, and software development",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "postCount": 0
  }
}
```

### **Get All Categories**

- **Endpoint:** `GET /api/categories`
- **Description:** Retrieve all categories with post counts
- **Response:** `200 OK`

```json
{
  "data": [
    {
      "id": 1,
      "name": "Technology",
      "description": "Articles about technology, programming, and software development",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "postCount": 5
    },
    {
      "id": 2,
      "name": "Lifestyle",
      "description": "Personal development, health, and lifestyle articles",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "postCount": 3
    }
  ]
}
```

### **Get Category by ID**

- **Endpoint:** `GET /api/categories/:id`
- **Description:** Retrieve a specific category by ID
- **Path Parameters:**
  - `id`: Category ID (number)
- **Response:** `200 OK`

```json
{
  "data": {
    "id": 1,
    "name": "Technology",
    "description": "Articles about technology, programming, and software development",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "postCount": 5
  }
}
```

### **Update Category**

- **Endpoint:** `PUT /api/categories/:id`
- **Description:** Update an existing category
- **Path Parameters:**
  - `id`: Category ID (number)
- **Request Body:**

```json
{
  "name": "Updated Technology",
  "description": "Updated description for technology category"
}
```

- **Response:** `200 OK`

```json
{
  "data": {
    "id": 1,
    "name": "Updated Technology",
    "description": "Updated description for technology category",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### **Delete Category**

- **Endpoint:** `DELETE /api/categories/:id`
- **Description:** Delete a category (only if it has no posts)
- **Path Parameters:**
  - `id`: Category ID (number)
- **Response:** `200 OK`

```json
{
  "message": "Category deleted successfully"
}
```

## 🏷️ **TAGS API**

### **Create Tag**

- **Endpoint:** `POST /api/tags`
- **Description:** Create a new tag
- **Request Body:**

```json
{
  "name": "JavaScript"
}
```

- **Response:** `201 Created`

```json
{
  "data": {
    "id": 1,
    "name": "JavaScript",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "postCount": 0
  }
}
```

### **Get All Tags**

- **Endpoint:** `GET /api/tags`
- **Description:** Retrieve all tags with post counts
- **Response:** `200 OK`

```json
{
  "data": [
    {
      "id": 1,
      "name": "JavaScript",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "postCount": 3
    },
    {
      "id": 2,
      "name": "TypeScript",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "postCount": 2
    }
  ]
}
```

### **Get Tag by ID**

- **Endpoint:** `GET /api/tags/:id`
- **Description:** Retrieve a specific tag by ID
- **Path Parameters:**
  - `id`: Tag ID (number)
- **Response:** `200 OK`

```json
{
  "data": {
    "id": 1,
    "name": "JavaScript",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "postCount": 3
  }
}
```

### **Update Tag**

- **Endpoint:** `PUT /api/tags/:id`
- **Description:** Update an existing tag
- **Path Parameters:**
  - `id`: Tag ID (number)
- **Request Body:**

```json
{
  "name": "Updated JavaScript"
}
```

- **Response:** `200 OK`

```json
{
  "data": {
    "id": 1,
    "name": "Updated JavaScript",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### **Delete Tag**

- **Endpoint:** `DELETE /api/tags/:id`
- **Description:** Delete a tag (only if it has no posts)
- **Path Parameters:**
  - `id`: Tag ID (number)
- **Response:** `200 OK`

```json
{
  "message": "Tag deleted successfully"
}
```

## ⚠️ **ERROR HANDLING**

### **HTTP Status Codes**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, duplicates)
- `404` - Not Found
- `500` - Internal Server Error

### **Common Error Messages**

#### **Posts:**

- `"Title already exist, please change your title"`
- `"Post not found"`
- `"Title already exists, please choose a different title"`

#### **Categories:**

- `"Category name already exists, please choose a different name"`
- `"Category not found"`
- `"Cannot delete category that has posts. Please remove or reassign posts first."`

#### **Tags:**

- `"Tag name already exists, please choose a different name"`
- `"Tag not found"`
- `"Cannot delete tag that has posts. Please remove or reassign posts first."`

#### **Validation Errors:**

- `"Title is required"`
- `"Title must be less than 200 characters"`
- `"Content is required"`
- `"Category ID must be a positive integer"`
- `"Month must be between 1-12"`
- `"Year must be at least 1900"`
- `"Search term too long"`

## ✅ **VALIDATION RULES**

### **Posts:**

- **Title**: Required, 1-200 characters
- **Content**: Required, minimum 1 character
- **Excerpt**: Optional, maximum 500 characters
- **Category ID**: Required, positive integer
- **Tags**: Optional, array of positive integers

### **Categories:**

- **Name**: Required, 1-100 characters, unique
- **Description**: Required, 1-500 characters

### **Tags:**

- **Name**: Required, 1-100 characters, unique

### **Pagination:**

- **Page**: Minimum 1, default 1
- **Limit**: 1-100, default 6

### **Filters:**

- **Month**: 1-12
- **Year**: 1900-2100
- **Search**: Maximum 100 characters
- **Category ID**: Positive integer
- **Tag ID**: Positive integer

## 📱 **USAGE EXAMPLES**

### **Create a Post with Category and Tags**

```bash
curl -X POST https://your-domain.vercel.app/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started with TypeScript",
    "content": "TypeScript is a powerful superset of JavaScript...",
    "excerpt": "Learn the basics of TypeScript",
    "categoryId": 1,
    "tags": [1, 2]
  }'
```

### **Get Posts with Filtering**

```bash
curl "https://your-domain.vercel.app/api/posts?search=typescript&year=2024&page=1&limit=10"
```

### **Update a Category**

```bash
curl -X PUT https://your-domain.vercel.app/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Web Development",
    "description": "Articles about web development, frontend, and backend technologies"
  }'
```

### **Delete a Tag**

```bash
curl -X DELETE https://your-domain.vercel.app/api/tags/1
```

## 🚀 **DEPLOYMENT**

### **Environment Variables**

```bash
DATABASE_URL="postgresql://username:password@host:port/database"
```

### **Build Commands**

```bash
# Install dependencies
bun install

# Generate Prisma client
bun run prisma:generate

# Build application
bun run build

# Start production server
bun run start
```

## 📚 **ADDITIONAL RESOURCES**

- **Prisma Documentation**: https://prisma.io/docs
- **Hono Framework**: https://hono.dev
- **Bun Runtime**: https://bun.sh
- **PostgreSQL**: https://www.postgresql.org/docs

## 🔄 **API VERSIONING**

Current API version: **v1**

All endpoints are prefixed with `/api/` and follow RESTful conventions.

## 📞 **SUPPORT**

For API support or questions, please refer to the project documentation or create an issue in the repository.
