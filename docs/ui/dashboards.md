# Dashboards UI Guide

## 📋 Table of Contents

- [Overview](#overview)
- [Interface Components](#interface-components)
- [Dashboard Layouts](#dashboard-layouts)
- [Widget System](#widget-system)
- [Data Visualization](#data-visualization)
- [User Interactions](#user-interactions)
- [Performance Considerations](#performance-considerations)
- [Accessibility](#accessibility)

## Overview

Dashboards UI là giao diện tổng quan và analytics cho AiM Platform với role-based dashboards, customizable widgets, và real-time data visualization. Interface hỗ trợ multiple user roles, data insights, và performance monitoring.

### 🎯 Key Features

- **Role-Based Dashboards**: Creator, Brand Owner, Admin views
- **Customizable Widgets**: Drag & drop widget management
- **Real-Time Data**: Live updates và performance metrics
- **Data Visualization**: Charts, graphs, và analytics
- **Responsive Design**: Mobile-friendly với touch optimization

## Interface Components

### 🎛️ Dashboard Header

```typescript
interface DashboardHeader {
   title: string; // Dashboard title
   periodSelector: Select; // Time period selection
   refreshButton: Button; // Manual refresh
   settingsButton: Button; // Dashboard settings
   userInfo: UserInfo; // Current user context
}
```

### 📊 Widget Grid

```typescript
interface WidgetGrid {
   layout: GridLayout; // CSS Grid layout
   widgets: Widget[]; // Dashboard widgets
   emptyState: EmptyState; // No widgets message
   loadingState: LoadingState; // Loading skeleton
}
```

### 🎨 Widget Components

```typescript
interface Widget {
   header: {
      title: string; // Widget title
      menu: DropdownMenu; // Widget actions
      refresh: Button; // Refresh data
   };
   content: WidgetContent; // Widget-specific content
   footer?: WidgetFooter; // Additional information
   resize: ResizeHandle; // Resize controls
}
```

## Dashboard Layouts

### 📱 Creator Dashboard

**Layout Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ Creator Dashboard                    [7D] [30D] [90D]  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│ │ 📝 Active       │ │ 📊 Draft        │ │ ⏰ Scheduled │ │
│ │ Campaigns       │ │ Content         │ │ Posts       │ │
│ │ 5 campaigns     │ │ 12 items        │ │ 8 posts     │ │
│ └─────────────────┘ └─────────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📈 Content Performance (Last 30 Days)              │ │
│ │ [Line Chart: Engagement over time]                 │ │
│ │ • Total Reach: 45.2K                               │ │
│ │ • Total Clicks: 2.1K                               │ │
│ │ • Avg. Engagement: 4.7%                            │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│ │ 🎯 AI           │ │ 📱 Recent       │ │ 🏆 Top      │ │
│ │ Suggestions     │ │ Performance     │ │ Performing  │ │
│ │ 3 new ideas     │ │ Posts           │ │ Content     │ │
│ └─────────────────┘ └─────────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Widgets:**

- **Campaign Overview**: Active campaigns count
- **Content Status**: Draft, scheduled, published counts
- **Performance Charts**: Engagement metrics
- **AI Suggestions**: Content ideas và optimization
- **Recent Activity**: Latest posts và performance

### 📱 Brand Owner Dashboard

**Layout Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ Brand Owner Dashboard                [7D] [30D] [90D]  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│ │ 💰 Budget       │ │ 📊 ROI          │ │ 👥 Team     │ │
│ │ Status          │ │ Performance     │ │ Performance │ │
│ │ $8,500/$10,000 │ │ 156%            │ │ 4 creators  │ │
│ └─────────────────┘ └─────────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📈 Campaign Performance Overview                   │ │
│ │ [Bar Chart: Campaign metrics]                      │ │
│ │ • Summer Sale: 25.3K reach, 3.2K clicks           │ │
│ │ • Q4 Launch: 18.7K reach, 2.1K clicks             │ │
│ │ • Brand Awareness: 12.4K reach, 1.8K clicks       │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│ │ ⏳ Approval     │ │ 🎯 Creator      │ │ 📱 Platform │ │
│ │ Queue           │ │ Leaderboard     │ │ Performance │ │
│ │ 7 pending       │ │ Top performers  │ │ Best channels│
│ └─────────────────┘ └─────────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Widgets:**

- **Financial Metrics**: Budget, ROI, spending
- **Campaign Overview**: Performance summaries
- **Approval Queue**: Content pending approval
- **Team Performance**: Creator metrics
- **Platform Insights**: Channel performance

### 📱 Admin Dashboard

**Layout Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ Admin Dashboard                       [7D] [30D] [90D] │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│ │ 👥 Total        │ │ 🚀 System       │ │ 📊 API      │ │
│ │ Users           │ │ Health          │ │ Usage       │ │
│ │ 156 users       │ │ 99.9% uptime    │ │ 2.3M calls  │ │
│ └─────────────────┘ └─────────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 📈 System Performance Metrics                      │ │
│ │ [Line Chart: Response times, errors]               │ │
│ │ • Avg Response Time: 145ms                         │ │
│ │ • Error Rate: 0.02%                                │ │
│ │ • Active Sessions: 89                              │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│ │ 🔐 Security    │ │ 📝 Recent       │ │ ⚙️ Feature  │ │
│ │ Alerts          │ │ Activity        │ │ Flags       │ │
│ │ 2 warnings      │ │ User actions    │ │ Toggle      │ │
│ └─────────────────┘ └─────────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Key Widgets:**

- **System Metrics**: Users, health, performance
- **Security Monitoring**: Alerts và threats
- **Activity Logs**: User actions và system events
- **Feature Management**: Feature flags và settings
- **API Monitoring**: Usage và performance

## Widget System

### 🎨 Widget Types

**Metric Widgets:**

- **Number Display**: Single metric với trend
- **Progress Bar**: Progress towards goal
- **Status Indicator**: Current status với color coding
- **Comparison**: Current vs previous period

**Chart Widgets:**

- **Line Chart**: Time-series data
- **Bar Chart**: Categorical comparisons
- **Pie Chart**: Distribution data
- **Heatmap**: Time-based patterns
- **Gauge**: Progress towards target

**Content Widgets:**

- **List Display**: Recent items với actions
- **Table View**: Tabular data với sorting
- **Card Grid**: Visual content display
- **Timeline**: Chronological events

### 🔧 Widget Configuration

**Widget Settings:**

- **Data Source**: API endpoint, database query
- **Refresh Rate**: Auto-refresh interval
- **Size**: Small, medium, large, custom
- **Position**: Grid coordinates
- **Styling**: Colors, themes, borders

**Widget Actions:**

- **Refresh**: Manual data refresh
- **Configure**: Edit widget settings
- **Duplicate**: Copy widget
- **Remove**: Delete widget
- **Export**: Download data

## Data Visualization

### 📊 Chart Components

**Line Charts:**

- **Time Series**: Date/time on X-axis
- **Trend Lines**: Moving averages, forecasts
- **Annotations**: Important events, milestones
- **Zoom**: Pan và zoom functionality

**Bar Charts:**

- **Grouped Bars**: Multiple series
- **Stacked Bars**: Cumulative values
- **Horizontal Bars**: Long labels
- **Error Bars**: Confidence intervals

**Pie Charts:**

- **Donut Charts**: Center space for totals
- **Exploded Slices**: Highlight segments
- **Labels**: Inside/outside positioning
- **Colors**: Consistent color schemes

### 🎨 Visual Design

**Color Schemes:**

- **Brand Colors**: Primary, secondary, accent
- **Semantic Colors**: Success, warning, error
- **Accessibility**: High contrast ratios
- **Consistency**: Unified color palette

**Typography:**

- **Headers**: Clear hierarchy
- **Labels**: Readable font sizes
- **Numbers**: Monospace for alignment
- **Legends**: Descriptive text

## User Interactions

### 🖱️ Mouse Interactions

**Click Actions:**

- **Widget Selection**: Click to select widget
- **Data Points**: Click chart elements
- **Menu Items**: Dropdown menu selection
- **Navigation**: Widget navigation

**Hover Effects:**

- **Data Tooltips**: Show detailed information
- **Widget Highlight**: Focus on hovered widget
- **Interactive Elements**: Button hover states

**Drag & Drop:**

- **Widget Movement**: Reposition widgets
- **Widget Resizing**: Resize widget dimensions
- **Widget Reordering**: Change widget order

### ⌨️ Keyboard Navigation

**Tab Order:**

1. Dashboard header
2. Period selector
3. Widget grid
4. Individual widgets
5. Widget actions

**Keyboard Shortcuts:**

- **Tab**: Navigate between elements
- **Arrow Keys**: Navigate widgets
- **Enter**: Activate selected element
- **Space**: Toggle selections
- **Escape**: Close modals/menus

### 📱 Touch Interactions

**Mobile Gestures:**

- **Tap**: Select elements
- **Long Press**: Show context menu
- **Swipe**: Navigate between dashboards
- **Pinch**: Zoom charts

**Touch Optimization:**

- **Touch Targets**: Minimum 44px size
- **Gesture Support**: Native touch gestures
- **Mobile Layout**: Responsive grid system

## Performance Considerations

### 🚀 Data Loading

**Loading Strategy:**

```typescript
interface LoadingConfig {
   initialLoad: 'skeleton' | 'spinner'; // Loading state
   refreshInterval: number; // Auto-refresh (ms)
   lazyLoading: boolean; // Load on demand
   caching: boolean; // Cache data
}
```

**Data Fetching:**

- **Parallel Requests**: Multiple widgets simultaneously
- **Request Batching**: Group similar requests
- **Error Handling**: Graceful degradation
- **Retry Logic**: Automatic retry on failure

**Caching Strategy:**

- **Memory Cache**: Store recent data
- **Local Storage**: Persist user preferences
- **Cache Invalidation**: Smart cache updates
- **Background Sync**: Update data in background

### 🎨 Rendering Optimization

**Widget Rendering:**

- **Lazy Loading**: Render visible widgets only
- **Virtual Scrolling**: Handle many widgets
- **Component Memoization**: Prevent unnecessary re-renders
- **Debounced Updates**: Limit update frequency

**Chart Performance:**

- **Data Sampling**: Reduce data points for large datasets
- **Progressive Rendering**: Render charts progressively
- **Canvas vs SVG**: Choose based on data size
- **Animation Optimization**: Smooth 60fps animations

**State Management:**

- **Local State**: Widget-specific state
- **Shared State**: Dashboard context
- **Persistence**: Save user preferences

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

**Chart Accessibility:**

- **Data Descriptions**: Screen reader announces data
- **Keyboard Navigation**: Navigate chart elements
- **Alternative Text**: Describe chart content

**Widget Accessibility:**

- **Widget Announcements**: Announce widget updates
- **Action Descriptions**: Clear button descriptions
- **Status Information**: Announce status changes

**Dashboard Navigation:**

- **Landmark Regions**: Clear page structure
- **Heading Hierarchy**: Logical content organization
- **Progress Indicators**: Show loading progress

---

_Last Updated: 2025-01-02_
_Version: 1.0_
_Maintainer: Design Team_
