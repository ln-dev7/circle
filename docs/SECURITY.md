# Security Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Authorization & RBAC](#authorization--rbac)
- [Input Validation](#input-validation)
- [Data Protection](#data-protection)
- [API Security](#api-security)
- [Infrastructure Security](#infrastructure-security)
- [Security Best Practices](#security-best-practices)

## Overview

Security là top priority cho AiM Platform. Document này cover tất cả security measures, từ authentication và authorization đến data protection và infrastructure security.

### Security Principles

1. **Defense in Depth**: Multiple layers of security
2. **Least Privilege**: Users chỉ có access cần thiết
3. **Zero Trust**: Verify everything, trust nothing
4. **Security by Design**: Security built into every layer
5. **Regular Audits**: Continuous security assessment

## Authentication

### 🔐 NextAuth.js Implementation

#### Configuration

```typescript
// lib/auth.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
   adapter: PrismaAdapter(prisma),
   session: {
      strategy: 'jwt',
      maxAge: 24 * 60 * 60, // 24 hours
   },
   providers: [
      CredentialsProvider({
         name: 'credentials',
         credentials: {
            email: { label: 'Email', type: 'email' },
            password: { label: 'Password', type: 'password' },
         },
         async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
               return null;
            }

            const user = await prisma.user.findUnique({
               where: { email: credentials.email },
               include: { memberships: true },
            });

            if (!user || !user.password) {
               return null;
            }

            const isValidPassword = await bcrypt.compare(credentials.password, user.password);

            if (!isValidPassword) {
               return null;
            }

            return {
               id: user.id,
               email: user.email,
               name: user.name,
               role: user.memberships[0]?.role || 'CREATOR',
            };
         },
      }),
   ],
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token.role = user.role;
            token.organizationId = user.organizationId;
         }
         return token;
      },
      async session({ session, token }) {
         if (token) {
            session.user.id = token.sub!;
            session.user.role = token.role;
            session.user.organizationId = token.organizationId;
         }
         return session;
      },
   },
   pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
   },
});
```

#### Password Security

```typescript
// lib/auth-utils.ts
import bcrypt from 'bcryptjs';

export const PASSWORD_REQUIREMENTS = {
   minLength: 8,
   requireUppercase: true,
   requireLowercase: true,
   requireNumbers: true,
   requireSpecialChars: true,
};

export function validatePassword(password: string): boolean {
   const hasMinLength = password.length >= PASSWORD_REQUIREMENTS.minLength;
   const hasUppercase = /[A-Z]/.test(password);
   const hasLowercase = /[a-z]/.test(password);
   const hasNumbers = /\d/.test(password);
   const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

   return hasMinLength && hasUppercase && hasLowercase && hasNumbers && hasSpecialChars;
}

export async function hashPassword(password: string): Promise<string> {
   const saltRounds = 12;
   return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
   return bcrypt.compare(password, hash);
}
```

### 🚪 Session Management

#### Session Security

```typescript
// Session configuration
export const SESSION_CONFIG = {
   maxAge: 24 * 60 * 60, // 24 hours
   updateAge: 60 * 60, // 1 hour
   secure: process.env.NODE_ENV === 'production',
   httpOnly: true,
   sameSite: 'lax' as const,
   path: '/',
};

// Session validation middleware
export function validateSession(session: any): boolean {
   if (!session?.user?.id) return false;
   if (!session?.user?.email) return false;
   if (!session?.user?.role) return false;

   const validRoles = ['ADMIN', 'BRAND_OWNER', 'CREATOR'];
   if (!validRoles.includes(session.user.role)) return false;

   return true;
}
```

## Authorization & RBAC

### 🔒 Role-Based Access Control

#### Permission System

```typescript
// lib/rbac.ts
export const PERMISSIONS = {
   // Campaign permissions
   CAMPAIGN_CREATE: 'campaign:create',
   CAMPAIGN_READ: 'campaign:read',
   CAMPAIGN_UPDATE: 'campaign:update',
   CAMPAIGN_DELETE: 'campaign:delete',

   // Content permissions
   CONTENT_CREATE: 'content:create',
   CONTENT_READ: 'content:read',
   CONTENT_UPDATE: 'content:update',
   CONTENT_DELETE: 'content:delete',
   CONTENT_APPROVE: 'content:approve',

   // User management
   USER_READ: 'user:read',
   USER_CREATE: 'user:create',
   USER_UPDATE: 'user:update',
   USER_DELETE: 'user:delete',

   // Organization management
   ORG_READ: 'org:read',
   ORG_UPDATE: 'org:update',
   ORG_DELETE: 'org:delete',

   // Analytics
   ANALYTICS_READ: 'analytics:read',
   ANALYTICS_EXPORT: 'analytics:export',
} as const;

export const ROLE_PERMISSIONS = {
   CREATOR: [
      PERMISSIONS.CAMPAIGN_READ,
      PERMISSIONS.CONTENT_CREATE,
      PERMISSIONS.CONTENT_READ,
      PERMISSIONS.CONTENT_UPDATE,
      PERMISSIONS.CONTENT_DELETE,
      PERMISSIONS.ANALYTICS_READ,
   ],
   BRAND_OWNER: [
      PERMISSIONS.CAMPAIGN_CREATE,
      PERMISSIONS.CAMPAIGN_READ,
      PERMISSIONS.CAMPAIGN_UPDATE,
      PERMISSIONS.CAMPAIGN_DELETE,
      PERMISSIONS.CONTENT_CREATE,
      PERMISSIONS.CONTENT_READ,
      PERMISSIONS.CONTENT_UPDATE,
      PERMISSIONS.CONTENT_DELETE,
      PERMISSIONS.CONTENT_APPROVE,
      PERMISSIONS.USER_READ,
      PERMISSIONS.ANALYTICS_READ,
      PERMISSIONS.ANALYTICS_EXPORT,
   ],
   ADMIN: [...Object.values(PERMISSIONS)],
} as const;
```

#### Permission Checking

```typescript
// lib/permissions.ts
export async function hasPermission(
   userId: string,
   orgId: string,
   permission: string
): Promise<boolean> {
   const membership = await prisma.membership.findFirst({
      where: {
         userId,
         organizationId: orgId,
      },
   });

   if (!membership) return false;

   const userPermissions = ROLE_PERMISSIONS[membership.role] || [];
   return userPermissions.includes(permission as any);
}

export async function requirePermission(
   userId: string,
   orgId: string,
   permission: string
): Promise<void> {
   const hasAccess = await hasPermission(userId, orgId, permission);

   if (!hasAccess) {
      throw new PermissionError(`Insufficient permissions: ${permission}`, userId, permission);
   }
}

// Usage in API routes
export async function GET(request: NextRequest, { params }: { params: { orgId: string } }) {
   const session = await auth();
   if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   try {
      await requirePermission(session.user.id, params.orgId, PERMISSIONS.CAMPAIGN_READ);

      // Proceed with operation
      const campaigns = await prisma.campaign.findMany({
         where: { organizationId: params.orgId },
      });

      return NextResponse.json(campaigns);
   } catch (error) {
      if (error instanceof PermissionError) {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      throw error;
   }
}
```

### 🛡️ Route Protection

#### Middleware Protection

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
   const session = await auth();

   // Public routes
   const publicRoutes = ['/auth/signin', '/auth/signup', '/api/health'];
   if (publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
      return NextResponse.next();
   }

   // API routes protection
   if (request.nextUrl.pathname.startsWith('/api/')) {
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Organization-scoped API protection
      if (request.nextUrl.pathname.startsWith('/api/')) {
         const orgId = request.nextUrl.pathname.split('/')[2];
         if (orgId && orgId !== '[orgId]') {
            const hasAccess = await hasOrganizationAccess(session.user.id, orgId);
            if (!hasAccess) {
               return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
         }
      }
   }

   // Page routes protection
   if (request.nextUrl.pathname.startsWith('/dashboard/')) {
      if (!session?.user?.id) {
         return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
   }

   return NextResponse.next();
}

export const config = {
   matcher: [
      '/api/:path*',
      '/dashboard/:path*',
      '/campaigns/:path*',
      '/content/:path*',
      '/assets/:path*',
      '/analytics/:path*',
   ],
};
```

## Input Validation

### ✅ Zod Schema Validation

#### Request Validation

```typescript
// lib/schemas.ts
import { z } from 'zod';

export const createCampaignSchema = z
   .object({
      name: z
         .string()
         .min(1, 'Campaign name is required')
         .max(100, 'Campaign name must be less than 100 characters')
         .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Campaign name contains invalid characters'),
      description: z.string().max(500, 'Description must be less than 500 characters').optional(),
      startDate: z
         .string()
         .datetime('Invalid start date format')
         .refine((date) => new Date(date) > new Date(), 'Start date must be in the future'),
      endDate: z.string().datetime('Invalid end date format'),
      budget: z
         .number()
         .positive('Budget must be positive')
         .max(1000000, 'Budget cannot exceed 1,000,000'),
   })
   .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
      message: 'End date must be after start date',
      path: ['endDate'],
   });

export const createContentSchema = z.object({
   title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
   body: z.string().max(10000, 'Content body must be less than 10,000 characters').optional(),
   campaignId: z.string().cuid('Invalid campaign ID'),
   type: z.enum(['post', 'video', 'image', 'story'], {
      errorMap: () => ({ message: 'Invalid content type' }),
   }),
});

export const uploadAssetSchema = z.object({
   name: z
      .string()
      .min(1, 'Asset name is required')
      .max(100, 'Asset name must be less than 100 characters'),
   description: z.string().max(500, 'Description must be less than 500 characters').optional(),
   tags: z.array(z.string()).max(20, 'Maximum 20 tags allowed').optional(),
   contentId: z.string().cuid('Invalid content ID').optional(),
});
```

#### Validation Middleware

```typescript
// lib/validation.ts
import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';

export function validateRequest<T>(
   schema: ZodSchema<T>,
   data: any
): { success: true; data: T } | { success: false; errors: string[] } {
   try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
   } catch (error) {
      if (error instanceof z.ZodError) {
         const errors = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
         return { success: false, errors };
      }
      return { success: false, errors: ['Validation failed'] };
   }
}

// Usage in API routes
export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const validation = validateRequest(createCampaignSchema, body);

      if (!validation.success) {
         return NextResponse.json(
            {
               error: 'E_VALIDATION',
               message: 'Validation failed',
               details: validation.errors,
            },
            { status: 400 }
         );
      }

      const campaign = await prisma.campaign.create({
         data: validation.data,
      });

      return NextResponse.json(campaign, { status: 201 });
   } catch (error) {
      return NextResponse.json(
         {
            error: 'E_INTERNAL_ERROR',
            message: 'Internal server error',
         },
         { status: 500 }
      );
   }
}
```

### 🚫 Input Sanitization

#### XSS Prevention

```typescript
// lib/sanitization.ts
import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
   return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'target'],
      ALLOWED_URI_REGEXP:
         /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
   });
}

export function sanitizeText(text: string): string {
   return text
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
}

export function sanitizeFilename(filename: string): string {
   return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace invalid chars with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
}
```

## Data Protection

### 🔒 Data Encryption

#### Sensitive Data Encryption

```typescript
// lib/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string): { encryptedData: string; iv: string; authTag: string } {
   const iv = crypto.randomBytes(16);
   const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY, iv);

   let encrypted = cipher.update(text, 'utf8', 'hex');
   encrypted += cipher.final('hex');

   const authTag = cipher.getAuthTag();

   return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
   };
}

export function decrypt(encryptedData: string, iv: string, authTag: string): string {
   const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY, Buffer.from(iv, 'hex'));
   decipher.setAuthTag(Buffer.from(authTag, 'hex'));

   let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
   decrypted += decipher.final('utf8');

   return decrypted;
}

// Usage for sensitive fields
export async function createUserWithEncryptedData(data: CreateUserRequest) {
   const encryptedPassword = encrypt(data.password);

   return prisma.user.create({
      data: {
         ...data,
         password: encryptedPassword.encryptedData,
         passwordIv: encryptedPassword.iv,
         passwordAuthTag: encryptedPassword.authTag,
      },
   });
}
```

#### Database Field Encryption

```typescript
// prisma/schema.prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // Encrypted password
  passwordIv    String    // Initialization vector
  passwordAuthTag String  // Authentication tag
  // ... other fields
}
```

### 🚫 PII Protection

#### PII Detection & Masking

```typescript
// lib/pii-protection.ts
export const PII_PATTERNS = {
   email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
   phone: /\b(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b/g,
   ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
   creditCard: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
};

export function maskPII(text: string): string {
   let maskedText = text;

   // Mask email addresses
   maskedText = maskedText.replace(PII_PATTERNS.email, (match) => {
      const [local, domain] = match.split('@');
      return `${local.charAt(0)}***@${domain}`;
   });

   // Mask phone numbers
   maskedText = maskedText.replace(PII_PATTERNS.phone, '***-***-****');

   // Mask SSN
   maskedText = maskedText.replace(PII_PATTERNS.ssn, '***-**-****');

   // Mask credit card numbers
   maskedText = maskedText.replace(PII_PATTERNS.creditCard, '****-****-****-****');

   return maskedText;
}

// Log PII-safe messages
export function logSafe(message: string, data: any): void {
   const safeData = JSON.parse(JSON.stringify(data), (key, value) => {
      if (typeof value === 'string') {
         return maskPII(value);
      }
      return value;
   });

   logger.info(message, safeData);
}
```

## API Security

### 🛡️ Rate Limiting

#### Rate Limiting Implementation

```typescript
// lib/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
   windowMs: number;
   maxRequests: number;
   keyGenerator: (req: NextRequest) => string;
}

export class RateLimiter {
   private requests = new Map<string, { count: number; resetTime: number }>();

   constructor(private config: RateLimitConfig) {}

   isAllowed(req: NextRequest): boolean {
      const key = this.config.keyGenerator(req);
      const now = Date.now();

      if (!this.requests.has(key)) {
         this.requests.set(key, { count: 1, resetTime: now + this.config.windowMs });
         return true;
      }

      const record = this.requests.get(key)!;

      if (now > record.resetTime) {
         record.count = 1;
         record.resetTime = now + this.config.windowMs;
         return true;
      }

      if (record.count >= this.config.maxRequests) {
         return false;
      }

      record.count++;
      return true;
   }

   getRemaining(req: NextRequest): number {
      const key = this.config.keyGenerator(req);
      const record = this.requests.get(key);

      if (!record) return this.config.maxRequests;

      const now = Date.now();
      if (now > record.resetTime) return this.config.maxRequests;

      return Math.max(0, this.config.maxRequests - record.count);
   }
}

// Rate limiting middleware
export function createRateLimitMiddleware(config: RateLimitConfig) {
   const limiter = new RateLimiter(config);

   return function rateLimitMiddleware(req: NextRequest) {
      if (!limiter.isAllowed(req)) {
         const remaining = limiter.getRemaining(req);
         const resetTime = new Date(Date.now() + config.windowMs);

         return NextResponse.json(
            {
               error: 'E_RATE_LIMIT',
               message: 'Too many requests',
               retryAfter: resetTime.toISOString(),
            },
            {
               status: 429,
               headers: {
                  'X-RateLimit-Remaining': remaining.toString(),
                  'X-RateLimit-Reset': resetTime.toISOString(),
                  'Retry-After': Math.ceil(config.windowMs / 1000).toString(),
               },
            }
         );
      }

      return NextResponse.next();
   };
}

// Usage
export const apiRateLimit = createRateLimitMiddleware({
   windowMs: 15 * 60 * 1000, // 15 minutes
   maxRequests: 100, // 100 requests per window
   keyGenerator: (req) => {
      // Rate limit by IP and user ID if available
      const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
      const userId = req.headers.get('x-user-id') || 'anonymous';
      return `${ip}:${userId}`;
   },
});
```

### 🔐 API Key Security

#### API Key Management

```typescript
// lib/api-keys.ts
export interface APIKey {
   id: string;
   name: string;
   key: string;
   userId: string;
   organizationId: string;
   permissions: string[];
   expiresAt?: Date;
   lastUsed?: Date;
   createdAt: Date;
}

export async function validateAPIKey(key: string): Promise<APIKey | null> {
   const apiKey = await prisma.apiKey.findUnique({
      where: { key },
      include: { user: true },
   });

   if (!apiKey) return null;

   // Check expiration
   if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return null;
   }

   // Update last used
   await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsed: new Date() },
   });

   return apiKey;
}

export async function requireAPIKey(req: NextRequest): Promise<APIKey> {
   const authHeader = req.headers.get('authorization');

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('API key required');
   }

   const key = authHeader.substring(7);
   const apiKey = await validateAPIKey(key);

   if (!apiKey) {
      throw new Error('Invalid API key');
   }

   return apiKey;
}
```

## Infrastructure Security

### 🔒 Environment Security

#### Environment Variables

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
   NODE_ENV: z.enum(['development', 'production', 'test']),
   DATABASE_URL: z.string().url(),
   NEXTAUTH_SECRET: z.string().min(32),
   NEXTAUTH_URL: z.string().url(),
   OPENAI_API_KEY: z.string().min(1),
   UPLOADTHING_SECRET: z.string().min(1),
   UPLOADTHING_APP_ID: z.string().min(1),
   ENCRYPTION_KEY: z.string().length(32),
   REDIS_URL: z.string().url().optional(),
   SENTRY_DSN: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);

// Validate required environment variables
export function validateEnvironment(): void {
   const missingVars = [];

   for (const [key, value] of Object.entries(env)) {
      if (!value) {
         missingVars.push(key);
      }
   }

   if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
   }
}
```

#### Secrets Management

```typescript
// lib/secrets.ts
export class SecretsManager {
   private static instance: SecretsManager;
   private secrets: Map<string, string> = new Map();

   private constructor() {}

   static getInstance(): SecretsManager {
      if (!SecretsManager.instance) {
         SecretsManager.instance = new SecretsManager();
      }
      return SecretsManager.instance;
   }

   setSecret(key: string, value: string): void {
      this.secrets.set(key, value);
   }

   getSecret(key: string): string | undefined {
      return this.secrets.get(key);
   }

   hasSecret(key: string): boolean {
      return this.secrets.has(key);
   }

   rotateSecret(key: string): string {
      const newValue = this.generateSecureSecret();
      this.secrets.set(key, newValue);
      return newValue;
   }

   private generateSecureSecret(): string {
      return crypto.randomBytes(32).toString('hex');
   }
}
```

### 🚫 Security Headers

#### Security Headers Middleware

```typescript
// middleware.ts
export function securityHeaders(response: NextResponse): NextResponse {
   // Security headers
   response.headers.set('X-Content-Type-Options', 'nosniff');
   response.headers.set('X-Frame-Options', 'DENY');
   response.headers.set('X-XSS-Protection', '1; mode=block');
   response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
   response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

   // Content Security Policy
   const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-src 'none'",
      "object-src 'none'",
   ].join('; ');

   response.headers.set('Content-Security-Policy', csp);

   // HSTS (HTTP Strict Transport Security)
   if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
   }

   return response;
}
```

## Security Best Practices

### 🔒 Development Security

#### Code Security Guidelines

1. **Never log sensitive data**: Passwords, tokens, PII
2. **Use parameterized queries**: Prevent SQL injection
3. **Validate all inputs**: Client and server-side validation
4. **Implement proper error handling**: Don't expose system details
5. **Use HTTPS in production**: Encrypt all communications
6. **Regular security updates**: Keep dependencies updated
7. **Security code reviews**: Review all security-related code

#### Security Testing

```typescript
// tests/security.test.ts
describe('Security Tests', () => {
   test('should not expose sensitive data in error messages', async () => {
      const response = await request(app).get('/api/users/invalid-id').expect(404);

      expect(response.body.error).not.toContain('password');
      expect(response.body.error).not.toContain('token');
   });

   test('should validate input data', async () => {
      const response = await request(app)
         .post('/api/campaigns')
         .send({ name: '<script>alert("xss")</script>' })
         .expect(400);

      expect(response.body.error).toBe('E_VALIDATION');
   });

   test('should enforce rate limiting', async () => {
      const requests = Array(101)
         .fill(null)
         .map(() => request(app).get('/api/campaigns'));

      const responses = await Promise.all(requests);
      const rateLimited = responses.filter((r) => r.status === 429);

      expect(rateLimited.length).toBeGreaterThan(0);
   });
});
```

### 📊 Security Monitoring

#### Security Event Logging

```typescript
// lib/security-monitoring.ts
export interface SecurityEvent {
   type:
      | 'authentication_failure'
      | 'permission_denied'
      | 'rate_limit_exceeded'
      | 'suspicious_activity';
   userId?: string;
   ipAddress: string;
   userAgent: string;
   details: any;
   timestamp: Date;
}

export class SecurityMonitor {
   async logSecurityEvent(event: SecurityEvent): Promise<void> {
      // Log to security log
      logger.warn('Security event detected', event);

      // Store in database for analysis
      await prisma.securityEvent.create({
         data: {
            type: event.type,
            userId: event.userId,
            ipAddress: event.ipAddress,
            userAgent: event.userAgent,
            details: event.details,
            timestamp: event.timestamp,
         },
      });

      // Check for suspicious patterns
      await this.analyzeSecurityPatterns(event);
   }

   private async analyzeSecurityPatterns(event: SecurityEvent): Promise<void> {
      // Check for multiple failed login attempts
      if (event.type === 'authentication_failure') {
         const recentFailures = await prisma.securityEvent.count({
            where: {
               type: 'authentication_failure',
               ipAddress: event.ipAddress,
               timestamp: {
                  gte: new Date(Date.now() - 15 * 60 * 1000), // Last 15 minutes
               },
            },
         });

         if (recentFailures > 5) {
            await this.triggerSecurityAlert('Multiple authentication failures', {
               ipAddress: event.ipAddress,
               failureCount: recentFailures,
            });
         }
      }
   }

   private async triggerSecurityAlert(message: string, context: any): Promise<void> {
      // Send to security team
      logger.error('SECURITY ALERT', { message, context });

      // Could also send to Slack, email, etc.
   }
}

export const securityMonitor = new SecurityMonitor();
```

---

_Last Updated: 2025-01-02_
_Version: 1.0_
_Maintainer: Security Team_
