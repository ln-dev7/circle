# Contributing to AiM Platform

## 📋 Table of Contents

- [Overview](#overview)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)

## Overview

Cảm ơn bạn đã quan tâm đến việc đóng góp cho AiM Platform! Document này sẽ hướng dẫn bạn cách setup development environment và contribute code một cách hiệu quả.

### What We're Building

AiM Platform là một AI-powered marketing platform cho phép Creators, Brand Owners, và Admins quản lý campaigns, tạo content với AI assistance, và track performance analytics.

### How to Contribute

- 🐛 **Bug Reports**: Report bugs và issues
- 💡 **Feature Requests**: Đề xuất tính năng mới
- 🔧 **Code Contributions**: Fix bugs, implement features
- 📚 **Documentation**: Improve docs và examples
- 🧪 **Testing**: Write tests và improve test coverage

## Development Setup

### 🛠️ Prerequisites

#### Required Software

- **Node.js**: Version 18.17+ (LTS recommended)
- **pnpm**: Version 8.0+ (faster than npm)
- **PostgreSQL**: Version 14+ (for database)
- **Git**: Version 2.30+

#### System Requirements

- **RAM**: Minimum 8GB, Recommended 16GB+
- **Storage**: 10GB+ free space
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

### 🚀 Quick Start

#### 1. Clone Repository

```bash
git clone https://github.com/your-org/aim-platform.git
cd aim-platform
```

#### 2. Install Dependencies

```bash
# Install pnpm if you haven't
npm install -g pnpm

# Install project dependencies
pnpm install
```

#### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# DATABASE_URL, NEXTAUTH_SECRET, etc.
```

#### 4. Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Push schema to database
pnpm prisma db push

# Seed database with sample data
pnpm db:seed
```

#### 5. Start Development Server

```bash
# Start development server
pnpm dev

# Open http://localhost:3000
```

### 🔧 Development Tools

#### VS Code Extensions (Recommended)

```json
{
   "recommendations": [
      "bradlc.vscode-tailwindcss",
      "esbenp.prettier-vscode",
      "ms-vscode.vscode-typescript-next",
      "prisma.prisma",
      "ms-vscode.vscode-json",
      "formulahendry.auto-rename-tag",
      "christian-kohler.path-intellisense"
   ]
}
```

#### Git Hooks (Automatic)

```bash
# Pre-commit hooks are automatically installed
# They will run linting and formatting before commits
```

## Development Workflow

### 🌿 Branch Strategy

#### Branch Naming Convention

```bash
# Feature branches
feature/description-of-feature
feature/user-authentication

# Bug fix branches
fix/description-of-bug
fix/login-validation-error

# Hotfix branches
hotfix/critical-security-fix

# Documentation branches
docs/update-api-documentation
```

#### Branch Workflow

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: add user authentication system"

# 3. Push branch and create PR
git push origin feature/your-feature-name
# Create Pull Request on GitHub
```

### 📝 Commit Message Convention

#### Conventional Commits Format

```bash
# Format: type(scope): description

# Examples:
feat(auth): add NextAuth.js integration
fix(api): resolve campaign creation validation error
docs(api): update campaigns API documentation
test(auth): add authentication test coverage
refactor(ui): simplify component structure
style(ui): fix button alignment issues
perf(api): optimize database queries
chore(deps): update dependencies to latest versions
```

#### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements

### 🔄 Pull Request Process

#### 1. Create Pull Request

- Fork repository (if external contributor)
- Create feature branch from main
- Make changes following coding standards
- Write tests for new functionality
- Update documentation if needed

#### 2. PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No console.log statements
- [ ] No sensitive data in logs
```

#### 3. Code Review Process

- **Automated Checks**: CI/CD pipeline runs tests
- **Peer Review**: At least one team member reviews
- **Address Feedback**: Make requested changes
- **Merge**: Once approved and all checks pass

## Code Standards

### 🎨 Code Style

#### TypeScript Guidelines

```typescript
// Use strict TypeScript
// tsconfig.json: "strict": true

// Prefer interfaces over types for objects
interface User {
   id: string;
   email: string;
   name: string;
}

// Use type for unions, intersections, etc.
type UserRole = 'admin' | 'creator' | 'brand_owner';
type UserWithRole = User & { role: UserRole };

// Prefer const assertions
const PERMISSIONS = {
   READ: 'read',
   WRITE: 'write',
} as const;

// Use proper error handling
try {
   const result = await riskyOperation();
   return result;
} catch (error) {
   logger.error('Operation failed', { error: error.message });
   throw new BusinessLogicError('Operation failed', error);
}
```

#### React Guidelines

```typescript
// Use functional components with hooks
export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <UserNotFound />;

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Use proper prop types
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

#### File Organization

```bash
# Component structure
components/
├── ui/                    # Reusable UI components
│   ├── button.tsx
│   ├── input.tsx
│   └── modal.tsx
├── forms/                 # Form components
│   ├── campaign-form.tsx
│   └── user-form.tsx
├── layout/                # Layout components
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── footer.tsx
└── features/              # Feature-specific components
    ├── campaigns/
    ├── content/
    └── analytics/

# API structure
app/api/
├── [orgId]/              # Organization-scoped APIs
│   ├── campaigns/
│   ├── content/
│   └── analytics/
├── auth/                  # Authentication APIs
└── health/                # Health check APIs
```

### 🔒 Security Guidelines

#### Input Validation

```typescript
// Always validate input data
import { z } from 'zod';

const createUserSchema = z.object({
   email: z.string().email('Invalid email format'),
   password: z.string().min(8, 'Password too short'),
   name: z.string().min(1, 'Name is required'),
});

export async function POST(request: NextRequest) {
   const body = await request.json();
   const validation = createUserSchema.safeParse(body);

   if (!validation.success) {
      return NextResponse.json(
         {
            error: 'E_VALIDATION',
            details: validation.error.errors,
         },
         { status: 400 }
      );
   }

   // Proceed with validated data
   const user = await createUser(validation.data);
   return NextResponse.json(user);
}
```

#### Authentication & Authorization

```typescript
// Always check permissions
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
   const session = await auth();
   if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   try {
      await requirePermission(session.user.id, 'campaign:delete');

      const campaign = await deleteCampaign(params.id);
      return NextResponse.json(campaign);
   } catch (error) {
      if (error instanceof PermissionError) {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      throw error;
   }
}
```

### 📚 Documentation Standards

#### Code Documentation

```typescript
/**
 * Creates a new campaign for the specified organization
 * @param data - Campaign creation data
 * @param userId - ID of the user creating the campaign
 * @param orgId - Organization ID
 * @returns Promise resolving to the created campaign
 * @throws {ValidationError} When campaign data is invalid
 * @throws {PermissionError} When user lacks required permissions
 */
export async function createCampaign(
   data: CreateCampaignRequest,
   userId: string,
   orgId: string
): Promise<Campaign> {
   // Implementation...
}
```

#### API Documentation

```typescript
/**
 * @api {post} /api/[orgId]/campaigns Create Campaign
 * @apiName CreateCampaign
 * @apiGroup Campaigns
 * @apiPermission campaign:create
 *
 * @apiParam {String} name Campaign name (required)
 * @apiParam {String} [description] Campaign description
 * @apiParam {Date} startDate Campaign start date
 * @apiParam {Date} endDate Campaign end date
 *
 * @apiSuccess {Campaign} campaign Created campaign object
 * @apiError {String} E_VALIDATION Validation error
 * @apiError {String} E_FORBIDDEN Insufficient permissions
 */
```

## Testing

### 🧪 Testing Strategy

#### Test Types

- **Unit Tests**: Individual functions và components
- **Integration Tests**: API endpoints và database operations
- **E2E Tests**: Complete user workflows
- **Performance Tests**: Load testing và optimization

#### Test Setup

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui
```

#### Writing Tests

```typescript
// Unit test example
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('should display user information', () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    };

    render(<UserProfile user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<UserProfile user={null} loading={true} />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});

// API test example
import { createMocks } from 'node-mocks-http';
import { GET } from './route';

describe('/api/campaigns', () => {
  it('should return campaigns for authenticated user', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        'authorization': 'Bearer valid-token'
      }
    });

    await GET(req, { params: { orgId: 'org-123' } });

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('campaigns');
  });
});
```

### 📊 Test Coverage

#### Coverage Requirements

- **Unit Tests**: Minimum 80% coverage
- **Critical Paths**: 100% coverage required
- **API Endpoints**: All endpoints must have tests
- **Components**: Core components must have tests

#### Coverage Report

```bash
# Generate coverage report
pnpm test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

## Pull Request Process

### 🔍 Pre-PR Checklist

#### Code Quality

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console.log statements
- [ ] No sensitive data in code
- [ ] Proper error handling implemented
- [ ] Input validation added

#### Documentation

- [ ] Code is properly documented
- [ ] API documentation updated
- [ ] README updated if needed
- [ ] Changelog updated

#### Testing

- [ ] Unit tests written
- [ ] Integration tests added
- [ ] E2E tests updated
- [ ] Test coverage adequate

### 📋 PR Review Process

#### Automated Checks

- **Linting**: ESLint và Prettier checks
- **Type Checking**: TypeScript compilation
- **Tests**: Unit và integration tests
- **Build**: Production build verification
- **Security**: Security vulnerability scan

#### Manual Review

- **Code Quality**: Readability và maintainability
- **Security**: Authentication, authorization, validation
- **Performance**: Efficient algorithms và queries
- **Testing**: Adequate test coverage
- **Documentation**: Clear và complete

#### Review Guidelines

```markdown
# Code Review Checklist

## Functionality

- [ ] Does the code do what it's supposed to do?
- [ ] Are edge cases handled?
- [ ] Is error handling appropriate?

## Code Quality

- [ ] Is the code readable and maintainable?
- [ ] Are there any code smells?
- [ ] Is the code following established patterns?

## Security

- [ ] Are inputs properly validated?
- [ ] Are permissions checked?
- [ ] Is sensitive data protected?

## Testing

- [ ] Are tests comprehensive?
- [ ] Do tests cover edge cases?
- [ ] Are tests maintainable?

## Documentation

- [ ] Is the code self-documenting?
- [ ] Are complex parts explained?
- [ ] Is API documentation updated?
```

### 🚀 Deployment Process

#### Staging Deployment

```bash
# Staging deployment is automatic on PR merge
# Tests must pass before deployment
# Manual approval required for production
```

#### Production Deployment

```bash
# Production deployment requires:
# 1. All tests passing
# 2. Code review approval
# 3. Security review approval
# 4. Manual deployment approval
```

## Getting Help

### 💬 Communication Channels

#### Development Team

- **Slack**: #aim-platform-dev
- **Email**: dev@aim-platform.com
- **GitHub Issues**: Bug reports và feature requests
- **GitHub Discussions**: General questions và discussions

#### Documentation

- **API Docs**: `/docs/api/`
- **Architecture**: `/docs/architecture.md`
- **Security**: `/docs/SECURITY.md`
- **Contributing**: This document

### 🆘 Common Issues

#### Setup Issues

```bash
# Database connection failed
# Check DATABASE_URL in .env
# Ensure PostgreSQL is running

# Dependencies installation failed
# Clear pnpm cache: pnpm store prune
# Delete node_modules and reinstall

# Build errors
# Check TypeScript errors: pnpm typecheck
# Verify all imports are correct
```

#### Development Issues

```bash
# Tests failing
# Run tests individually: pnpm test -- --testNamePattern="test name"
# Check test environment setup

# API endpoints not working
# Verify middleware configuration
# Check authentication setup
# Review API route handlers
```

---

_Last Updated: 2025-01-02_
_Version: 1.0_
_Maintainer: Development Team_
