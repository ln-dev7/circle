# Campaigns API

## 📋 Table of Contents

- [Overview](#overview)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Permissions](#permissions)
- [Request/Response Formats](#requestresponse-formats)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Overview

Campaigns API cho phép quản lý marketing campaigns trong một organization. Mỗi campaign có thể chứa nhiều content items và schedules.

### Base URL

```
/api/[orgId]/campaigns
```

### Supported Operations

- `GET` - List campaigns
- `POST` - Create new campaign
- `GET /[id]` - Get campaign details
- `PUT /[id]` - Update campaign
- `DELETE /[id]` - Delete campaign

## Endpoints

### 📋 List Campaigns

```http
GET /api/[orgId]/campaigns
```

**Description**: Lấy danh sách campaigns của organization

**Query Parameters**:

- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 20
- `search` (optional): Search campaigns by name/description
- `status` (optional): Filter by status (planned)

**Response**: Array of campaigns với content và schedule counts

**Permissions**: `MANAGE_CONTENT` (Creator, Brand Owner, Admin)

### ➕ Create Campaign

```http
POST /api/[orgId]/campaigns
```

**Description**: Tạo campaign mới

**Request Body**: Campaign data theo schema validation

**Response**: Created campaign object

**Permissions**: `MANAGE_CAMPAIGNS` (Brand Owner, Admin)

### 👁️ Get Campaign Details

```http
GET /api/[orgId]/campaigns/[id]
```

**Description**: Lấy thông tin chi tiết campaign

**Response**: Campaign object với related content và schedules

**Permissions**: `MANAGE_CONTENT` (Creator, Brand Owner, Admin)

### ✏️ Update Campaign

```http
PUT /api/[orgId]/campaigns/[id]
```

**Description**: Cập nhật thông tin campaign

**Request Body**: Updated campaign data

**Response**: Updated campaign object

**Permissions**: `MANAGE_CAMPAIGNS` (Brand Owner, Admin)

### 🗑️ Delete Campaign

```http
DELETE /api/[orgId]/campaigns/[id]
```

**Description**: Xóa campaign và tất cả related content

**Response**: Success confirmation

**Permissions**: `MANAGE_CAMPAIGNS` (Brand Owner, Admin)

## Authentication

Tất cả endpoints yêu cầu authentication thông qua NextAuth session.

```typescript
// Session check
const session = await auth();
if (!session?.user?.id) {
   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## Permissions

### Role-based Access Control

```typescript
// Campaign permissions
const PERMISSIONS = {
   MANAGE_CONTENT: ['creator', 'brand_owner', 'admin'],
   MANAGE_CAMPAIGNS: ['brand_owner', 'admin'],
};
```

### Permission Matrix

| Role        | View Campaigns | Create Campaigns | Edit Campaigns | Delete Campaigns |
| ----------- | -------------- | ---------------- | -------------- | ---------------- |
| Creator     | ✅             | ❌               | ❌             | ❌               |
| Brand Owner | ✅             | ✅               | ✅             | ✅               |
| Admin       | ✅             | ✅               | ✅             | ✅               |

## Request/Response Formats

### Campaign Schema

```typescript
interface Campaign {
   id: string;
   name: string;
   description?: string;
   organizationId: string;
   createdAt: DateTime;
   updatedAt: DateTime;

   // Relations (when included)
   contents?: Content[];
   schedules?: Schedule[];
   analyticsEvents?: AnalyticsEvent[];
}
```

### Create Campaign Request

```typescript
interface CreateCampaignRequest {
   name: string;
   description?: string;
}
```

### API Response Format

```typescript
interface ApiResponse<T> {
   // Success case
   data?: T;

   // Error case
   error?: string;
   message?: string;
}
```

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (no session)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format

```json
{
   "error": "Error message",
   "message": "Detailed error description"
}
```

### Common Error Scenarios

- **E_VALIDATION**: Invalid request data
- **E_FORBIDDEN**: Insufficient permissions
- **E_NOT_FOUND**: Campaign doesn't exist
- **E_ORG_ACCESS**: User not member of organization

## Examples

### Create Campaign

```bash
curl -X POST /api/org123/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Sale 2025",
    "description": "Promotional campaign for summer products"
  }'
```

**Response**:

```json
{
   "id": "camp_abc123",
   "name": "Summer Sale 2025",
   "description": "Promotional campaign for summer products",
   "organizationId": "org123",
   "createdAt": "2025-01-02T10:00:00Z",
   "updatedAt": "2025-01-02T10:00:00Z"
}
```

### List Campaigns

```bash
curl /api/org123/campaigns?page=1&limit=10
```

**Response**:

```json
[
   {
      "id": "camp_abc123",
      "name": "Summer Sale 2025",
      "description": "Promotional campaign for summer products",
      "organizationId": "org123",
      "createdAt": "2025-01-02T10:00:00Z",
      "updatedAt": "2025-01-02T10:00:00Z",
      "contents": [
         {
            "id": "cont_xyz789",
            "title": "Summer Sale Announcement",
            "body": "Get ready for amazing summer deals!",
            "campaignId": "camp_abc123"
         }
      ],
      "schedules": [
         {
            "id": "sched_def456",
            "date": "2025-06-01T09:00:00Z",
            "status": "scheduled",
            "campaignId": "camp_abc123"
         }
      ]
   }
]
```

## Best Practices

### 🔒 Security

- Luôn check organization membership trước khi access
- Validate input data với Zod schemas
- Log tất cả campaign operations cho audit

### 📊 Performance

- Sử dụng pagination cho large datasets
- Include relations chỉ khi cần thiết
- Cache campaign data cho frequently accessed campaigns

### 🧪 Testing

- Test với different user roles
- Verify permission checks
- Test edge cases (empty campaigns, invalid IDs)

## Gotchas

### ⚠️ Common Issues

1. **Organization Access**: User phải là member của organization
2. **Permission Levels**: Different roles có different access levels
3. **Cascade Deletes**: Deleting campaign removes all related content
4. **Validation**: Name field required, description optional

### 💡 Tips

- Sử dụng `requirePermission` helper cho consistent permission checking
- Include error handling cho database operations
- Log user actions cho analytics và debugging

---

_Last Updated: 2025-01-02_
_Version: 1.0_
_Maintainer: Engineering Team_
