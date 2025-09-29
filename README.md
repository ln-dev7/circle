# AiM Platform

**AI-powered Marketing Platform** - Hệ thống quản lý nội dung và chiến dịch marketing được hỗ trợ bởi AI.

## 🚀 Features

- **🎨 Content Creation**: AI-assisted content generation với approval workflow
- **📅 Smart Scheduling**: Multi-view calendar (Day/Week/Month) với drag & drop
- **📊 Campaign Management**: End-to-end campaign lifecycle management
- **🔐 Role-based Access**: Creator, Brand Owner, Admin roles với permissions
- **📱 Multi-platform**: Support Facebook, Instagram, Twitter, YouTube, LinkedIn, TikTok
- **📈 Analytics**: Event tracking và performance monitoring

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS 4
- **Backend**: Next.js API Routes, Prisma 6 ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js 5
- **State Management**: Zustand, React Query
- **AI Integration**: OpenAI API
- **File Storage**: UploadThing/S3

## 📚 Documentation

### 🏗️ Architecture & Design

- [**AiM Architecture**](./AiM_Architecture.md) - Overall system architecture và design decisions
- [**Product Specification**](./docs/SPEC.md) - Product features, user roles, và MVP scope
- [**Data Model**](./docs/data-model.md) - Database schema, entities, và relationships

### 🔌 API Reference

- [**Campaigns API**](./docs/api/campaigns.md) - Campaign management endpoints
- [**Content API**](./docs/api/content.md) - Content creation và management
- [**Schedules API**](./docs/api/schedules.md) - Content scheduling với timezone support
- [**Assets API**](./docs/api/assets.md) - File upload và management
- [**Analytics API**](./docs/api/analytics.md) - Event tracking và metrics

### 🎨 User Interface

- [**Schedule UI Guide**](./docs/ui/schedule.md) - Calendar interface, drag & drop, draft panel
- [**Design System**](./docs/ui/design-system.md) - Component library và design tokens

### 🔒 Security & Operations

- [**Security Guide**](./docs/SECURITY.md) - Authentication, authorization, data protection
- [**Contributing Guide**](./docs/CONTRIBUTING.md) - Development setup và contribution guidelines
- [**Rollback Playbook**](./docs/playbooks/rollback.md) - Emergency procedures và rollback steps
- [**Observability Guide**](./docs/playbooks/observability.md) - Monitoring, logging, alerting

### 📋 Development Tasks

- [**Task Templates**](./docs/tasks/) - PR templates và development guidelines
- [**Migration Plan**](./AiM_Migration_Plan_vi.md) - Technical migration roadmap

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- pnpm (recommended)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd aim-platform

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
pnpm db:generate
pnpm db:push
pnpm db:seed

# Start development server
pnpm dev
```

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/aim_db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AI Integration
OPENAI_API_KEY="your-openai-key"

# File Storage
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"
```

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

## 📁 Project Structure

```
aim-platform/
├── app/                    # Next.js App Router
│   ├── [orgId]/          # Organization-scoped routes
│   │   ├── schedule/     # Schedule management
│   │   ├── campaigns/    # Campaign management
│   │   ├── content/      # Content management
│   │   └── analytics/    # Analytics dashboard
│   ├── api/              # API routes
│   └── auth/             # Authentication pages
├── components/            # Reusable UI components
├── features/              # Feature-specific components
│   └── calendar/         # Schedule calendar components
├── lib/                   # Utility functions và configurations
├── prisma/                # Database schema và migrations
├── docs/                  # Documentation
└── tests/                 # Test files
```

## 🤝 Contributing

Please read our [Contributing Guide](./docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Workflow

1. Create feature branch từ `main`
2. Implement changes với tests
3. Update documentation nếu cần
4. Submit PR với detailed description
5. Code review và approval
6. Merge vào `main`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE.md) file for details.

## 🆘 Support

- **Documentation**: Check the [docs/](./docs/) directory
- **Issues**: Create GitHub issue với detailed description
- **Discussions**: Use GitHub Discussions cho questions và ideas

---

_Built with ❤️ by the AiM Team_
