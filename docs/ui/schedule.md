# Schedule UI Guide

## 📋 Table of Contents

- [Overview](#overview)
- [Interface Components](#interface-components)
- [View Modes](#view-modes)
- [Draft Panel](#draft-panel)
- [Drag & Drop Flow](#drag--drop-flow)
- [User Interactions](#user-interactions)
- [Performance Considerations](#performance-considerations)
- [Accessibility](#accessibility)

## Overview

Schedule UI là giao diện chính để quản lý lịch trình xuất bản content trên các nền tảng social media. Interface hỗ trợ 3 chế độ xem (Day/Week/Month), draft panel, và drag-and-drop functionality để tạo schedules.

### 🎯 Key Features

- **Multi-view Calendar**: Day, Week, Month views với navigation
- **Draft Panel**: Right-side panel hiển thị content có status DRAFT
- **Drag & Drop**: Kéo thả draft content vào time slots
- **Smart Scheduling**: Conflict detection và timezone support
- **Responsive Design**: Mobile-friendly với touch gestures

## Interface Components

### 🎛️ Header Controls

```typescript
interface HeaderControls {
   navigation: {
      previous: Button; // Go to previous period
      next: Button; // Go to next period
      today: Button; // Jump to current date
      dateDisplay: string; // Current period label
   };
   filters: {
      channels: Badge[]; // Selected channels
      campaigns: Badge[]; // Selected campaigns
   };
   draftToggle: Switch; // Show/hide draft panel
}
```

### 📅 View Tabs

```typescript
interface ViewTabs {
   day: TabTrigger; // Day view (24-hour timeline)
   week: TabTrigger; // Week view (7-day grid)
   month: TabTrigger; // Month view (calendar layout)
}
```

### 🎨 Main Layout

```typescript
interface ScheduleLayout {
   mainGrid: CalendarGrid; // Main calendar area
   draftPanel?: DraftPanel; // Right-side panel (conditional)
   scheduleSheet?: Sheet; // Schedule confirmation modal
}
```

## View Modes

### 📅 Day View

**Purpose**: Detailed hourly planning với 15-minute precision

**Layout Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ Time Column │ Hour 0 │ Hour 1 │ Hour 2 │ ... │ Hour 23 │
├─────────────┼────────┼────────┼────────┼─────┼─────────┤
│ 12:00 AM   │ 15min  │ 15min  │ 15min  │ ... │ 15min   │
│             │ slots  │ slots  │ slots  │     │ slots   │
├─────────────┼────────┼────────┼────────┼─────┼─────────┤
│ 1:00 AM    │ 15min  │ 15min  │ 15min  │ ... │ 15min   │
│             │ slots  │ slots  │ slots  │     │ slots   │
├─────────────┼────────┼────────┼────────┼─────┼─────────┤
│ ...         │ ...    │ ...    │ ...    │ ... │ ...     │
└─────────────┴────────┴────────┴────────┴─────┴─────────┘
```

**Features:**

- **Time Slots**: 15-minute precision cho detailed scheduling
- **Current Time**: Highlight "now" với blue badge
- **Past Slots**: Grayed out với visual indication
- **Drop Zones**: Hover effects cho drag & drop

**Visual Indicators:**

- 🕐 **Current Hour**: Blue background với "Now" badge
- ⏰ **Current Slot**: Blue border với dashed line
- 🕛 **Past Time**: Gray background với muted colors
- 🎯 **Drop Target**: Hover effects và visual feedback

### 📊 Week View

**Purpose**: Weekly overview với daily columns và hourly rows

**Layout Structure:**

```
┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ Time    │ Monday  │ Tuesday │Wednesday│Thursday │ Friday  │Saturday │ Sunday  │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ 12 AM  │ 15min   │ 15min   │ 15min   │ 15min   │ 15min   │ 15min   │ 15min   │
│         │ slots   │ slots   │ slots   │ slots   │ slots   │ slots   │ slots   │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ 1 AM   │ 15min   │ 15min   │ 15min   │ 15min   │ 15min   │ 15min   │ 15min   │
│         │ slots   │ slots   │ slots   │ slots   │ slots   │ slots   │ slots   │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ ...     │ ...     │ ...     │ ...     │ ...     │ ...     │ ...     │ ...     │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

**Features:**

- **Daily Columns**: 7 days với consistent hourly rows
- **Current Day**: Blue highlight với "Today" badge
- **Compact Display**: 15-minute slots trong 4px height
- **Schedule Preview**: Content preview trong slots

**Visual Indicators:**

- 📅 **Current Day**: Blue background với "Today" badge
- 🕐 **Current Hour**: Blue highlight cho current time
- 📱 **Schedules**: Blue cards với channel icons và titles
- 🎯 **Drop Zones**: Hover effects cho drag & drop

### 📆 Month View

**Purpose**: Monthly overview với daily cells và schedule previews

**Layout Structure:**

```
┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ Mon     │ Tue     │ Wed     │ Thu     │ Fri     │ Sat     │ Sun     │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ 1      │ 2       │ 3       │ 4       │ 5       │ 6       │ 7       │
│ [Day   │ [Day    │ [Day    │ [Day    │ [Day    │ [Day    │ [Day    │
│  Cell] │  Cell]  │  Cell]  │  Cell]  │  Cell]  │  Cell]  │  Cell]  │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ 8      │ 9       │ 10      │ 11      │ 12      │ 13      │ 14      │
│ [Day   │ [Day    │ [Day    │ [Day    │ [Day    │ [Day    │ [Day    │
│  Cell] │  Cell]  │  Cell]  │  Cell]  │  Cell]  │  Cell]  │  Cell]  │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ ...     │ ...     │ ...     │ ...     │ ...     │ ...     │ ...     │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

**Features:**

- **Daily Cells**: 120px height với schedule previews
- **Current Month**: Highlight current month dates
- **Schedule Display**: Up to 3 schedules per day
- **Drop Targets**: Full day drop zones

**Visual Indicators:**

- 📅 **Current Day**: Blue background với "Today" badge
- 🌙 **Current Month**: Normal text color cho current month
- 🌑 **Other Months**: Muted gray cho adjacent months
- 📱 **Schedules**: Blue cards với channel icons và titles

## Draft Panel

### 📝 Panel Structure

```typescript
interface DraftPanel {
   header: {
      title: string; // "Draft Posts"
      count: number; // Draft content count
   };
   search: Input; // Search drafts
   channelSelector: Select; // Default channel
   campaignFilter: Badge[]; // Campaign filter badges
   contentList: ScrollArea; // Draft content items
}
```

### 🔍 Search & Filtering

**Search Functionality:**

- **Text Search**: Title và body content
- **Real-time**: Instant search results
- **Highlight**: Search term highlighting

**Campaign Filtering:**

- **Multi-select**: Toggle campaigns on/off
- **Visual State**: Selected vs unselected badges
- **Dynamic Content**: Filter content list in real-time

### 📱 Draft Content Items

```typescript
interface DraftItem {
   channelIcon: string; // Platform emoji
   campaignBadge: Badge; // Campaign name
   assetIcons: Icon[]; // File type indicators
   title: string; // Content title
   body?: string; // Content preview
   metadata: {
      createdDate: string; // Creation date
      dragHint: string; // "Drag to schedule"
   };
}
```

**Visual Design:**

- 🎨 **Hover Effects**: Subtle background changes
- 🖱️ **Drag Cursor**: `cursor-move` cho drag indication
- 📱 **Asset Preview**: File type icons với count badges
- 🏷️ **Campaign Tags**: Color-coded campaign badges

## Drag & Drop Flow

### 🎯 Drag Source (Draft Panel)

**Drag Initiation:**

1. **Mouse Down**: Start drag operation
2. **Visual Feedback**: Item opacity → 50%
3. **Drag Preview**: Show content thumbnail
4. **Data Transfer**: Set `contentId` và `channel`

**Drag Data:**

```typescript
interface DragItem {
   type: 'DRAFT_CONTENT';
   contentId: string;
   channel: Channel;
   preview?: {
      title: string;
      channelIcon: string;
      thumbnail?: string;
   };
}
```

### 🎯 Drop Target (Calendar Grid)

**Drop Zones:**

- **Day View**: 15-minute time slots
- **Week View**: 15-minute time slots
- **Month View**: Full day cells

**Drop Validation:**

- ✅ **Valid Targets**: Future time slots
- ⚠️ **Past Time**: Warning với confirmation
- 🚫 **Invalid**: Disabled drop zones

**Drop Handling:**

```typescript
interface DropResult {
   contentId: string;
   channel: Channel;
   targetDate: Date;
   targetTime: string;
}
```

### 📋 Schedule Confirmation Sheet

**Sheet Content:**

```typescript
interface ScheduleSheet {
   header: {
      title: string; // "Schedule Content"
      icon: Icon; // Calendar icon
   };
   form: {
      channel: Select; // Platform selection
      date: Input; // Date picker
      time: Select; // Time selection (15-min slots)
      timezone: Select; // Timezone picker
   };
   preview: {
      summary: string; // Schedule summary
      warnings?: Alert[]; // Past time warnings
   };
   actions: {
      cancel: Button; // Cancel button
      submit: Button; // Schedule button
   };
}
```

**Form Validation:**

- ✅ **Required Fields**: Channel, date, time, timezone
- ⚠️ **Past Time**: Warning với confirmation
- 🚫 **Invalid Data**: Disable submit button

## User Interactions

### 🖱️ Mouse Interactions

**Click Actions:**

- **Navigation**: Previous/next period buttons
- **View Switching**: Tab selection
- **Draft Toggle**: Show/hide draft panel
- **Filter Selection**: Campaign và channel filters

**Hover Effects:**

- **Drop Zones**: Visual feedback cho drag targets
- **Interactive Elements**: Button và badge hover states
- **Schedule Items**: Hover previews cho content

**Drag Operations:**

- **Start Drag**: Mouse down trên draft items
- **Drag Over**: Visual feedback trên drop zones
- **Drop**: Release để create schedule

### ⌨️ Keyboard Navigation

**Tab Order:**

1. Navigation controls (previous, next, today)
2. View tabs (day, week, month)
3. Filter controls (channels, campaigns)
4. Draft toggle
5. Draft panel content
6. Calendar grid (if accessible)

**Keyboard Shortcuts:**

- **Enter**: Open draft panel
- **Tab**: Navigate between elements
- **Arrow Keys**: Navigate time slots
- **Space**: Select time slots
- **Escape**: Close modals/sheets

### 📱 Touch Interactions

**Mobile Gestures:**

- **Tap**: Select elements
- **Long Press**: Start drag operation
- **Swipe**: Navigate between periods
- **Pinch**: Zoom calendar views (future feature)

**Touch Optimization:**

- **Touch Targets**: Minimum 44px size
- **Gesture Support**: Native drag & drop
- **Responsive Layout**: Mobile-first design

## Performance Considerations

### 🚀 Data Loading

**Window-based Fetching:**

```typescript
interface FetchStrategy {
   day: { hours: 24; precision: '15min' };
   week: { days: 7; precision: '15min' };
   month: { days: 31; precision: 'day' };
}
```

**Lazy Loading:**

- **Initial Load**: Current view data only
- **On-demand**: Load adjacent periods
- **Background**: Prefetch next period

**Caching Strategy:**

- **Schedule Data**: Cache trong memory
- **Content Data**: Cache draft content
- **User Preferences**: Persist filters và settings

### 🎨 Rendering Optimization

**Virtual Scrolling:**

- **Day View**: Render visible hours only
- **Week View**: Render visible days only
- **Month View**: Render visible weeks only

**Component Memoization:**

- **Grid Cells**: Memoize time slot components
- **Schedule Items**: Memoize schedule displays
- **Draft Items**: Memoize content list items

**State Management:**

- **Local State**: Component-level state
- **Shared State**: Context providers
- **Persistence**: URL state cho navigation

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

**Calendar Navigation:**

- **Date Announcements**: Screen reader announces current date
- **Period Changes**: Announce view changes
- **Schedule Information**: Announce schedule details

**Drag & Drop:**

- **Alternative Actions**: Keyboard alternatives cho drag
- **Status Announcements**: Announce drag states
- **Drop Feedback**: Clear drop confirmation

**Form Accessibility:**

- **Label Associations**: Proper form labels
- **Error Messages**: Clear error descriptions
- **Validation Feedback**: Real-time validation

---

_Last Updated: 2025-01-02_
_Version: 1.0_
_Maintainer: Design Team_
