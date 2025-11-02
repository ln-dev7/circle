# Schedules API

## 📋 Table of Contents

- [Overview](#overview)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Overview

Schedules API quản lý việc lên lịch xuất bản content trên các nền tảng social media. API hỗ trợ tạo, xem, và quản lý schedules với timezone support và conflict detection.

### Key Features

- **Multi-view Support**: Day, Week, Month calendar views
- **Timezone Handling**: `runAt` lưu UTC, `timezone` cho display
- **Conflict Detection**: Cảnh báo overlap cùng channel
- **Status Management**: Content status tự động → SCHEDULED
- **Filtering**: Theo channels, campaigns, date ranges

## Endpoints

### 📅 List Schedules

```http
GET /api/[orgId]/schedules
```

**Query Parameters:**

- `from` (required): Start date (ISO 8601)
- `to` (required): End date (ISO 8601)
- `channels` (optional): Comma-separated channel list
- `campaigns` (optional): Comma-separated campaign IDs

**Example:**

```http
GET /api/org_123/schedules?from=2025-01-01T00:00:00Z&to=2025-01-31T23:59:59Z&channels=FACEBOOK,INSTAGRAM&campaigns=camp_1,camp_2
```

**Response:**

```json
{
   "ok": true,
   "data": [
      {
         "id": "sched_123",
         "runAt": "2025-01-15T09:00:00.000Z",
         "timezone": "America/New_York",
         "channel": "FACEBOOK",
         "status": "PENDING",
         "campaignId": "camp_1",
         "contentId": "content_456",
         "campaign": {
            "id": "camp_1",
            "name": "Q1 Campaign"
         },
         "content": {
            "id": "content_456",
            "title": "New Product Launch",
            "status": "SCHEDULED"
         },
         "createdAt": "2025-01-10T10:00:00.000Z",
         "updatedAt": "2025-01-10T10:00:00.000Z"
      }
   ]
}
```

### ➕ Create Schedule

```http
POST /api/[orgId]/schedules
```

**Request Body:**

```typescript
interface CreateScheduleRequest {
   runAt: string; // ISO 8601 datetime (UTC)
   timezone: string; // Timezone identifier
   channel: Channel; // Social media platform
   status?: ScheduleStatus; // Optional, defaults to PENDING
   campaignId: string; // Campaign ID
   contentId: string; // Content ID to schedule
}
```

**Example Request:**

```json
{
   "runAt": "2025-01-15T14:00:00.000Z",
   "timezone": "America/New_York",
   "channel": "FACEBOOK",
   "campaignId": "camp_1",
   "contentId": "content_456"
}
```

**Response:**

```json
{
   "ok": true,
   "data": {
      "id": "sched_123",
      "runAt": "2025-01-15T14:00:00.000Z",
      "timezone": "America/New_York",
      "channel": "FACEBOOK",
      "status": "PENDING",
      "campaignId": "camp_1",
      "contentId": "content_456",
      "campaign": {
         "id": "camp_1",
         "name": "Q1 Campaign"
      },
      "content": {
         "id": "content_456",
         "title": "New Product Launch",
         "status": "SCHEDULED"
      },
      "createdAt": "2025-01-10T10:00:00.000Z",
      "updatedAt": "2025-01-10T10:00:00.000Z"
   }
}
```

## Data Models

### 📊 Schedule Entity

```typescript
interface Schedule {
  id: string;                    // cuid
  runAt: Date;                   // UTC timestamp
  timezone: string;              // Display timezone
  channel: Channel;              // Social platform
  status: ScheduleStatus;        // Current status
  campaignId: string;            // Campaign reference
  contentId?: string;            // Content reference
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update time
}

enum Channel {
  FACEBOOK       // 📘 Facebook posts
  INSTAGRAM      // 📷 Instagram posts
  TWITTER        // 🐦 Twitter/X posts
  YOUTUBE        // 📺 YouTube videos
  LINKEDIN       // 💼 LinkedIn posts
  TIKTOK         // 🎵 TikTok videos
  BLOG           // 📝 Blog articles
}

enum ScheduleStatus {
  PENDING        // Scheduled, waiting to publish
  PUBLISHED      // Successfully published
  FAILED         // Publication failed
  CANCELLED      // Schedule cancelled
}
```

### 🔍 Query Parameters

```typescript
interface ListSchedulesQuery {
   from: string; // ISO 8601 start date
   to: string; // ISO 8601 end date
   channels?: string[]; // Filter by channels
   campaigns?: string[]; // Filter by campaign IDs
}
```

## Authentication

### 🔐 Required Permissions

- **View Schedules**: `MANAGE_SCHEDULES` permission
- **Create Schedules**: `MANAGE_SCHEDULES` permission
- **Roles**: `BRAND_OWNER`, `CREATOR`, `ADMIN`

### 🛡️ Security Features

- **Organization Isolation**: Chỉ truy cập schedules của org
- **Campaign Validation**: Campaign phải thuộc về organization
- **Content Validation**: Content phải thuộc về campaign
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

**Cause**: User không có permission `MANAGE_SCHEDULES`
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

**Cause**: Campaign hoặc Content không tồn tại
**Solution**: Verify campaign/content IDs

#### `E_VALIDATION` (400)

```json
{
   "ok": false,
   "error": {
      "code": "E_VALIDATION",
      "message": "Invalid date format"
   }
}
```

**Cause**: Invalid request data (date format, required fields)
**Solution**: Validate request body

#### `E_CONFLICT_SLOT` (409)

```json
{
   "ok": false,
   "error": {
      "code": "E_CONFLICT_SLOT",
      "message": "Potential scheduling conflict detected",
      "details": {
         "conflictingScheduleId": "sched_789"
      }
   }
}
```

**Cause**: Có schedule khác cùng channel trong khoảng thời gian gần
**Solution**: Chọn thời gian khác hoặc channel khác

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

### 📱 Schedule Facebook Post

```bash
curl -X POST /api/org_123/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "runAt": "2025-01-15T14:00:00.000Z",
    "timezone": "America/New_York",
    "channel": "FACEBOOK",
    "campaignId": "camp_1",
    "contentId": "content_456"
  }'
```

### 📅 Get Week Schedules

```bash
curl "/api/org_123/schedules?from=2025-01-13T00:00:00Z&to=2025-01-19T23:59:59Z&channels=FACEBOOK,INSTAGRAM"
```

### 🔍 Filter by Campaign

```bash
curl "/api/org_123/schedules?from=2025-01-01T00:00:00Z&to=2025-01-31T23:59:59Z&campaigns=camp_1,camp_2"
```

## Business Logic

### 🎯 Schedule Creation Flow

1. **Validation**: Check permissions, validate request data
2. **Conflict Detection**: Look for overlapping schedules (same channel, ±15 minutes)
3. **Transaction**: Create schedule + update content status
4. **Response**: Return created schedule với relationships

### 📊 Content Status Update

- **Before**: Content status = `DRAFT` hoặc `APPROVED`
- **After**: Content status = `SCHEDULED`
- **Trigger**: Khi tạo schedule thành công

### ⚠️ Conflict Detection Rules

- **Same Channel**: Không cho phép 2 schedules cùng channel trong ±15 phút
- **Time Window**: ±15 minutes để tránh spam
- **Status Check**: Chỉ check `PENDING` và `PUBLISHED` schedules

### 🌐 Timezone Handling

- **Storage**: `runAt` luôn lưu UTC timestamp
- **Display**: `timezone` field để hiển thị local time
- **Conversion**: Client-side conversion cho UI display

---

_Last Updated: 2025-01-02_
_Version: 2.0_
_Maintainer: Engineering Team_
