# PR-002: Campaigns & Content CRUD Operations

## 🎯 Goal

Implement core CRUD operations cho campaigns và content management với proper RBAC và validation.

## 📋 Acceptance Criteria

### Campaign Management

- [ ] Campaign CRUD API endpoints implemented
- [ ] Campaign list page với pagination và filtering
- [ ] Campaign creation form với validation
- [ ] Campaign edit/delete functionality
- [ ] Role-based access control (Brand Owner + Admin only)

### Content Management

- [ ] Content CRUD API endpoints implemented
- [ ] Content editor với rich text support
- [ ] Content approval workflow (Draft → Submitted → Approved)
- [ ] Content linking với campaigns
- [ ] Role-based permissions (Creators can create, Brand Owners can approve)

### UI Components

- [ ] Campaign list component với search/filter
- [ ] Campaign form component với validation
- [ ] Content editor component
- [ ] Content approval queue component
- [ ] Responsive design cho mobile

## 📁 Files to Modify

### New Files

- `app/api/[orgId]/campaigns/route.ts` - Campaign CRUD API
- `app/api/[orgId]/campaigns/[id]/route.ts` - Individual campaign API
- `app/api/[orgId]/content/route.ts` - Content CRUD API
- `app/api/[orgId]/content/[id]/route.ts` - Individual content API
- `app/campaigns/page.tsx` - Campaigns list page
- `app/campaigns/[id]/page.tsx` - Campaign detail page
- `app/campaigns/new/page.tsx` - Create campaign page
- `app/content/page.tsx` - Content list page
- `app/content/[id]/page.tsx` - Content detail page
- `app/content/new/page.tsx` - Create content page

### New Components

- `components/campaigns/campaign-list.tsx` - Campaign list component
- `components/campaigns/campaign-form.tsx` - Campaign form component
- `components/campaigns/campaign-card.tsx` - Campaign card component
- `components/content/content-editor.tsx` - Rich text editor
- `components/content/content-list.tsx` - Content list component
- `components/content/approval-queue.tsx` - Approval queue component

### Modified Files

- `lib/rbac.ts` - Add campaign/content permissions
- `lib/schemas.ts` - Add campaign/content validation schemas
- `components/layout/sidebar.tsx` - Add navigation links
- `middleware.ts` - Add route protection

## 🚀 Commands to Run

### Setup

```bash
# Install additional dependencies
pnpm add @tiptap/react @tiptap/pm @tiptap/starter-kit
pnpm add -D @types/node

# Generate Prisma client (if schema changed)
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev --name add_campaigns_content
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
pnpm test -- campaigns.test.tsx
pnpm test -- content.test.tsx
```

## 🧪 Test Steps

### Manual Testing

1. **Campaign Management**

   - [ ] Create new campaign với valid data
   - [ ] Edit existing campaign
   - [ ] Delete campaign (with confirmation)
   - [ ] Test role-based access (Creator cannot create campaigns)
   - [ ] Verify pagination và filtering work

2. **Content Management**

   - [ ] Create new content trong campaign
   - [ ] Edit content với rich text editor
   - [ ] Submit content for approval
   - [ ] Approve/reject content (Brand Owner role)
   - [ ] Test content status workflow

3. **API Endpoints**
   - [ ] Test campaign CRUD endpoints
   - [ ] Test content CRUD endpoints
   - [ ] Verify permission checks
   - [ ] Test validation errors
   - [ ] Verify pagination parameters

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

- [ ] RBAC implemented cho all operations
- [ ] Input validation với Zod schemas
- [ ] Permission checks ở API level
- [ ] No sensitive data exposure
- [ ] SQL injection prevention

### Code Quality

- [ ] TypeScript types properly defined
- [ ] Error handling implemented
- [ ] Code follows style guidelines
- [ ] No console.log statements
- [ ] Proper JSDoc documentation

### UI/UX

- [ ] Responsive design implemented
- [ ] Loading states handled
- [ ] Error states displayed
- [ ] Success feedback provided
- [ ] Accessibility considerations

### Performance

- [ ] Pagination implemented
- [ ] Database queries optimized
- [ ] No N+1 query problems
- [ ] Proper indexing added
- [ ] Lazy loading implemented

## 🚨 Rollback Plan

### Database Rollback

```bash
# Reset to previous migration
pnpm prisma migrate reset

# Or manually revert schema changes
# Edit prisma/schema.prisma and reapply
```

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
pnpm remove @tiptap/react @tiptap/pm @tiptap/starter-kit

# Reinstall previous package-lock
pnpm install --frozen-lockfile
```

## 📊 Success Metrics

### Technical Metrics

- [ ] All tests passing (100%)
- [ ] TypeScript compilation successful
- [ ] Linting passes without errors
- [ ] API response time < 200ms
- [ ] Database query time < 100ms

### Functional Metrics

- [ ] Users can create/edit/delete campaigns
- [ ] Users can create/edit content
- [ ] Approval workflow functions correctly
- [ ] Role-based access works properly
- [ ] Pagination và filtering work

### Performance Metrics

- [ ] Page load time < 2 seconds
- [ ] API response time < 500ms
- [ ] Database queries < 200ms
- [ ] No memory leaks detected
- [ ] Smooth scrolling và interactions

## 🔗 Related Documentation

- [Campaigns API](./../api/campaigns.md)
- [Content API](./../api/content.md)
- [RBAC System](./../SECURITY.md#authorization--rbac)
- [Data Model](./../data-model.md)

## 📝 Notes

### Dependencies

- **@tiptap/react** - Rich text editor cho content
- **@tiptap/starter-kit** - Basic editor features
- **@tiptap/pm** - ProseMirror integration

### API Endpoints

```typescript
// Campaigns
GET / api / [orgId] / campaigns; // List campaigns
POST / api / [orgId] / campaigns; // Create campaign
GET / api / [orgId] / campaigns / [id]; // Get campaign
PUT / api / [orgId] / campaigns / [id]; // Update campaign
DELETE / api / [orgId] / campaigns / [id]; // Delete campaign

// Content
GET / api / [orgId] / content; // List content
POST / api / [orgId] / content; // Create content
GET / api / [orgId] / content / [id]; // Get content
PUT / api / [orgId] / content / [id]; // Update content
DELETE / api / [orgId] / content / [id]; // Delete content
POST / api / [orgId] / content / [id] / submit; // Submit for approval
POST / api / [orgId] / content / [id] / approve; // Approve content
POST / api / [orgId] / content / [id] / reject; // Reject content
```

### Permission Matrix

| Action           | Creator | Brand Owner | Admin |
| ---------------- | ------- | ----------- | ----- |
| View Campaigns   | ✅      | ✅          | ✅    |
| Create Campaigns | ❌      | ✅          | ✅    |
| Edit Campaigns   | ❌      | ✅          | ✅    |
| Delete Campaigns | ❌      | ✅          | ✅    |
| Create Content   | ✅      | ✅          | ✅    |
| Edit Content     | ✅      | ✅          | ✅    |
| Approve Content  | ❌      | ✅          | ✅    |
| Delete Content   | ✅      | ✅          | ✅    |

### Content Status Flow

```
DRAFT → SUBMITTED → APPROVED → PUBLISHED
  ↓         ↓          ↓          ↓
  Edit    Review    Schedule    Analytics
  Save    Feedback   Content    Track
```

---

_Created: 2025-01-02_
_Assignee: Full-Stack Team_
_Priority: High_
_Estimated Time: 3-4 days_
