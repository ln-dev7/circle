# Content API

## 📋 Table of Contents

- [Overview](#overview)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Overview

Content API quản lý việc tạo, chỉnh sửa, và quản lý nội dung marketing trong campaigns. API hỗ trợ AI-assisted content generation, approval workflow, và status management.

### Key Features

- **Content CRUD**: Create, read, update, delete content
- **AI Integration**: AI-assisted content generation
- **Status Workflow**: DRAFT → SUBMITTED → APPROVED → SCHEDULED → PUBLISHED
- **Asset Management**: File attachments và media linking
- **Campaign Integration**: Content thuộc về campaigns

## Endpoints

### 📋 List Content

```http
GET /api/[orgId]/content
```

**Query Parameters:**

- `campaignId` (optional): Filter by campaign ID
- `status` (optional): Filter by content status

**Example:**

```http
GET /api/org_123/content?status=DRAFT&campaignId=camp_1
```

**Response:**

```json
{
   "ok": true,
   "data": [
      {
         "id": "content_456",
         "title": "New Product Launch",
         "body": "Exciting new product announcement...",
         "status": "DRAFT",
         "campaignId": "camp_1",
         "campaign": {
            "id": "camp_1",
            "name": "Q1 Campaign"
         },
         "assets": [
            {
               "id": "asset_789",
               "url": "https://storage.example.com/image.jpg",
               "name": "Product Image",
               "type": "image/jpeg",
               "size": 1024000,
               "description": "Product showcase image",
               "tags": ["product", "launch", "marketing"]
            }
         ],
         "createdAt": "2025-01-10T10:00:00.000Z",
         "updatedAt": "2025-01-10T10:00:00.000Z"
      }
   ]
}
```

### ➕ Create Content

```http
POST /api/[orgId]/content
```

**Request Body:**

```typescript
interface CreateContentRequest {
   title: string; // Content title
   body?: string; // Content body (rich text)
   status?: ContentStatus; // Optional, defaults to DRAFT
   campaignId: string; // Campaign ID
}
```

**Example Request:**

```json
{
   "title": "Summer Sale Announcement",
   "body": "Get ready for amazing summer deals!",
   "campaignId": "camp_1"
}
```

**Response:**

```json
{
   "ok": true,
   "data": {
      "id": "content_456",
      "title": "Summer Sale Announcement",
      "body": "Get ready for amazing summer deals!",
      "status": "DRAFT",
      "campaignId": "camp_1",
      "campaign": {
         "id": "camp_1",
         "name": "Q1 Campaign"
      },
      "assets": [],
      "createdAt": "2025-01-10T10:00:00.000Z",
      "updatedAt": "2025-01-10T10:00:00.000Z"
   }
}
```

### 🤖 AI Content Generation

```http
POST /api/[orgId]/content/generate
```

**Request Body:**

```typescript
interface GenerateContentRequest {
   prompt: string; // AI generation prompt
   campaignId: string; // Campaign ID
   contentType?: string; // Optional content type
   tone?: string; // Optional tone (professional, casual, etc.)
}
```

**Example Request:**

```json
{
   "prompt": "Create a social media post about our new eco-friendly product line",
   "campaignId": "camp_1",
   "tone": "professional"
}
```

**Response:**

```json
{
   "ok": true,
   "data": {
      "id": "content_456",
      "title": "Eco-Friendly Product Launch",
      "body": "We're excited to announce our new eco-friendly product line...",
      "status": "DRAFT",
      "campaignId": "camp_1",
      "aiGenerated": true,
      "prompt": "Create a social media post about our new eco-friendly product line",
      "createdAt": "2025-01-10T10:00:00.000Z",
      "updatedAt": "2025-01-10T10:00:00.000Z"
   }
}
```

## Data Models

### 📝 Content Entity

```typescript
interface Content {
  id: string;                    // cuid
  title: string;                 // Content title
  body?: string;                 // Content body (rich text)
  status: ContentStatus;         // Current content status
  campaignId: string;            // Campaign reference
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update time
}

enum ContentStatus {
  DRAFT          // Initial draft state
  SUBMITTED      // Submitted for review
  APPROVED       // Approved by brand owner
  SCHEDULED      // Scheduled for publication
  PUBLISHED      // Successfully published
  REJECTED       // Rejected during review
}
```

### 🖼️ Asset Entity

```typescript
interface Asset {
   id: string; // cuid
   url: string; // File storage URL
   name?: string; // Display name
   type: string; // MIME type
   size?: number; // File size in bytes
   description?: string; // Asset description
   tags: string[]; // Searchable tags
   contentId: string; // Content reference
   createdAt: Date; // Upload timestamp
}
```

### 🔍 Query Parameters

```typescript
interface ListContentQuery {
   campaignId?: string; // Filter by campaign
   status?: ContentStatus; // Filter by status
}
```

## Authentication

### 🔐 Required Permissions

- **View Content**: `MANAGE_CONTENT` permission
- **Create Content**: `MANAGE_CONTENT` permission
- **Update Content**: `MANAGE_CONTENT` permission
- **Delete Content**: `MANAGE_CONTENT` permission
- **Approve Content**: `APPROVE_CONTENT` permission (Brand Owner, Admin)
- **Roles**: `CREATOR`, `BRAND_OWNER`, `ADMIN`

### 🛡️ Security Features

- **Organization Isolation**: Chỉ truy cập content của org
- **Campaign Validation**: Campaign phải thuộc về organization
- **Role-based Access**: Permissions được check trước mỗi operation

## Error Handling

### ❌ Error Response Format

```typescript
interface ErrorResponse {
   ok: false;
   error: {
      code: string; // Error code
      message: string; // Human-readable message
      details?: any; // Additional error details
   };
}
```

### 🚫 Error Codes

#### `E_UNAUTHORIZED` (401)

```json
{
   "ok": false,
   "error": {
      "code": "E_UNAUTHORIZED",
      "message": "Unauthorized"
   }
}
```

**Cause**: User chưa đăng nhập hoặc session expired
**Solution**: Re-authenticate user

#### `E_FORBIDDEN` (403)

```json
{
   "ok": false,
   "error": {
      "code": "E_FORBIDDEN",
      "message": "Forbidden"
   }
}
```

**Cause**: User không có permission `MANAGE_CONTENT`
**Solution**: Check user role và permissions

#### `E_NOT_FOUND` (404)

```json
{
   "ok": false,
   "error": {
      "code": "E_NOT_FOUND",
      "message": "Campaign not found"
   }
}
```

**Cause**: Campaign không tồn tại
**Solution**: Verify campaign ID

#### `E_VALIDATION` (400)

```json
{
   "ok": false,
   "error": {
      "code": "E_VALIDATION",
      "message": "Title is required"
   }
}
```

**Cause**: Invalid request data (missing required fields)
**Solution**: Validate request body

#### `E_INTERNAL` (500)

```json
{
   "ok": false,
   "error": {
      "code": "E_INTERNAL",
      "message": "Internal server error"
   }
}
```

**Cause**: Server error hoặc database issue
**Solution**: Contact support team

## Examples

### 📝 Create New Content

```bash
curl -X POST /api/org_123/content \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Product Launch Announcement",
    "body": "We are excited to announce our latest product...",
    "campaignId": "camp_1"
  }'
```

### 🔍 Get Draft Content

```bash
curl "/api/org_123/content?status=DRAFT&campaignId=camp_1"
```

### 🤖 Generate AI Content

```bash
curl -X POST /api/org_123/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a social media post about sustainability",
    "campaignId": "camp_1",
    "tone": "professional"
  }'
```

## Business Logic

### 📊 Content Status Workflow

1. **DRAFT**: Initial content creation
2. **SUBMITTED**: Creator submits for review
3. **APPROVED**: Brand owner approves content
4. **SCHEDULED**: Content scheduled for publication
5. **PUBLISHED**: Content successfully published
6. **REJECTED**: Content rejected during review

### 🔄 Status Transitions

- **DRAFT → SUBMITTED**: Creator action
- **SUBMITTED → APPROVED/REJECTED**: Brand owner action
- **APPROVED → SCHEDULED**: When schedule is created
- **SCHEDULED → PUBLISHED**: After successful publishing
- **Any → REJECTED**: Brand owner can reject at any stage

### 🎯 AI Content Generation

- **Input**: Prompt, campaign context, tone preferences
- **Process**: AI service generates content based on prompt
- **Output**: Generated content với status DRAFT
- **Editing**: Creator can edit và refine AI-generated content

### 📁 Asset Management

- **Upload**: File upload với type/size validation
- **Linking**: Assets được link với content
- **Metadata**: Tags, descriptions cho searchability
- **Storage**: Secure file storage với access control

---

_Last Updated: 2025-01-02_
_Version: 2.0_
_Maintainer: Engineering Team_
