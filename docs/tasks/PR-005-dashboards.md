# PR-005: Role-Based Dashboards

## 🎯 Goal

Implement role-specific dashboards cho Creator, Brand Owner, và Admin users với widgets và metrics.

## 📋 Acceptance Criteria

### Creator Dashboard

- [ ] Summary cards (active campaigns, drafts, scheduled, impressions)
- [ ] Campaign list với quick actions
- [ ] Draft reminders và deadlines
- [ ] AI suggestions widget
- [ ] Recent content performance

### Brand Owner Dashboard

- [ ] Brand metrics cards (budget/ROI, reach, engagement)
- [ ] Approval queue với content preview
- [ ] Budget vs ROI charts
- [ ] Creator leaderboard
- [ ] Campaign health summary

### Admin Dashboard

- [ ] User management table
- [ ] Organization settings
- [ ] System health monitoring
- [ ] Feature flags management
- [ ] Audit logs display

### Common Features

- [ ] Responsive design cho all devices
- [ ] Real-time data updates
- [ ] Export functionality
- [ ] Customizable widgets
- [ ] Performance optimization

## 📁 Files to Modify

### New Files

- `app/(dashboard)/creator/page.tsx` - Creator dashboard
- `app/(dashboard)/brand/page.tsx` - Brand Owner dashboard
- `app/(dashboard)/admin/page.tsx` - Admin dashboard
- `components/dashboards/creator-dashboard.tsx` - Creator dashboard component
- `components/dashboards/brand-dashboard.tsx` - Brand Owner dashboard component
- `components/dashboards/admin-dashboard.tsx` - Admin dashboard component
- `components/dashboards/widgets/summary-card.tsx` - Summary card widget
- `components/dashboards/widgets/metrics-chart.tsx` - Metrics chart widget
- `components/dashboards/widgets/approval-queue.tsx` - Approval queue widget
- `components/dashboards/widgets/user-table.tsx` - User management table
- `lib/dashboard-service.ts` - Dashboard data service
- `lib/metrics-calculator.ts` - Metrics calculation utilities

### Modified Files

- `components/layout/sidebar.tsx` - Add dashboard navigation
- `lib/rbac.ts` - Add dashboard access permissions
- `app/layout.tsx` - Add dashboard layout wrapper

## 🚀 Commands to Run

### Setup

```bash
# Install additional dependencies
pnpm add recharts @types/recharts
pnpm add -D @types/node

# Generate Prisma client (if schema changed)
pnpm prisma generate

# Run database migrations (if needed)
pnpm prisma migrate dev --name add_dashboards
```

### Development

```bash
# Start dev server
pnpm dev

# Check database
pnpm prisma studio

# Run type check
pnpm typecheck

# Run linting
pnpm lint
```

### Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run specific test files
pnpm test -- dashboards.test.tsx
pnpm test -- widgets.test.tsx
```

## 🧪 Test Steps

### Manual Testing

1. **Creator Dashboard**

   - [ ] Verify summary cards display correctly
   - [ ] Test campaign list functionality
   - [ ] Check draft reminders
   - [ ] Test AI suggestions widget

2. **Brand Owner Dashboard**

   - [ ] Verify metrics cards accuracy
   - [ ] Test approval queue
   - [ ] Check charts rendering
   - [ ] Test creator leaderboard

3. **Admin Dashboard**

   - [ ] Verify user table functionality
   - [ ] Test organization settings
   - [ ] Check system health display
   - [ ] Test feature flags

4. **Common Features**
   - [ ] Test responsive design
   - [ ] Verify real-time updates
   - [ ] Test export functionality
   - [ ] Check performance

### Automated Testing

```bash
# Run all tests
pnpm test

# Verify test coverage > 80%
pnpm test:coverage

# Check for TypeScript errors
pnpm typecheck

# Verify linting passes
pnpm lint
```

## 🔍 Code Review Checklist

### Security

- [ ] Role-based access control implemented
- [ ] Data filtering theo user permissions
- [ ] No sensitive data exposure
- [ ] Audit logging cho admin actions

### Code Quality

- [ ] TypeScript types properly defined
- [ ] Error handling implemented
- [ ] Code follows style guidelines
- [ ] No console.log statements
- [ ] Proper JSDoc documentation

### Performance

- [ ] Dashboard loads < 2 seconds
- [ ] Charts render smoothly
- [ ] Real-time updates efficient
- [ ] Data caching implemented
- [ ] Lazy loading cho widgets

## 🚨 Rollback Plan

### Code Rollback

```bash
# Revert to previous commit
git reset --hard HEAD~1

# Or checkout specific commit
git checkout <previous-commit-hash>
```

### Dependencies Rollback

```bash
# Remove added packages
pnpm remove recharts @types/recharts

# Reinstall previous package-lock
pnpm install --frozen-lockfile
```

## 📊 Success Metrics

### Technical Metrics

- [ ] All tests passing (100%)
- [ ] TypeScript compilation successful
- [ ] Linting passes without errors
- [ ] Dashboard load time < 2 seconds
- [ ] Chart render time < 500ms

### Functional Metrics

- [ ] Users see role-appropriate dashboards
- [ ] Data displays accurately
- [ ] Real-time updates work
- [ ] Export functionality works
- [ ] Responsive design functional

## 🔗 Related Documentation

- [Analytics API](./../api/analytics.md)
- [Campaigns API](./../api/campaigns.md)
- [Content API](./../api/content.md)
- [RBAC System](./../SECURITY.md#authorization--rbac)

## 📝 Notes

### Dashboard Widgets

- **Summary Cards**: Key metrics display
- **Metrics Charts**: Data visualization
- **Approval Queue**: Content review workflow
- **User Table**: User management interface
- **System Health**: Monitoring và alerts

### Data Sources

- **Campaigns**: Campaign performance metrics
- **Content**: Content engagement data
- **Users**: User activity và permissions
- **Analytics**: Event tracking data
- **System**: Health và performance metrics

### Performance Considerations

- **Data Caching**: Cache frequently accessed data
- **Lazy Loading**: Load widgets on demand
- **Pagination**: Handle large datasets
- **Real-time Updates**: Efficient data refresh

---

_Created: 2025-01-02_
_Assignee: Frontend + Backend Team_
_Priority: P1_
_Estimated Time: 4-5 days_
