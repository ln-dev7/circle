# PR-003: RBAC System & Role-Based Navigation

## 🎯 Goal

Hoàn thiện RBAC system và implement role-based navigation cho AiM Platform.

## 📋 Acceptance Criteria

### RBAC System

- [ ] Complete RBAC middleware implementation
- [ ] Permission-based API checks cho tất cả endpoints
- [ ] Role management UI cho Admin users
- [ ] User profile management với role display
- [ ] Permission matrix validation

### Role-Based Navigation

- [ ] Sidebar navigation thay đổi theo user role
- [ ] Topbar với search và notifications
- [ ] Command palette integration
- [ ] Theme provider setup
- [ ] Responsive navigation cho mobile

### Security

- [ ] Protected route system hoàn chỉnh
- [ ] Session validation ở mọi level
- [ ] Permission inheritance rules
- [ ] Audit logging cho security events

## 📁 Files to Modify

### New Files

- `lib/rbac.ts` - Complete RBAC implementation
- `lib/permissions.ts` - Permission checking utilities
- `lib/role-manager.ts` - Role management service
- `components/layout/role-based-sidebar.tsx` - Dynamic sidebar
- `components/layout/topbar.tsx` - Top navigation bar
- `components/ui/command-palette.tsx` - Global command palette
- `components/auth/role-switcher.tsx` - Role switching UI
- `app/admin/roles/page.tsx` - Role management page

### Modified Files

- `middleware.ts` - Complete route protection
- `lib/auth.ts` - Add role-based session handling
- `components/layout/main-layout.tsx` - Integrate new navigation
- `app/layout.tsx` - Add theme provider

## 🚀 Commands to Run

### Setup

```bash
# Install additional dependencies
pnpm add @radix-ui/react-command @radix-ui/react-dropdown-menu
pnpm add -D @types/node

# Generate Prisma client (if schema changed)
pnpm prisma generate

# Run database migrations (if needed)
pnpm prisma migrate dev --name enhance_rbac
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
pnpm test -- rbac.test.tsx
pnpm test -- navigation.test.tsx
```

## 🧪 Test Steps

### Manual Testing

1. **RBAC System**

   - [ ] Test permission checks với different roles
   - [ ] Verify role inheritance rules
   - [ ] Test role management UI (Admin only)
   - [ ] Verify user profile role display

2. **Navigation System**

   - [ ] Test sidebar changes theo role
   - [ ] Verify topbar functionality
   - [ ] Test command palette
   - [ ] Test responsive navigation

3. **Security**
   - [ ] Test protected route access
   - [ ] Verify session validation
   - [ ] Test permission-based API access
   - [ ] Verify audit logging

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

- [ ] RBAC implemented cho tất cả operations
- [ ] Permission checks ở mọi level
- [ ] Session validation đầy đủ
- [ ] No sensitive data exposure
- [ ] Audit logging implemented

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
pnpm remove @radix-ui/react-command @radix-ui/react-dropdown-menu

# Reinstall previous package-lock
pnpm install --frozen-lockfile
```

## 📊 Success Metrics

### Technical Metrics

- [ ] All tests passing (100%)
- [ ] TypeScript compilation successful
- [ ] Linting passes without errors
- [ ] RBAC system fully functional
- [ ] Navigation responsive trên all devices

### Functional Metrics

- [ ] Users see role-appropriate navigation
- [ ] Permission checks work correctly
- [ ] Role management UI functional
- [ ] Security events logged properly
- [ ] No unauthorized access possible

## 🔗 Related Documentation

- [RBAC & Security](./../SECURITY.md#authorization--rbac)
- [API Style Guide](./../api/)
- [Data Model](./../data-model.md)

## 📝 Notes

### Permission Matrix

| Action           | Creator | Brand Owner | Admin |
| ---------------- | ------- | ----------- | ----- |
| View Own Content | ✅      | ✅          | ✅    |
| Create Content   | ✅      | ✅          | ✅    |
| Edit Own Content | ✅      | ✅          | ✅    |
| Approve Content  | ❌      | ✅          | ✅    |
| Manage Campaigns | ❌      | ✅          | ✅    |
| Manage Users     | ❌      | ❌          | ✅    |
| System Settings  | ❌      | ❌          | ✅    |

### Role Inheritance

- **Admin**: Tất cả permissions
- **Brand Owner**: Content + Campaign management
- **Creator**: Content creation và management

---

_Created: 2025-01-02_
_Assignee: Backend + Frontend Team_
_Priority: P0_
_Estimated Time: 2-3 days_
