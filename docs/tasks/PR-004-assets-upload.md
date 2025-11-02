# PR-004: Asset Upload & Management System

## 🎯 Goal

Implement comprehensive asset upload system với file management, organization, và integration với content.

## 📋 Acceptance Criteria

### File Upload System

- [ ] File upload với type/size validation
- [ ] Multiple file upload support
- [ ] Progress tracking và error handling
- [ ] File processing (thumbnails, metadata extraction)
- [ ] Storage integration (UploadThing/S3)

### Asset Management

- [ ] Asset library UI với search/filter
- [ ] Asset organization theo campaigns
- [ ] Asset preview và metadata display
- [ ] Asset linking với content
- [ ] Asset usage tracking

### Integration

- [ ] Asset picker trong content editor
- [ ] Asset gallery trong campaign view
- [ ] Asset analytics và usage statistics
- [ ] Asset optimization và compression

## 📁 Files to Modify

### New Files

- `app/api/[orgId]/assets/route.ts` - Asset CRUD API
- `app/api/[orgId]/assets/upload/route.ts` - File upload endpoint
- `app/api/[orgId]/assets/[id]/route.ts` - Individual asset API
- `app/assets/page.tsx` - Asset library page
- `app/assets/[id]/page.tsx` - Asset detail page
- `components/assets/asset-upload.tsx` - Upload component
- `components/assets/asset-library.tsx` - Library component
- `components/assets/asset-picker.tsx` - Asset picker modal
- `components/assets/asset-preview.tsx` - Asset preview component
- `lib/upload-service.ts` - Upload service logic
- `lib/asset-processor.ts` - File processing utilities

### Modified Files

- `lib/schemas.ts` - Add asset validation schemas
- `components/content/content-editor.tsx` - Integrate asset picker
- `components/campaigns/campaign-form.tsx` - Add asset selection

## 🚀 Commands to Run

### Setup

```bash
# Install additional dependencies
pnpm add uploadthing @uploadthing/react
pnpm add -D @types/multer

# Configure UploadThing
# Add UPLOADTHING_SECRET và UPLOADTHING_APP_ID to .env

# Generate Prisma client (if schema changed)
pnpm prisma generate

# Run database migrations (if needed)
pnpm prisma migrate dev --name add_assets
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
pnpm test -- assets.test.tsx
pnpm test -- upload.test.tsx
```

## 🧪 Test Steps

### Manual Testing

1. **File Upload**

   - [ ] Upload single file với valid type
   - [ ] Upload multiple files
   - [ ] Test file size limits
   - [ ] Test invalid file types
   - [ ] Verify progress tracking

2. **Asset Management**

   - [ ] Browse asset library
   - [ ] Search và filter assets
   - [ ] View asset details
   - [ ] Link assets to content
   - [ ] Test asset deletion

3. **Integration**
   - [ ] Use asset picker in content editor
   - [ ] View assets in campaign
   - [ ] Test asset preview
   - [ ] Verify usage tracking

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

- [ ] File type validation implemented
- [ ] File size limits enforced
- [ ] Upload rate limiting
- [ ] No path traversal vulnerabilities
- [ ] Secure file storage

### Code Quality

- [ ] TypeScript types properly defined
- [ ] Error handling implemented
- [ ] Code follows style guidelines
- [ ] No console.log statements
- [ ] Proper JSDoc documentation

### Performance

- [ ] File processing optimized
- [ ] Thumbnail generation efficient
- [ ] Upload progress tracking
- [ ] Asset caching implemented
- [ ] Lazy loading cho large libraries

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
pnpm remove uploadthing @uploadthing/react

# Reinstall previous package-lock
pnpm install --frozen-lockfile
```

## 📊 Success Metrics

### Technical Metrics

- [ ] All tests passing (100%)
- [ ] TypeScript compilation successful
- [ ] Linting passes without errors
- [ ] Upload success rate > 95%
- [ ] File processing time < 5 seconds

### Functional Metrics

- [ ] Users can upload files successfully
- [ ] Asset library search works
- [ ] Asset picker integrates smoothly
- [ ] File previews display correctly
- [ ] Usage tracking accurate

## 🔗 Related Documentation

- [Assets API](./../api/assets.md)
- [Content API](./../api/content.md)
- [UploadThing Integration](./../SECURITY.md)

## 📝 Notes

### Supported File Types

- **Images**: JPG, PNG, GIF, WebP, SVG
- **Videos**: MP4, MOV, AVI, WebM
- **Documents**: PDF, DOC, DOCX, TXT
- **Other**: ZIP, RAR (with size limits)

### File Size Limits

- **Images**: 10MB
- **Videos**: 100MB
- **Documents**: 25MB
- **Other**: 50MB

### Processing Features

- **Images**: Auto-thumbnail generation, format optimization
- **Videos**: Preview frame extraction, duration detection
- **Documents**: Text extraction, preview generation

---

_Created: 2025-01-02_
_Assignee: Full-Stack Team_
_Priority: P2_
_Estimated Time: 3-4 days_
