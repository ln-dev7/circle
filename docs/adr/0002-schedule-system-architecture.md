# ADR-0002: Schedule System Architecture

## Status

Proposed

## Context

AiM Platform cần một hệ thống scheduling và calendar để quản lý việc publish content theo lịch trình. Hệ thống này phải hỗ trợ timezone, recurring schedules, và integration với content approval workflow.

## Decision

Implement comprehensive scheduling system với:

- **Calendar View**: react-day-picker với month/week/day views
- **Schedule Management**: Form-based creation với validation
- **Recurring Schedules**: RRULE model cho complex patterns
- **Timezone Support**: UTC storage, user preference display
- **Integration**: Content approval workflow, notifications

## Consequences

### Positive

- **User Experience**: Intuitive calendar interface
- **Flexibility**: Support multiple schedule types
- **Scalability**: Efficient database queries với indexes
- **Internationalization**: Timezone handling cho global users

### Negative

- **Complexity**: RRULE parsing và timezone calculations
- **Performance**: Calendar rendering với large datasets
- **Storage**: Additional database tables và relationships
- **Testing**: Complex timezone và date logic testing

## Implementation Details

### Database Schema

```prisma
model Schedule {
  id          String   @id @default(cuid())
  title       String
  description String?
  platform    String   // Facebook, Instagram, etc.
  scheduledAt DateTime // UTC timestamp
  timezone    String   // User's timezone preference
  rrule       String?  // RRULE for recurring schedules
  status      ScheduleStatus
  contentId   String?
  content     Content? @relation(fields: [contentId], references: [id])
  campaignId  String?
  campaign    Campaign? @relation(fields: [campaignId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum ScheduleStatus {
  DRAFT
  SCHEDULED
  PUBLISHED
  FAILED
  CANCELLED
}
```

### Key Components

- **Calendar View**: `components/schedules/calendar-view.tsx`
- **Schedule Form**: `components/schedules/schedule-form.tsx`
- **Schedule Service**: `lib/schedule-service.ts`
- **RRULE Parser**: `lib/rrule-parser.ts`
- **Timezone Utils**: `lib/timezone-utils.ts`

### Dependencies

- `react-day-picker`: Calendar component
- `date-fns`: Date manipulation utilities
- `rrule`: RRULE parsing và generation

## Migration Strategy

1. **Phase 1**: Database schema changes
2. **Phase 2**: Core scheduling functionality
3. **Phase 3**: Calendar UI implementation
4. **Phase 4**: Integration với content workflow

## Rollback Plan

- Database migration có thể revert với `pnpm prisma migrate reset`
- Code changes có thể rollback với git
- Dependencies có thể remove và reinstall

## Success Metrics

- Calendar render time < 500ms
- Schedule creation < 2 seconds
- Timezone handling accuracy 100%
- Recurring schedule reliability 99.9%

---

_Created: 2025-01-02_
_Author: Engineering Team_
_Reviewers: Architecture Team_
