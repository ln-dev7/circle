# Analytics API

## 📋 Table of Contents

- [Overview](#overview)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Permissions](#permissions)
- [Event Tracking](#event-tracking)
- [Metrics & Aggregation](#metrics--aggregation)
- [Request/Response Formats](#requestresponse-formats)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Overview

Analytics API cho phép thu thập và truy vấn dữ liệu analytics cho campaigns, content, và user behavior. Hệ thống track events real-time và cung cấp aggregated metrics.

### Base URL

```
/api/[orgId]/analytics
```

### Supported Operations

- `POST /events` - Record analytics events
- `GET /events` - Query events với filters
- `GET /metrics` - Get aggregated metrics
- `GET /summary` - Get summary dashboard data
- `GET /export` - Export analytics data (CSV/JSON)

### Analytics Categories

- **Content Performance**: Views, clicks, engagement
- **Campaign Metrics**: Reach, conversion, ROI
- **User Behavior**: Login, actions, preferences
- **AI Usage**: Generation requests, costs, quality
- **System Health**: API performance, errors

## Endpoints

### 📊 Record Event

```http
POST /api/[orgId]/analytics/events
```

**Description**: Record analytics event

**Request Body**: Event data với validation

**Response**: Created event object

**Permissions**: `VIEW_ANALYTICS` (Creator, Brand Owner, Admin)

### 📋 Query Events

```http
GET /api/[orgId]/analytics/events
```

**Description**: Query analytics events với filters

**Query Parameters**:

- `eventType` (optional): Filter by event type
- `contentId` (optional): Filter by content
- `campaignId` (optional): Filter by campaign
- `userId` (optional): Filter by user
- `dateFrom` (optional): Filter from date (ISO string)
- `dateTo` (optional): Filter to date (ISO string)
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 100

**Response**: Array of events với pagination

**Permissions**: `VIEW_ANALYTICS` (Creator, Brand Owner, Admin)

### 📈 Get Metrics

```http
GET /api/[orgId]/analytics/metrics
```

**Description**: Get aggregated metrics cho organization

**Query Parameters**:

- `type` (required): Metric type (campaign, content, user, ai)
- `campaignId` (optional): Filter by campaign
- `contentId` (optional): Filter by content
- `period` (optional): Time period (day, week, month, year)
- `dateFrom` (optional): Custom date range start
- `dateTo` (optional): Custom date range end

**Response**: Aggregated metrics data

**Permissions**: `VIEW_ANALYTICS` (Creator, Brand Owner, Admin)

### 📊 Get Summary

```http
GET /api/[orgId]/analytics/summary
```

**Description**: Get summary dashboard data

**Query Parameters**:

- `period` (optional): Time period (7d, 30d, 90d)

**Response**: Summary metrics cho dashboard

**Permissions**: `VIEW_ANALYTICS` (Creator, Brand Owner, Admin)

### 📥 Export Data

```http
GET /api/[orgId]/analytics/export
```

**Description**: Export analytics data

**Query Parameters**:

- `format` (optional): Export format (csv, json), default: csv
- `eventType` (optional): Filter by event type
- `dateFrom` (optional): Filter from date
- `dateTo` (optional): Filter to date

**Response**: File download (CSV/JSON)

**Permissions**: `VIEW_ANALYTICS` (Brand Owner, Admin)

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
   VIEW_ANALYTICS: ['creator', 'brand_owner', 'admin'],
};
```

### Permission Matrix

| Action                      | Creator | Brand Owner | Admin |
| --------------------------- | ------- | ----------- | ----- |
| View Own Content Analytics  | ✅      | ✅          | ✅    |
| View Campaign Analytics     | ✅      | ✅          | ✅    |
| View Organization Analytics | ❌      | ✅          | ✅    |
| Export Analytics Data       | ❌      | ✅          | ✅    |

## Event Tracking

### 🎯 Event Types

#### Content Events

```typescript
// Content performance tracking
'content.view'; // Content được xem
'content.click'; // Link được click
'content.like'; // Content được like
'content.share'; // Content được share
'content.comment'; // Comment được tạo
'content.bookmark'; // Content được bookmark
```

#### Campaign Events

```typescript
// Campaign engagement
'campaign.view'; // Campaign page được xem
'campaign.click'; // Campaign CTA được click
'campaign.convert'; // Campaign conversion
'campaign.impression'; // Campaign impression
```

#### User Events

```typescript
// User behavior tracking
'user.login'; // User login
'user.logout'; // User logout
'user.action'; // Generic user action
'user.preference'; // User preference change
```

#### AI Events

```typescript
// AI usage tracking
'ai.generate'; // AI content generation
'ai.translate'; // AI translation
'ai.summarize'; // AI summarization
'ai.quality_score'; // AI quality feedback
```

#### System Events

```typescript
// System health monitoring
'system.error'; // System error occurred
'system.performance'; // Performance metric
'system.health'; // Health check result
```

### 📊 Event Schema

```typescript
interface AnalyticsEvent {
   id: string;
   event: string;
   data?: Json;
   userId?: string;
   organizationId?: string;
   campaignId?: string;
   contentId?: string;
   platform?: string;
   userAgent?: string;
   ipAddress?: string;
   timestamp: DateTime;
   createdAt: DateTime;

   // Relations
   user?: User;
   organization?: Organization;
   campaign?: Campaign;
   content?: Content;
}
```

### 🔍 Event Data Examples

#### Content View Event

```json
{
   "event": "content.view",
   "contentId": "cont_xyz789",
   "campaignId": "camp_abc123",
   "data": {
      "viewDuration": 45,
      "scrollDepth": 0.8,
      "referrer": "facebook.com",
      "device": "mobile"
   },
   "platform": "web",
   "userAgent": "Mozilla/5.0...",
   "timestamp": "2025-01-02T10:00:00Z"
}
```

#### AI Generation Event

```json
{
   "event": "ai.generate",
   "contentId": "cont_xyz789",
   "campaignId": "camp_abc123",
   "data": {
      "model": "gpt-4",
      "tokensUsed": 150,
      "cost": 0.003,
      "prompt": "Create a social media post about summer sale",
      "quality_score": 8.5,
      "generation_time": 2.3
   },
   "timestamp": "2025-01-02T10:00:00Z"
}
```

## Metrics & Aggregation

### 📈 Metric Types

#### Content Metrics

```typescript
interface ContentMetrics {
   totalViews: number;
   uniqueViews: number;
   averageViewDuration: number;
   clickThroughRate: number;
   engagementRate: number;
   topPerformingContent: Array<{
      contentId: string;
      title: string;
      views: number;
      engagement: number;
   }>;
}
```

#### Campaign Metrics

```typescript
interface CampaignMetrics {
   totalReach: number;
   totalEngagement: number;
   conversionRate: number;
   costPerClick: number;
   returnOnInvestment: number;
   platformBreakdown: {
      facebook: number;
      instagram: number;
      linkedin: number;
      twitter: number;
   };
}
```

#### AI Usage Metrics

```typescript
interface AIUsageMetrics {
   totalGenerations: number;
   totalTokens: number;
   totalCost: number;
   averageQualityScore: number;
   popularPrompts: Array<{
      prompt: string;
      usageCount: number;
      averageQuality: number;
   }>;
}
```

### 🔢 Aggregation Periods

- **Real-time**: Current session data
- **Hourly**: Last 24 hours by hour
- **Daily**: Last 30 days by day
- **Weekly**: Last 12 weeks by week
- **Monthly**: Last 12 months by month
- **Custom**: User-defined date range

## Request/Response Formats

### Record Event Request

```typescript
interface RecordEventRequest {
   event: string;
   data?: Json;
   campaignId?: string;
   contentId?: string;
   platform?: string;
   userAgent?: string;
   timestamp?: string; // ISO string, defaults to now
}
```

### Query Events Response

```typescript
interface EventsResponse {
   events: AnalyticsEvent[];
   pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
   };
   summary: {
      totalEvents: number;
      uniqueUsers: number;
      dateRange: {
         from: string;
         to: string;
      };
   };
}
```

### Metrics Response

```typescript
interface MetricsResponse {
   type: string;
   period: string;
   dateRange: {
      from: string;
      to: string;
   };
   metrics: Json;
   trends: {
      previous: Json;
      change: number;
      changePercent: number;
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
- `422` - Unprocessable Entity (invalid event data)
- `500` - Internal Server Error

### Error Response Format

```json
{
   "error": "E_INVALID_EVENT_TYPE",
   "message": "Invalid event type: unknown_event",
   "details": {
      "eventType": "unknown_event",
      "allowedTypes": ["content.view", "content.click", "ai.generate"]
   }
}
```

### Common Error Scenarios

- **E_INVALID_EVENT_TYPE**: Event type không được support
- **E_MISSING_REQUIRED_FIELDS**: Thiếu required fields
- **E_INVALID_DATE_RANGE**: Date range không hợp lệ
- **E_EXPORT_FAILED**: Export operation failed
- **E_RATE_LIMIT**: Too many events trong short time

## Examples

### Record Content View Event

```bash
curl -X POST /api/org123/analytics/events \
  -H "Content-Type: application/json" \
  -d '{
    "event": "content.view",
    "contentId": "cont_xyz789",
    "campaignId": "camp_abc123",
    "data": {
      "viewDuration": 45,
      "scrollDepth": 0.8,
      "referrer": "facebook.com"
    },
    "platform": "web"
  }'
```

**Response**:

```json
{
   "id": "event_abc123",
   "event": "content.view",
   "contentId": "cont_xyz789",
   "campaignId": "camp_abc123",
   "data": {
      "viewDuration": 45,
      "scrollDepth": 0.8,
      "referrer": "facebook.com"
   },
   "platform": "web",
   "timestamp": "2025-01-02T10:00:00Z",
   "createdAt": "2025-01-02T10:00:00Z"
}
```

### Get Campaign Metrics

```bash
curl "/api/org123/analytics/metrics?type=campaign&campaignId=camp_abc123&period=30d"
```

**Response**:

```json
{
   "type": "campaign",
   "period": "30d",
   "dateRange": {
      "from": "2024-12-03T00:00:00Z",
      "to": "2025-01-02T23:59:59Z"
   },
   "metrics": {
      "totalReach": 15420,
      "totalEngagement": 1234,
      "conversionRate": 0.08,
      "costPerClick": 0.45,
      "returnOnInvestment": 2.2
   },
   "trends": {
      "previous": {
         "totalReach": 12850,
         "totalEngagement": 987
      },
      "change": 2570,
      "changePercent": 20.0
   }
}
```

### Query Events

```bash
curl "/api/org123/analytics/events?eventType=content.view&contentId=cont_xyz789&dateFrom=2025-01-01&limit=20"
```

**Response**:

```json
{
   "events": [
      {
         "id": "event_abc123",
         "event": "content.view",
         "contentId": "cont_xyz789",
         "campaignId": "camp_abc123",
         "data": {
            "viewDuration": 45,
            "scrollDepth": 0.8
         },
         "timestamp": "2025-01-02T10:00:00Z"
      }
   ],
   "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
   },
   "summary": {
      "totalEvents": 1,
      "uniqueUsers": 1,
      "dateRange": {
         "from": "2025-01-01T00:00:00Z",
         "to": "2025-01-02T23:59:59Z"
      }
   }
}
```

## Best Practices

### 🔒 Security

- Sanitize user input trong event data
- Implement rate limiting cho event recording
- Log suspicious event patterns
- Validate event types và data schemas

### 📊 Performance

- Use batch processing cho high-volume events
- Implement event buffering cho real-time tracking
- Cache frequently accessed metrics
- Use database indexing cho common queries

### 🧪 Testing

- Test event recording với different data types
- Verify metrics aggregation accuracy
- Test export functionality với large datasets
- Monitor event processing performance

## Gotchas

### ⚠️ Common Issues

1. **Event Volume**: High event volume có thể affect performance
2. **Data Consistency**: Event data có thể change over time
3. **Timezone Handling**: Always store timestamps in UTC
4. **Storage Costs**: Analytics data có thể grow quickly

### 💡 Tips

- Implement event sampling cho high-volume scenarios
- Use materialized views cho complex aggregations
- Monitor analytics processing performance
- Implement data retention policies

### 🔧 Configuration

```typescript
// Analytics configuration
const analyticsConfig = {
   maxEventsPerMinute: 1000,
   batchSize: 100,
   retentionDays: 365,
   enableRealTime: true,
   samplingRate: 1.0, // 100% of events
};
```

---

_Last Updated: 2025-01-02_
_Version: 1.0_
_Maintainer: Engineering Team_
