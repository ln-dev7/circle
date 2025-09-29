# AiM Platform - Product Specification

## 📋 Table of Contents

- [Overview](#overview)
- [User Roles](#user-roles)
- [Scope & MVP](#scope--mvp)
- [User Journeys](#user-journeys)
- [Scheduling UX](#scheduling-ux)
- [Acceptance Criteria](#acceptance-criteria)
- [Non-Goals](#non-goals)

## Overview

**AiM (AI-powered Marketing Platform)** là hệ thống quản lý nội dung và chiến dịch marketing được hỗ trợ bởi AI, phục vụ 3 nhóm người dùng chính trong một tổ chức.

### Core Value Proposition

- **Creators**: Tạo nội dung chất lượng cao với AI assistance
- **Brands**: Quản lý chiến dịch hiệu quả, duyệt nội dung tập trung
- **Admins**: Kiểm soát tổ chức và hệ thống toàn diện

## User Roles

### 🎨 Creator

**Mục tiêu**: Tạo nội dung chất lượng cao cho campaigns

- **Permissions**: Xem campaigns, tạo/sửa content, upload assets
- **Dashboard**: Content studio, draft management, performance tracking
- **Key Actions**: Content creation, AI generation, asset management

### 🏢 Brand Owner

**Mục tiêu**: Quản lý chiến dịch và duyệt nội dung

- **Permissions**: Tạo/sửa campaigns, approve content, view analytics
- **Dashboard**: Campaign overview, approval queue, budget tracking
- **Key Actions**: Campaign management, content approval, scheduling

### ⚙️ Admin

**Mục tiêu**: Quản trị tổ chức và hệ thống

- **Permissions**: User management, org settings, system monitoring
- **Dashboard**: User management, organization settings, system health
- **Key Actions**: User CRUD, role assignment, system configuration

## Scope & MVP

### ✅ MVP Features (Phase 1)

1. **Authentication & RBAC**

   - NextAuth integration với role-based access
   - Organization-based multi-tenancy
   - Permission system cho tất cả actions

2. **Campaign Management**

   - CRUD campaigns (Brand Owner + Admin)
   - Campaign status tracking (Draft → Active → Completed)
   - Basic campaign metrics

3. **Content Creation & Management**

   - Rich text editor cho content
   - AI-assisted content generation
   - Content approval workflow
   - Asset upload và management

4. **Scheduling System**

   - Schedule content cho campaigns
   - Calendar view với platform support
   - Basic publishing automation

5. **Analytics Foundation**
   - Event tracking (content views, AI usage)
   - Basic metrics dashboard
   - Campaign performance tracking

### 🔄 Future Features (Phase 2+)

- Advanced AI features (translation, summarization)
- Social media integration
- Advanced analytics và reporting
- Team collaboration tools
- Mobile applications

## User Journeys

### 1. Campaign Creation Flow

```
Brand Owner → Create Campaign → Set Goals/Budget → Assign Creators →
Creators Create Content → Submit for Review → Brand Approval →
Schedule → Publish → Track Performance
```

### 2. Content Creation Flow

```
Creator → Select Campaign → AI-Assisted Content Creation →
Preview & Edit → Save Draft → Submit for Review →
Brand Review → Approve/Reject → Schedule → Publish
```

### 3. AI Integration Flow

```
User → Input Prompt → AI Service → Generate Content →
User Review → Edit/Refine → Save → Submit
```

### 4. Asset Management Flow

```
User → Upload File → Process & Optimize → Add Metadata →
Link to Content → Version Control → Archive
```

### 5. Scheduling Workflow

```
User → Open Schedule View → Toggle Draft Panel →
Browse Draft Content → Drag & Drop to Time Slot →
Confirm Details (Channel, Time, Timezone) → Create Schedule →
Content Status → SCHEDULED → Automated Publishing
```

## Scheduling UX

### 📅 Three View Modes

1. **Day View**: 24-hour timeline với 15-minute slots
2. **Week View**: 7-day grid với hourly rows
3. **Month View**: Calendar layout với daily cells

### 📝 Draft Panel

- **Toggle**: Right-side panel hiển thị content có `status=DRAFT`
- **Features**: Search, campaign filtering, channel icons
- **Drag Source**: Content items có thể kéo thả vào grid

### 🎯 Drag & Drop Flow

1. **Drag Start**: Click và kéo draft content từ panel
2. **Drop Target**: Thả vào time slot trên grid
3. **Confirmation Sheet**: Chọn channel, time, timezone
4. **Schedule Creation**: API call tạo Schedule
5. **Status Update**: Content status → `SCHEDULED`

### 🔧 Smart Features

- **Conflict Detection**: Cảnh báo overlap cùng channel
- **Past Time Warning**: Không cho phép schedule quá khứ
- **Timezone Support**: `runAt` lưu UTC, `timezone` cho UI
- **Performance**: Window-based loading (from/to dates)

### 🎨 Visual Indicators

- **Channel Icons**: 📘 Facebook, 📷 Instagram, 🐦 Twitter, etc.
- **Status Colors**: Pending (blue), Published (green), Failed (red)
- **Current Time**: Highlight "now" slot với badge
- **Drop Zones**: Hover effects và visual feedback

## Acceptance Criteria

### 🔐 Authentication & Access

- [ ] User login/logout với NextAuth
- [ ] Role-based access control (Creator, Brand Owner, Admin)
- [ ] Organization isolation và multi-tenancy

### 📊 Campaign Management

- [ ] CRUD campaigns với validation
- [ ] Campaign status workflow
- [ ] User assignment và permissions

### ✍️ Content Management

- [ ] Rich text editor với AI assistance
- [ ] Content approval workflow
- [ ] Asset upload và management
- [ ] Version control và history

### 📅 Scheduling System

- [ ] Three view modes (Day/Week/Month) hoạt động
- [ ] Draft panel toggle và content filtering
- [ ] Drag & drop từ draft vào time slot
- [ ] Schedule confirmation sheet
- [ ] API integration tạo schedule
- [ ] Content status update → SCHEDULED

### 📈 Analytics & Monitoring

- [ ] Event tracking foundation
- [ ] Basic metrics dashboard
- [ ] Campaign performance data

### 🚀 Performance & UX

- [ ] Responsive design cho mobile/desktop
- [ ] Loading states và error handling
- [ ] Keyboard navigation support
- [ ] Accessibility compliance (WCAG 2.1)

## Non-Goals

### ❌ Out of Scope (Phase 1)

- Social media platform integration
- Advanced AI features (translation, summarization)
- Team collaboration tools
- Mobile applications
- Advanced analytics và reporting
- Multi-language support
- Advanced workflow automation
- Third-party integrations (beyond basic APIs)

### 🔮 Future Considerations

- Real-time collaboration
- Advanced AI content optimization
- Social media publishing automation
- Advanced analytics và insights
- Mobile app development
- API marketplace
- White-label solutions
