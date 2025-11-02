# Assets API

## 📋 Table of Contents

- [Overview](#overview)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Permissions](#permissions)
- [File Management](#file-management)
- [Security](#security)
- [Request/Response Formats](#requestresponse-formats)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Overview

Assets API cho phép quản lý file uploads (images, videos, documents) và liên kết chúng với content. Hệ thống sử dụng UploadThing/S3 cho file storage với metadata tracking.

### Base URL

```
/api/[orgId]/assets
```

### Supported Operations

- `GET` - List assets
- `POST` - Upload new asset
- `GET /[id]` - Get asset details
- `DELETE /[id]` - Delete asset
- `POST /upload` - File upload endpoint

### File Types Supported

- **Images**: JPG, PNG, GIF, WebP, SVG
- **Videos**: MP4, MOV, AVI, WebM
- **Documents**: PDF, DOC, DOCX, TXT
- **Other**: ZIP, RAR (with size limits)

## Endpoints

### 📋 List Assets

```http
GET /api/[orgId]/assets
```

**Description**: Lấy danh sách assets của organization

**Query Parameters**:

- `contentId` (optional): Filter by linked content
- `type` (optional): Filter by file type
- `tags` (optional): Filter by tags (comma-separated)
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 20
- `search` (optional): Search by name/description

**Response**: Array of assets với metadata

**Permissions**: `MANAGE_CONTENT` (Creator, Brand Owner, Admin)

### ➕ Upload Asset

```http
POST /api/[orgId]/assets/upload
```

**Description**: Upload file mới và tạo asset record

**Request Body**: Multipart form data với file và metadata

**Response**: Created asset object với upload URL

**Permissions**: `MANAGE_CONTENT` (Creator, Brand Owner, Admin)

### 👁️ Get Asset Details

```http
GET /api/[orgId]/assets/[id]
```

**Description**: Lấy thông tin chi tiết asset

**Response**: Asset object với usage information

**Permissions**: `MANAGE_CONTENT` (Creator, Brand Owner, Admin)

### 🗑️ Delete Asset

```http
DELETE /api/[orgId]/assets/[id]
```

**Description**: Xóa asset (chỉ khi không được sử dụng)

**Response**: Success confirmation

**Permissions**: `MANAGE_CONTENT` (Creator, Brand Owner, Admin)

### 🔗 Link Asset to Content

```http
POST /api/[orgId]/assets/[id]/link
```

**Description**: Link asset với content item

**Request Body**: Content ID để link

**Response**: Updated asset với content link

**Permissions**: `MANAGE_CONTENT` (Creator, Brand Owner, Admin)

## Authentication

Tất cả endpoints yêu cầu authentication thông qua NextAuth session.

```typescript
const session = await auth();
if (!session?.user?.id) {
   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## Permissions

### Role-based Access Control

```typescript
const PERMISSIONS = {
   MANAGE_CONTENT: ['creator', 'brand_owner', 'admin'],
};
```

### Permission Matrix

| Action        | Creator | Brand Owner | Admin |
| ------------- | ------- | ----------- | ----- |
| Upload Assets | ✅      | ✅          | ✅    |
| View Assets   | ✅      | ✅          | ✅    |
| Delete Assets | ✅      | ✅          | ✅    |
| Link Assets   | ✅      | ✅          | ✅    |

## File Management

### 📁 Upload Process

1. **File Validation**: Check type, size, and security
2. **Processing**: Generate thumbnails, extract metadata
3. **Storage**: Upload to UploadThing/S3
4. **Database**: Create asset record với metadata
5. **Response**: Return asset object với access URLs

### 🔍 File Processing

- **Images**: Auto-generate thumbnails, optimize formats
- **Videos**: Extract duration, generate preview frames
- **Documents**: Extract text content, generate previews
- **Metadata**: File size, dimensions, creation date

### 🏷️ Tagging System

```typescript
interface Asset {
   tags: string[]; // Searchable tags
   metadata: Json; // Extended metadata
}
```

**Common Tags**: campaign name, content type, platform, season

## Security

### 🛡️ File Validation

```typescript
// Allowed file types
const ALLOWED_TYPES = {
   images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
   videos: ['video/mp4', 'video/mov', 'video/avi'],
   documents: ['application/pdf', 'text/plain'],
};

// File size limits
const SIZE_LIMITS = {
   images: 10 * 1024 * 1024, // 10MB
   videos: 100 * 1024 * 1024, // 100MB
   documents: 25 * 1024 * 1024, // 25MB
};
```

### 🔒 Access Control

- **Organization Isolation**: Assets chỉ accessible bởi org members
- **Content Linking**: Assets linked với content có additional access control
- **Public URLs**: Signed URLs với expiration cho secure access

### 🚫 Security Measures

- **Virus Scanning**: Scan uploaded files (planned)
- **File Type Validation**: Strict MIME type checking
- **Size Limits**: Prevent abuse và storage costs
- **Rate Limiting**: Limit upload frequency per user

## Request/Response Formats

### Asset Schema

```typescript
interface Asset {
   id: string;
   url: string;
   name?: string;
   type: string;
   size: number;
   description?: string;
   tags: string[];
   contentId: string;
   uploadedById: string;
   createdAt: DateTime;
   updatedAt: DateTime;

   // Relations
   content?: Content;
   uploadedBy?: User;

   // Generated fields
   thumbnail?: string;
   metadata?: Json;
   dimensions?: {
      width?: number;
      height?: number;
      duration?: number;
   };
}
```

### Upload Request

```typescript
interface UploadRequest {
   file: File;
   name?: string;
   description?: string;
   tags?: string[];
   contentId?: string;
   metadata?: Json;
}
```

### Asset Response

```typescript
interface AssetResponse {
   id: string;
   name: string;
   url: string;
   thumbnail?: string;
   type: string;
   size: number;
   tags: string[];
   createdAt: DateTime;
   usage: {
      linkedContent: number;
      totalViews: number;
   };
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
- `413` - Payload Too Large
- `415` - Unsupported Media Type
- `500` - Internal Server Error

### Error Response Format

```json
{
   "error": "E_FILE_TOO_LARGE",
   "message": "File size exceeds maximum limit of 10MB",
   "details": {
      "fileSize": 15728640,
      "maxSize": 10485760,
      "fileType": "image/jpeg"
   }
}
```

### Common Error Scenarios

- **E_FILE_TOO_LARGE**: File exceeds size limit
- **E_INVALID_TYPE**: Unsupported file type
- **E_UPLOAD_FAILED**: File upload failed
- **E_ASSET_IN_USE**: Cannot delete asset that is linked to content
- **E_STORAGE_QUOTA**: Organization storage quota exceeded

## Examples

### Upload Asset

```bash
curl -X POST /api/org123/assets/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@summer-sale-banner.jpg" \
  -F "name=Summer Sale Banner" \
  -F "description=Main banner for summer campaign" \
  -F "tags=summer,sale,banner" \
  -F "contentId=cont_xyz789"
```

**Response**:

```json
{
   "id": "asset_abc123",
   "name": "Summer Sale Banner",
   "url": "https://uploadthing.com/f/abc123",
   "thumbnail": "https://uploadthing.com/f/abc123-thumb",
   "type": "image/jpeg",
   "size": 2048576,
   "tags": ["summer", "sale", "banner"],
   "contentId": "cont_xyz789",
   "createdAt": "2025-01-02T10:00:00Z",
   "usage": {
      "linkedContent": 1,
      "totalViews": 0
   }
}
```

### List Assets

```bash
curl "/api/org123/assets?type=image&tags=summer&page=1&limit=10"
```

**Response**:

```json
[
   {
      "id": "asset_abc123",
      "name": "Summer Sale Banner",
      "url": "https://uploadthing.com/f/abc123",
      "thumbnail": "https://uploadthing.com/f/abc123-thumb",
      "type": "image/jpeg",
      "size": 2048576,
      "tags": ["summer", "sale", "banner"],
      "contentId": "cont_xyz789",
      "createdAt": "2025-01-02T10:00:00Z",
      "usage": {
         "linkedContent": 1,
         "totalViews": 15
      }
   }
]
```

## Best Practices

### 🔒 Security

- Validate file types với MIME type checking
- Implement file size limits per organization
- Use signed URLs với expiration cho secure access
- Log tất cả asset operations cho audit

### 📊 Performance

- Generate thumbnails cho images và videos
- Use CDN cho frequently accessed assets
- Implement lazy loading cho asset lists
- Cache asset metadata và usage statistics

### 🧪 Testing

- Test với different file types và sizes
- Verify file validation và error handling
- Test asset linking và unlinking
- Verify storage quota enforcement

## Gotchas

### ⚠️ Common Issues

1. **File Type Mismatch**: MIME type vs file extension validation
2. **Storage Costs**: Large files increase storage costs
3. **Asset Dependencies**: Deleting assets affects linked content
4. **Thumbnail Generation**: Some file types may fail thumbnail creation

### 💡 Tips

- Implement progressive upload cho large files
- Use WebP format cho images để giảm size
- Cache asset URLs để giảm API calls
- Monitor storage usage per organization

### 🔧 Configuration

```typescript
// UploadThing configuration
const uploadConfig = {
   maxFileSize: '10MB',
   allowedFileTypes: ['image', 'video', 'document'],
   generateThumbnails: true,
   optimizeImages: true,
};
```

---

_Last Updated: 2025-01-02_
_Version: 1.0_
_Maintainer: Engineering Team_
