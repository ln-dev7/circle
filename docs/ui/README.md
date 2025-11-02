# AiM Platform - UI Documentation

## 📋 Tổng quan

Thư mục này chứa các UI guides chi tiết cho từng module của AiM Platform. Mỗi guide được thiết kế để đảm bảo consistency, accessibility, và user experience theo design system của chúng ta.

## 🎯 **DESIGN SYSTEM OVERVIEW**

**Foundation**: Lndev-UI design system
**Framework**: shadcn/ui components
**Styling**: Tailwind CSS 4
**Theme**: Light/Dark mode support
**Accessibility**: WCAG 2.1 AA compliance

## 📚 **UI GUIDES**

### **Core Modules**

- [**Authentication**](./auth.md) - Sign in, sign up, password reset flows
- [**Campaigns**](./campaigns.md) - Campaign management và collaboration
- [**Content Editor**](./content-editor.md) - Rich text editing với AI assistance
- [**Dashboards**](./dashboards.md) - Role-based analytics và monitoring
- [**Schedule**](./schedule.md) - Calendar và scheduling system

### **Upcoming Modules**

- **Assets** - Media library và file management
- **Analytics** - Data visualization và reporting
- **Settings** - User preferences và system configuration
- **Team Management** - User roles và permissions
- **Notifications** - Alert system và messaging

## 🎨 **DESIGN PRINCIPLES**

### **1. Consistency**

- **Component Library**: Unified shadcn/ui components
- **Spacing System**: Consistent 4px grid system
- **Color Palette**: Brand colors + semantic colors
- **Typography**: Clear hierarchy với readable fonts

### **2. Accessibility**

- **WCAG 2.1 AA**: Full compliance
- **Keyboard Navigation**: All functions accessible
- **Screen Reader Support**: ARIA labels và live regions
- **Color Independence**: Not relying on color alone

### **3. Responsiveness**

- **Mobile-First**: Design for mobile trước
- **Touch Optimization**: 44px minimum touch targets
- **Gesture Support**: Native touch gestures
- **Adaptive Layout**: Responsive grid systems

### **4. Performance**

- **Fast Loading**: < 2 second page load
- **Smooth Interactions**: 60fps animations
- **Efficient Rendering**: Component memoization
- **Lazy Loading**: Load content on demand

## 🔧 **COMPONENT ARCHITECTURE**

### **Base Components**

```typescript
// Core UI components từ shadcn/ui
Button, Input, Select, Badge, Card, Dialog, Sheet, etc.
```

### **Layout Components**

```typescript
// Layout và navigation
Header, Sidebar, Navigation, Breadcrumbs, Tabs, etc.
```

### **Data Components**

```typescript
// Data display và visualization
Table, Chart, Metric, Progress, Status, etc.
```

### **Form Components**

```typescript
// Form elements và validation
Form, Field, Validation, Error, Success, etc.
```

## 📱 **RESPONSIVE BREAKPOINTS**

```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### **Layout Adaptations**

- **Mobile**: Single column, stacked elements
- **Tablet**: Two column layout
- **Desktop**: Multi-column grid
- **Large**: Expanded sidebar, wide content

## 🎨 **VISUAL DESIGN**

### **Color System**

```css
/* Brand Colors */
primary: #0f172a    /* Dark blue */
secondary: #64748b  /* Gray */
accent: #3b82f6    /* Blue */

/* Semantic Colors */
success: #10b981   /* Green */
warning: #f59e0b   /* Amber */
error: #ef4444     /* Red */
info: #06b6d4      /* Cyan */
```

### **Typography Scale**

```css
/* Font Sizes */
text-xs: 0.75rem   /* 12px */
text-sm: 0.875rem  /* 14px */
text-base: 1rem    /* 16px */
text-lg: 1.125rem  /* 18px */
text-xl: 1.25rem   /* 20px */
text-2xl: 1.5rem   /* 24px */
text-3xl: 1.875rem /* 30px */
```

### **Spacing System**

```css
/* 4px Grid System */
space-1: 0.25rem   /* 4px */
space-2: 0.5rem    /* 8px */
space-3: 0.75rem   /* 12px */
space-4: 1rem      /* 16px */
space-6: 1.5rem    /* 24px */
space-8: 2rem      /* 32px */
```

## ♿ **ACCESSIBILITY STANDARDS**

### **WCAG 2.1 AA Requirements**

- **Contrast Ratio**: 4.5:1 minimum
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels và live regions
- **Focus Management**: Clear focus indicators
- **Error Handling**: Clear error messages

### **Implementation Guidelines**

- **Semantic HTML**: Proper heading hierarchy
- **ARIA Attributes**: Descriptive labels
- **Focus Order**: Logical tab sequence
- **Skip Links**: Jump to main content
- **Alternative Text**: Image descriptions

## 🚀 **PERFORMANCE GUIDELINES**

### **Loading Performance**

- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### **Optimization Techniques**

- **Code Splitting**: Route-based splitting
- **Lazy Loading**: Components và images
- **Image Optimization**: WebP format, responsive sizing
- **Caching**: Browser và CDN caching
- **Bundle Optimization**: Tree shaking, minification

## 🔄 **DEVELOPMENT WORKFLOW**

### **1. Design Phase**

- **Wireframes**: Low-fidelity layouts
- **Mockups**: High-fidelity designs
- **Prototypes**: Interactive prototypes
- **Design Review**: Stakeholder approval

### **2. Implementation Phase**

- **Component Creation**: Build reusable components
- **Layout Implementation**: Implement page layouts
- **Responsive Design**: Mobile-first development
- **Accessibility**: ARIA implementation

### **3. Testing Phase**

- **Visual Testing**: Design consistency
- **Responsive Testing**: Cross-device testing
- **Accessibility Testing**: Screen reader testing
- **Performance Testing**: Loading speed testing

### **4. Review Phase**

- **Design Review**: Visual consistency check
- **Code Review**: Implementation quality
- **Accessibility Review**: WCAG compliance
- **Performance Review**: Speed optimization

## 📝 **DOCUMENTATION STANDARDS**

### **Guide Structure**

Mỗi UI guide phải có:

- **Overview**: Module description và key features
- **Interface Components**: Component definitions
- **Layout Examples**: Visual layout structures
- **User Interactions**: Mouse, keyboard, touch
- **Performance**: Optimization guidelines
- **Accessibility**: WCAG compliance details

### **Code Examples**

- **TypeScript Interfaces**: Component definitions
- **Layout Diagrams**: ASCII art layouts
- **CSS Classes**: Tailwind utility classes
- **Component Props**: React component props

## 🔗 **RELATED DOCUMENTATION**

- [**Design System**](../design-system/) - Component library
- [**API Documentation**](../api/) - Backend integration
- [**Data Model**](../data-model.md) - Database schema
- [**Security Guidelines**](../SECURITY.md) - Security standards
- [**Performance Guidelines**](../playbooks/observability.md) - Performance optimization

## 🚨 **IMPORTANT NOTES**

### **Design Consistency**

- **MUST** follow established design patterns
- **MUST** use shadcn/ui components
- **MUST** maintain brand consistency
- **MUST** follow accessibility guidelines

### **Performance Requirements**

- **MUST** meet performance benchmarks
- **MUST** implement lazy loading
- **MUST** optimize bundle size
- **MUST** use efficient rendering

### **Accessibility Compliance**

- **MUST** meet WCAG 2.1 AA standards
- **MUST** support keyboard navigation
- **MUST** provide screen reader support
- **MUST** maintain high contrast ratios

---

_Last Updated: 2025-01-02_
_Maintainer: Design Team_
_Version: 1.0_
