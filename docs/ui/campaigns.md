# Campaigns UI Guide

## 📋 Table of Contents

- [Overview](#overview)
- [Interface Components](#interface-components)
- [Campaign List View](#campaign-list-view)
- [Campaign Detail View](#campaign-detail-view)
- [Campaign Creation Form](#campaign-creation-form)
- [Campaign Management](#campaign-management)
- [User Interactions](#user-interactions)
- [Performance Considerations](#performance-considerations)
- [Accessibility](#accessibility)

## Overview

Campaigns UI là giao diện quản lý chiến dịch marketing cho AiM Platform. Interface hỗ trợ campaign creation, management, analytics, và collaboration giữa team members với role-based access control.

### 🎯 Key Features

- **Campaign Management**: Create, edit, delete campaigns
- **Content Integration**: Link content với campaigns
- **Team Collaboration**: Role-based permissions và workflows
- **Analytics Dashboard**: Performance metrics và reporting
- **Responsive Design**: Mobile-friendly với touch optimization

## Interface Components

### 🎛️ Header Controls

```typescript
interface CampaignHeader {
   title: string; // "Campaigns"
   searchBar: SearchInput; // Global search
   filters: FilterBar; // Status, date, team filters
   createButton: Button; // "Create Campaign"
   viewToggle: ViewToggle; // Grid/List view switch
}
```

### 📊 Campaign Grid

```typescript
interface CampaignGrid {
   campaigns: CampaignCard[]; // Campaign cards
   pagination: Pagination; // Page navigation
   emptyState: EmptyState; // No campaigns message
   loadingState: LoadingState; // Loading skeleton
}
```

### 🎨 Campaign Card

```typescript
interface CampaignCard {
   header: {
      title: string; // Campaign name
      status: Badge; // Status indicator
      priority: PriorityBadge; // Priority level
   };
   content: {
      description: string; // Campaign description
      metrics: MetricRow[]; // Performance metrics
      team: AvatarGroup; // Team members
   };
   actions: {
      edit: Button; // Edit button
      duplicate: Button; // Duplicate button
      delete: Button; // Delete button
   };
}
```

### 📝 Campaign Creation Modal

```typescript
interface CampaignCreationModal {
   header: {
      team: string; // "team"
      title: string; // "New Campaign"
      closeButton: Button; // Close [✕] button
   };
   form: {
      name: Input; // Campaign name input
      summary: Input; // Short summary input
      attributes: AttributeRow[]; // Status, lead, members, dates, labels
      description: TextArea; // Rich description area
      milestones: MilestoneSection; // Milestones management
   };
   actions: {
      cancel: Button; // Cancel button
      create: Button; // Create campaign button
   };
}
```

### 🎯 Attribute Row Components

```typescript
interface AttributeRow {
   status: StatusSelector; // draft, planning, ready, Done, Canceled
   lead: LeadSelector; // Single person assignment (👤)
   members: MemberSelector; // Multiple team members or teams (👥)
   startDate: DateSelector; // Campaign start date (📅)
   targetDate: DateSelector; // Campaign target date (📅)
   labels: LabelSelector; // Custom tags (🏷️)
}
```

## Campaign List View

### 📱 List Page Layout

**Page Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ Campaigns                    [Search Campaigns...]     │
│ [All] [Active] [Draft] [Completed] [Archived]         │
├─────────────────────────────────────────────────────────┤
│ [Create Campaign] [Grid View] [List View]              │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📋 Campaigns Overview Table                        │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ Title │ Health │ Total Tasks │ PIC │ Timeline │ Status │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ 🚀 Summer Sale 2024 │ 🟢 On Track │ 15 │ 👥 John D, Sarah M, Mike R │ Aug 1 → Aug 31 │ 🟡 Planning │ [📋] │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ 🎯 Q4 Product Launch │ 🟡 At Risk │ 8 │ 👥 Sarah M, Mike R │ Sep 1 → Sep 30 │ 🔵 Draft │ [📋] │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ 🌟 Brand Awareness │ 🔴 Off Track │ 12 │ 👥 Mike R, Team A │ Oct 1 → Oct 31 │ 🔴 Canceled │ [📋] │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Showing 1-10 of 24 campaigns                          │
│ [← Previous] [1] [2] [3] [Next →]                    │
└─────────────────────────────────────────────────────────┘
```

**Filter Options:**

- **Health**: All, On Track, At Risk, Off Track
- **Status**: All, Draft, Planning, Ready, Done, Canceled
- **Team**: All teams, Specific team members
- **Date Range**: Last 7 days, Last 30 days, Custom range

**View Options:**

- **Table View**: Detailed table layout (default)
- **Grid View**: Card-based layout
- **Compact View**: Minimal information

## Campaign Detail View

### 📱 Detail Page Layout

**Page Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ ← Back to Campaigns    🚀 Summer Sale 2024    [Edit]   │
│ [Active] [High Priority] [Created: Jan 1, 2024]       │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📋 Overview                                        │
│ │ Boost summer sales with targeted social media...   │
│ │ 🎯 Goal: Increase sales by 25%                     │
│ │ 💰 Budget: $10,000                                │
│ │ 📅 Duration: Jun 1 - Aug 31, 2024                 │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ [Overview] [Content] [Analytics] [Team] [Settings]   │
├─────────────────────────────────────────────────────────┤
│ Content Tab Content                                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📝 Content Items (12)                              │
│ │ [Create Content] [Import Content]                  │
│ │ • Summer Sale Post 1 - Instagram                   │
│ │ • Summer Sale Post 2 - Facebook                    │
│ │ • Summer Sale Post 3 - LinkedIn                    │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Tab Navigation:**

- **Overview**: Campaign summary và key metrics
- **Content**: Linked content items và creation
- **Analytics**: Performance data và insights
- **Team**: Team members và permissions
- **Settings**: Campaign configuration

### 📋 Right Side Panel Layout

**Panel Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ Campaign Details                    [✕]                │
├─────────────────────────────────────────────────────────┤
│ 🚀 Summer Sale 2024                                   │
│ 🟢 On Track • 🟡 Planning • High Priority             │
├─────────────────────────────────────────────────────────┤
│ 📋 Tasks (15)                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ✅ Create campaign brief                            │
│ │ ✅ Design social media graphics                     │
│ │ ⏳ Write Instagram captions (3/5)                  │
│ │ ⏳ Schedule posts (8/15)                            │
│ │ ⏳ Monitor performance                              │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ 👥 Team Members                                        │
│ • John D (Campaign Manager)                           │
│ • Sarah M (Content Creator)                           │
│ • Mike R (Designer)                                   │
├─────────────────────────────────────────────────────────┤
│ 📅 Timeline                                            │
│ Start: Aug 1, 2024                                    │
│ End: Aug 31, 2024                                     │
│ Duration: 31 days                                      │
└─────────────────────────────────────────────────────────┘
```

## Campaign Creation Form

### 📱 Creation Form Layout

**Modal Behavior:**

- **Centered Position**: Modal appears in center of screen
- **Dark Theme**: Consistent với app theme
- **Close Button**: [✕] button at top right
- **Overlay Background**: Dimmed main content behind modal
- **Responsive Design**: Adapts to different screen sizes

**Form Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ team • New Campaign                    [✕]           │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Campaign Name                    [Enter name...]    │
│ │ Summary                          [Add a short summary...] │
│ ├─────────────────────────────────────────────────────┤
│ │ [status] [Lead 👤] [Members 👥] [Start 📅] [Target 📅] [Labels 🏷️] │
│ ├─────────────────────────────────────────────────────┤
│ │ Description                                      │
│ │ ┌─────────────────────────────────────────────────┐ │
│ │ │ Write a description, a campaign brief, or      │
│ │ │ collect ideas...                               │
│ │ │                                                 │
│ │ │                                                 │
│ │ └─────────────────────────────────────────────────┘ │
│ ├─────────────────────────────────────────────────────┤
│ │ Milestones                                        │
│ │ [+] Add milestone                                 │
│ ├─────────────────────────────────────────────────────┤
│ │ [Cancel] [Create Campaign]                        │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Form Fields:**

- **Campaign Name**: Required text input (large field)
- **Summary**: Short description field (optional)
- **Status**: draft, planning, ready, Done, Canceled
- **Lead**: Single person assignment (👤 icon)
- **Members**: Multiple team members (👥 icon)
- **Start Date**: Campaign start date (📅 icon)
- **Target Date**: Campaign target date (📅 icon)
- **Labels**: Custom tags và categories (🏷️ icon)
- **Description**: Rich text area for detailed informations
- **Milestones**: Project milestones và checkpoints

**Validation Rules:**

- **Campaign Name**: Required, min 3 characters, max 100 characters
- **Summary**: Optional, max 200 characters
- **Status**: Required, must be valid status value
- **Lead**: Required, must be valid team member
- **Members**: Optional, can be empty, could be a member or teams
- **Start Date**: Required, must be valid date
- **Target Date**: Required, must be after start date
- **Labels**: Optional, max 10 labels per campaign
- **Description**: Optional, max 2000 characters
- **Milestones**: Optional, max 20 milestones per campaign

## Campaign Management

### 📊 Status Management

**Status Flow:**

```
DRAFT → PLANNING → READY → DONE
  ↓        ↓         ↓       ↓
  Edit    Review    Start   Complete
  Save    Approve   Launch  Archive
```

**Status Indicators:**

- 🔵 **Draft**: Blue badge - "Draft"
- 🟡 **Planning**: Yellow badge - "Planning"
- 🟢 **Ready**: Green badge - "Ready"
- 🟠 **Done**: Orange badge - "Done"
- 🔴 **Canceled**: Red badge - "Canceled"

### 🎯 Health Management

**Health Levels:**

- 🟢 **On Track**: Green badge - "On Track"
- 🟡 **At Risk**: Yellow badge - "At Risk"
- 🔴 **Off Track**: Red badge - "Off Track"

**Health Rules:**

- **On Track**: Campaign progressing as planned
- **At Risk**: Some delays or issues, but manageable
- **Off Track**: Significant delays or major issues

### 🎯 Priority Management

**Priority Levels:**

- 🔴 **High**: Red badge - "High Priority"
- 🟡 **Medium**: Yellow badge - "Medium Priority"
- 🟢 **Low**: Green badge - "Low Priority"

**Priority Rules:**

- **High**: Urgent campaigns, tight deadlines
- **Medium**: Standard campaigns, normal timeline
- **Low**: Background campaigns, flexible timeline

### 📋 Task Management

**Task Structure:**

- **Main Tasks**: Primary campaign activities
- **Subtasks**: Breakdown of main tasks
- **Posts**: Content creation tasks (can be tasks too)
- **Dependencies**: Task relationships và sequences

**Task Types:**

- **Content Creation**: Social media posts, blog articles
- **Design Tasks**: Graphics, videos, layouts
- **Approval Tasks**: Content review, campaign approval
- **Publishing Tasks**: Schedule và publish content

### 🎨 Right Side Panel

**Panel Features:**

- **📋 Icon**: Click to open campaign details panel
- **Auto-hide**: Panel automatically hides when not in use
- **Slide Animation**: Smooth right-to-left slide effect
- **Campaign Details**: Comprehensive campaign information
- **Task List**: All tasks và subtasks
- **Team Management**: Member assignments và roles
- **Timeline View**: Detailed schedule breakdown

## User Interactions

### 🖱️ Mouse Interactions

**Click Actions:**

- **Campaign Selection**: Click row để view details
- **📋 Icon Click**: Open right side panel với campaign details
- **Create Campaign**: Click "+ Add project" để open modal
- **Quick Actions**: Hover để reveal action buttons
- **Bulk Operations**: Select multiple campaigns
- **Navigation**: Tab switching, pagination
- **Modal Close**: Click [✕] hoặc overlay để close

**Hover Effects:**

- **Card Hover**: Subtle shadow + action buttons
- **Button Hover**: Color changes + tooltips
- **Status Hover**: Additional information

**Drag & Drop:**

- **Status Change**: Drag status badges
- **Priority Change**: Drag priority indicators
- **Team Assignment**: Drag team members

### ⌨️ Keyboard Navigation

**Tab Order:**

1. Search bar
2. Filter controls
3. Create button
4. Campaign cards
5. Action buttons
6. Pagination controls

**Keyboard Shortcuts:**

- **Enter**: Open campaign details
- **Space**: Select campaign
- **Delete**: Delete selected campaign
- **Escape**: Close modals
- **Ctrl/Cmd + A**: Select all campaigns
- **Ctrl/Cmd + N**: Open new campaign modal
- **Tab**: Navigate between form fields
- **Shift + Tab**: Navigate backwards through fields

### 📱 Touch Interactions

**Mobile Gestures:**

- **Tap**: Select campaign
- **Long Press**: Show context menu
- **Swipe**: Navigate between tabs
- **Pinch**: Zoom campaign grid

**Touch Optimization:**

- **Touch Targets**: Minimum 44px size
- **Gesture Support**: Native touch gestures
- **Responsive Layout**: Mobile-first design

## Performance Considerations

### 🚀 Data Loading

**Pagination Strategy:**

```typescript
interface PaginationConfig {
   pageSize: 20; // Items per page
   preloadPages: 2; // Preload adjacent pages
   virtualScrolling: true; // Virtual scroll for large lists
}
```

**Lazy Loading:**

- **Initial Load**: First page only
- **On-demand**: Load pages as needed
- **Background**: Preload next page

**Caching Strategy:**

- **Campaign Data**: Cache trong memory
- **User Preferences**: Persist filters và settings
- **Search Results**: Cache search queries

### 🎨 Rendering Optimization

**Component Memoization:**

- **Campaign Cards**: Memoize card components
- **Filter Controls**: Memoize filter components
- **Pagination**: Memoize pagination controls

**Virtual Scrolling:**

- **Large Tables**: Virtual scroll cho 100+ campaigns
- **Performance**: Render visible rows only
- **Smooth Scrolling**: 60fps scrolling performance

**Table Optimization:**

- **Column Sorting**: Efficient sort algorithms
- **Row Selection**: Optimized selection handling
- **Filter Performance**: Fast filtering với large datasets

**State Management:**

- **Local State**: Component-level state
- **Shared State**: Context providers
- **Persistence**: URL state cho filters

## Accessibility

### ♿ WCAG 2.1 Compliance

**Screen Reader Support:**

- **ARIA Labels**: Descriptive labels cho all elements
- **Live Regions**: Dynamic content updates
- **Focus Management**: Logical tab order

**Keyboard Navigation:**

- **Full Keyboard Support**: All functions accessible
- **Focus Indicators**: Clear focus states
- **Skip Links**: Jump to main content

**Color & Contrast:**

- **High Contrast**: 4.5:1 minimum ratio
- **Color Independence**: Not relying on color alone
- **Visual Indicators**: Icons + text labels

### 🎯 Specific Features

**Campaign Table:**

- **Semantic Structure**: Proper table headers và rows
- **Status Announcements**: Screen reader announces status
- **Action Descriptions**: Clear button descriptions
- **Row Navigation**: Keyboard navigation between rows

**Form Accessibility:**

- **Label Associations**: Proper form labels
- **Error Messages**: Clear error descriptions
- **Validation Feedback**: Real-time validation

**Navigation:**

- **Tab Navigation**: Clear tab structure
- **Breadcrumbs**: Navigation context
- **Progress Indicators**: Multi-step progress

---

_Last Updated: 2025-01-02_
_Version: 1.0_
_Maintainer: Design Team_
