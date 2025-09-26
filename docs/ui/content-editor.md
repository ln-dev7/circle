# Content Editor UI Guide

## 📋 Table of Contents

- [Overview](#overview)
- [Interface Components](#interface-components)
- [Editor Layout](#editor-layout)
- [Rich Text Features](#rich-text-features)
- [Content Management](#content-management)
- [AI Integration](#ai-integration)
- [User Interactions](#user-interactions)
- [Performance Considerations](#performance-considerations)
- [Accessibility](#accessibility)

## Overview

Content Editor UI là giao diện soạn thảo nội dung cho AiM Platform với rich text editor, AI assistance, và content management features. Interface hỗ trợ multiple content types, collaboration, và approval workflows.

### 🎯 Key Features

- **Rich Text Editor**: TipTap-based editor với advanced formatting
- **AI Assistance**: Content generation, translation, optimization
- **Content Management**: Draft saving, version control, collaboration
- **Multi-platform Support**: Social media, blog, email content
- **Responsive Design**: Mobile-friendly với touch optimization

## Interface Components

### 🎛️ Editor Header

```typescript
interface EditorHeader {
   title: Input; // Content title
   status: Badge; // Draft/Submitted/Approved
   platform: Select; // Platform selection
   campaign: Select; // Campaign assignment
   actions: {
      save: Button; // Save draft
      preview: Button; // Preview content
      submit: Button; // Submit for approval
      publish: Button; // Publish directly
   };
}
```

### 📝 Main Editor

```typescript
interface MainEditor {
   toolbar: EditorToolbar; // Formatting tools
   contentArea: ContentArea; // Main editing area
   wordCount: WordCounter; // Character/word count
   autoSave: AutoSave; // Auto-save indicator
}
```

### 🎨 Sidebar Panel

```typescript
interface EditorSidebar {
   tabs: {
      properties: Tab; // Content properties
      assets: Tab; // Media assets
      ai: Tab; // AI assistance
      history: Tab; // Version history
   };
   content: TabContent; // Tab-specific content
}
```

## Editor Layout

### 📱 Main Page Layout

**Page Structure:**

```
┌─────────────────────────────────────────────────────────┐
│ [← Back] Content Editor                    [Save] [Preview] │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Title: [Enter content title...]                    │ │
│ │ Platform: [Instagram] Campaign: [Summer Sale 2024] │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ [B] [I] [U] [Link] [Image] [List] [Quote] [Code] [AI] │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                     │
│ │ Start writing your content here...                 │
│ │                                                     │
│ │ You can use the toolbar above to format your text. │
│ │                                                     │
│ │ [AI Assistant] can help you generate ideas!        │
│ │                                                     │
│ └─────────────────────────────────────────────────────┘ │
│ Words: 45 | Characters: 234 | Auto-saved 2 min ago    │
├─────────────────────────────────────────────────────────┤
│ [Properties] [Assets] [AI] [History]                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Properties Tab Content                              │
│ │ • Content Type: Social Media Post                   │
│ │ • Target Audience: Young Professionals              │
│ │ • Tone: Professional but Friendly                  │
│ │ • Tags: #summer #sale #marketing                   │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Layout Sections:**

- **Header**: Title, platform, campaign, actions
- **Toolbar**: Formatting tools và AI assistance
- **Editor**: Main content area với rich text
- **Status Bar**: Word count, auto-save status
- **Sidebar**: Properties, assets, AI, history tabs

## Rich Text Features

### 🎨 Formatting Toolbar

**Toolbar Structure:**

```
[B] [I] [U] [S] | [H1] [H2] [H3] | [List] [Ordered] | [Quote] [Code] | [Link] [Image] [Video] | [AI] [Settings]
```

**Text Formatting:**

- **Bold**: `**Bold text**` - Strong emphasis
- **Italic**: `*Italic text*` - Light emphasis
- **Underline**: `<u>Underlined text</u>` - Additional emphasis
- **Strikethrough**: `~~Strikethrough text~~` - Removed content

**Heading Levels:**

- **H1**: Main section headings
- **H2**: Subsection headings
- **H3**: Sub-subsection headings

**List Types:**

- **Bullet List**: Unordered list items
- **Numbered List**: Ordered list items
- **Checklist**: Task completion items

**Special Elements:**

- **Quote**: Blockquote với citation
- **Code**: Inline code và code blocks
- **Link**: Hyperlinks với preview
- **Image**: Image insertion với alt text
- **Video**: Video embedding

### 📱 Content Types

**Social Media Posts:**

- **Instagram**: Image + caption (2200 chars)
- **Facebook**: Text + media (63,206 chars)
- **LinkedIn**: Professional content (3000 chars)
- **Twitter**: Short posts (280 chars)

**Blog Content:**

- **Headings**: H1, H2, H3 structure
- **Paragraphs**: Long-form content
- **Media**: Images, videos, embeds
- **SEO**: Meta descriptions, keywords

**Email Content:**

- **Subject Line**: Email subject
- **Body**: Rich text content
- **Signature**: Professional signature
- **CTA**: Call-to-action buttons

## Content Management

### 💾 Draft Management

**Auto-save Features:**

- **Frequency**: Every 30 seconds
- **Indicators**: "Auto-saved X min ago"
- **Recovery**: Restore from auto-save
- **Conflict Resolution**: Handle simultaneous saves

**Version Control:**

- **Draft Versions**: Save multiple versions
- **Change Tracking**: Track content changes
- **Revert Options**: Rollback to previous versions
- **Collaboration**: Multiple editors support

### 📋 Content Properties

**Metadata Fields:**

- **Content Type**: Post, article, email, etc.
- **Target Audience**: Demographics, interests
- **Tone**: Professional, casual, friendly, etc.
- **Tags**: Categorization và search
- **SEO**: Meta title, description, keywords

**Platform Settings:**

- **Character Limits**: Platform-specific limits
- **Media Requirements**: Image dimensions, formats
- **Hashtag Rules**: Platform hashtag guidelines
- **Posting Times**: Optimal posting schedules

## AI Integration

### 🤖 AI Assistant Panel

**AI Features:**

- **Content Generation**: Generate content ideas
- **Writing Assistance**: Improve writing quality
- **Translation**: Multi-language support
- **Optimization**: SEO và engagement optimization

**AI Tools:**

- **Content Ideas**: Generate topic suggestions
- **Writing Prompts**: Creative writing assistance
- **Grammar Check**: Spelling và grammar correction
- **Tone Adjustment**: Modify content tone
- **Length Optimization**: Adjust content length

### 🎯 AI Workflow

**Content Creation:**

1. **Input**: Topic, audience, tone
2. **Generation**: AI creates content draft
3. **Editing**: Human review và refinement
4. **Optimization**: AI suggests improvements
5. **Finalization**: Human approval và publishing

**AI Settings:**

- **Model Selection**: GPT-4, GPT-3.5, etc.
- **Creativity Level**: Conservative to creative
- **Language**: Target language selection
- **Style**: Formal, casual, technical, etc.

## User Interactions

### 🖱️ Mouse Interactions

**Click Actions:**

- **Toolbar**: Formatting tool selection
- **Content Area**: Text cursor placement
- **Sidebar**: Tab switching
- **Actions**: Save, preview, submit buttons

**Hover Effects:**

- **Toolbar Items**: Tool descriptions
- **Formatting**: Live preview of changes
- **Buttons**: Hover states và tooltips

**Drag & Drop:**

- **Media**: Drag images/videos into editor
- **Assets**: Drag from asset library
- **Text**: Drag text selections

### ⌨️ Keyboard Navigation

**Editor Shortcuts:**

- **Ctrl/Cmd + B**: Bold text
- **Ctrl/Cmd + I**: Italic text
- **Ctrl/Cmd + U**: Underline text
- **Ctrl/Cmd + K**: Insert link
- **Ctrl/Cmd + Shift + K**: Remove link
- **Ctrl/Cmd + S**: Save draft
- **Ctrl/Cmd + Enter**: Submit content

**Navigation:**

- **Tab**: Navigate between elements
- **Arrow Keys**: Move cursor
- **Home/End**: Beginning/end of line
- **Ctrl/Cmd + Home/End**: Beginning/end of document

### 📱 Touch Interactions

**Mobile Gestures:**

- **Tap**: Select elements
- **Long Press**: Show context menu
- **Double Tap**: Select word
- **Pinch**: Zoom content

**Touch Optimization:**

- **Touch Targets**: Minimum 44px size
- **Gesture Support**: Native touch gestures
- **Mobile Toolbar**: Touch-friendly toolbar layout

## Performance Considerations

### 🚀 Editor Performance

**Rendering Strategy:**

```typescript
interface EditorConfig {
   debounceDelay: 300; // Auto-save delay
   maxContentLength: 100000; // Maximum content size
   lazyLoading: true; // Load features on-demand
   virtualScrolling: true; // Large content handling
}
```

**Memory Management:**

- **Content Caching**: Cache recent content
- **Asset Optimization**: Compress images/videos
- **Garbage Collection**: Clean up unused resources
- **Memory Monitoring**: Track memory usage

**Auto-save Optimization:**

- **Debounced Saves**: Prevent excessive saves
- **Incremental Saves**: Save only changes
- **Background Processing**: Non-blocking saves
- **Conflict Resolution**: Handle simultaneous saves

### 🎨 Rendering Optimization

**Component Memoization:**

- **Toolbar Items**: Memoize formatting tools
- **Content Blocks**: Memoize content components
- **Sidebar Tabs**: Memoize tab content

**Content Rendering:**

- **Lazy Rendering**: Render visible content only
- **Virtual Scrolling**: Handle large documents
- **Progressive Loading**: Load content progressively

**State Management:**

- **Local State**: Component-level state
- **Shared State**: Editor context
- **Persistence**: Auto-save và recovery

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

**Editor Accessibility:**

- **Content Announcements**: Announce formatting changes
- **Tool Descriptions**: Clear tool descriptions
- **Error Messages**: Clear error descriptions

**AI Features:**

- **AI Status**: Announce AI processing status
- **Content Changes**: Announce AI-generated content
- **Suggestions**: Clear suggestion descriptions

**Content Management:**

- **Save Status**: Announce save status changes
- **Version Information**: Announce version changes
- **Collaboration**: Announce collaboration updates

---

_Last Updated: 2025-01-02_
_Version: 1.0_
_Maintainer: Design Team_
