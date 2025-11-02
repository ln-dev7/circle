# Observability Playbook

## 📋 Table of Contents

- [Overview](#overview)
- [Logging Strategy](#logging-strategy)
- [Error Tracking](#error-tracking)
- [Health Checks](#health-checks)
- [Performance Monitoring](#performance-monitoring)
- [Alerting](#alerting)
- [Best Practices](#best-practices)

## Overview

Observability là foundation cho maintaining system health, debugging issues, và optimizing performance. Playbook này cover logging, error tracking, health checks, và monitoring strategies cho AiM Platform.

### Observability Pillars

1. **Logs**: Structured logging cho debugging và audit
2. **Metrics**: Performance và business metrics
3. **Traces**: Request tracing cho distributed systems
4. **Alerts**: Proactive notification về issues

## Logging Strategy

### 📝 Log Levels

#### 1. Error (Level 0)

```typescript
// Critical errors that require immediate attention
logger.error('Database connection failed', {
   error: error.message,
   stack: error.stack,
   context: { userId, action, timestamp },
});
```

#### 2. Warn (Level 1)

```typescript
// Warning conditions that might indicate problems
logger.warn('High memory usage detected', {
   memoryUsage: process.memoryUsage(),
   threshold: '80%',
   timestamp: new Date().toISOString(),
});
```

#### 3. Info (Level 2)

```typescript
// General information about application flow
logger.info('User logged in successfully', {
   userId,
   email,
   role,
   timestamp: new Date().toISOString(),
});
```

#### 4. Debug (Level 3)

```typescript
// Detailed debugging information
logger.debug('Processing campaign request', {
   campaignId,
   requestData,
   processingSteps: ['validation', 'permission_check', 'creation'],
});
```

### 🏗️ Logging Implementation

#### Structured Logging Setup

```typescript
// lib/logger.ts
import pino from 'pino';

const logger = pino({
   level: process.env.LOG_LEVEL || 'info',
   timestamp: pino.stdTimeFunctions.isoTime,
   formatters: {
      level: (label) => ({ level: label }),
      log: (object) => object,
   },
   serializers: {
      error: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
   },
});

export default logger;
```

#### Request Logging Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

export function middleware(request: NextRequest) {
   const start = Date.now();

   logger.info('Incoming request', {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      ip: request.ip || request.headers.get('x-forwarded-for'),
   });

   const response = NextResponse.next();

   response.headers.set('x-response-time', `${Date.now() - start}ms`);

   logger.info('Request completed', {
      method: request.method,
      url: request.url,
      status: response.status,
      duration: Date.now() - start,
   });

   return response;
}
```

#### Business Logic Logging

```typescript
// lib/services/campaigns.ts
import logger from '@/lib/logger';

export async function createCampaign(data: CreateCampaignRequest, userId: string) {
   logger.info('Creating campaign', {
      userId,
      campaignName: data.name,
      organizationId: data.organizationId,
   });

   try {
      const campaign = await prisma.campaign.create({
         data: {
            ...data,
            createdById: userId,
         },
      });

      logger.info('Campaign created successfully', {
         campaignId: campaign.id,
         userId,
         duration: Date.now() - start,
      });

      return campaign;
   } catch (error) {
      logger.error('Failed to create campaign', {
         error: error.message,
         userId,
         campaignData: data,
      });
      throw error;
   }
}
```

### 📊 Log Aggregation

#### Log Storage

```typescript
// Log to multiple destinations
const logger = pino({
   level: 'info',
   transport: {
      targets: [
         // Console output
         { target: 'pino-pretty', level: 'info' },
         // File output
         { target: 'pino/file', level: 'info', options: { destination: './logs/app.log' } },
         // Remote logging service (optional)
         {
            target: 'pino-http-send',
            level: 'error',
            options: { destination: process.env.LOG_ENDPOINT },
         },
      ],
   },
});
```

## Error Tracking

### 🚨 Error Categories

#### 1. Application Errors

```typescript
// Custom error classes
export class ValidationError extends Error {
   constructor(
      message: string,
      public field: string,
      public value: any
   ) {
      super(message);
      this.name = 'ValidationError';
   }
}

export class PermissionError extends Error {
   constructor(
      message: string,
      public userId: string,
      public requiredPermission: string
   ) {
      super(message);
      this.name = 'PermissionError';
   }
}

export class BusinessLogicError extends Error {
   constructor(
      message: string,
      public code: string,
      public context: any
   ) {
      super(message);
      this.name = 'BusinessLogicError';
   }
}
```

#### 2. Error Handling Middleware

```typescript
// lib/error-handler.ts
import logger from '@/lib/logger';

export function handleError(error: Error, req: NextRequest) {
   // Log error with context
   logger.error('Unhandled error', {
      error: {
         name: error.name,
         message: error.message,
         stack: error.stack,
      },
      request: {
         method: req.method,
         url: req.url,
         userId: req.headers.get('x-user-id'),
      },
      timestamp: new Date().toISOString(),
   });

   // Return appropriate error response
   if (error instanceof ValidationError) {
      return NextResponse.json(
         {
            error: 'E_VALIDATION',
            message: error.message,
            field: error.field,
         },
         { status: 400 }
      );
   }

   if (error instanceof PermissionError) {
      return NextResponse.json(
         {
            error: 'E_FORBIDDEN',
            message: error.message,
         },
         { status: 403 }
      );
   }

   // Default error response
   return NextResponse.json(
      {
         error: 'E_INTERNAL_ERROR',
         message: 'Internal server error',
      },
      { status: 500 }
   );
}
```

#### 3. Sentry Integration (Optional)

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
   dsn: process.env.SENTRY_DSN,
   environment: process.env.NODE_ENV,
   tracesSampleRate: 1.0,
   integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
});

export function captureError(error: Error, context?: any) {
   Sentry.captureException(error, {
      extra: context,
   });
}
```

## Health Checks

### 🏥 Health Check Endpoints

#### 1. Basic Health Check

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import logger from '@/lib/logger';

export async function GET() {
   const start = Date.now();
   const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version,
      checks: {} as Record<string, any>,
   };

   try {
      // Database health check
      await prisma.$queryRaw`SELECT 1`;
      health.checks.database = { status: 'healthy', responseTime: Date.now() - start };
   } catch (error) {
      health.status = 'unhealthy';
      health.checks.database = {
         status: 'unhealthy',
         error: error.message,
         responseTime: Date.now() - start,
      };
      logger.error('Database health check failed', { error: error.message });
   }

   // External service health checks
   try {
      // AI service health check
      const aiResponse = await fetch(process.env.OPENAI_API_URL + '/health');
      health.checks.ai = {
         status: aiResponse.ok ? 'healthy' : 'unhealthy',
         responseTime: Date.now() - start,
      };
   } catch (error) {
      health.checks.ai = {
         status: 'unhealthy',
         error: error.message,
         responseTime: Date.now() - start,
      };
   }

   const statusCode = health.status === 'healthy' ? 200 : 503;

   logger.info('Health check completed', {
      status: health.status,
      responseTime: Date.now() - start,
      checks: Object.keys(health.checks),
   });

   return NextResponse.json(health, { status: statusCode });
}
```

#### 2. Detailed Health Check

```typescript
// app/api/health/detailed/route.ts
export async function GET() {
   const detailedHealth = {
      system: {
         memory: process.memoryUsage(),
         cpu: process.cpuUsage(),
         platform: process.platform,
         nodeVersion: process.version,
      },
      database: {
         connectionPool: await getConnectionPoolStatus(),
         migrations: await getMigrationStatus(),
         performance: await getDatabasePerformance(),
      },
      external: {
         ai: await checkAIService(),
         storage: await checkStorageService(),
         email: await checkEmailService(),
      },
   };

   return NextResponse.json(detailedHealth);
}
```

### 📊 Health Check Monitoring

#### 1. Health Check Dashboard

```typescript
// components/health-dashboard.tsx
export function HealthDashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setHealth(data);
      } catch (error) {
        setHealth({ status: 'unhealthy', error: error.message });
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Checking system health...</div>;

  return (
    <div className="health-dashboard">
      <div className={`status ${health?.status}`}>
        System Status: {health?.status}
      </div>
      {health?.checks && (
        <div className="checks">
          {Object.entries(health.checks).map(([name, check]) => (
            <div key={name} className={`check ${check.status}`}>
              {name}: {check.status}
              {check.responseTime && <span>({check.responseTime}ms)</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Performance Monitoring

### 📈 Performance Metrics

#### 1. API Response Times

```typescript
// lib/performance.ts
export function measurePerformance<T>(operation: string, fn: () => Promise<T>): Promise<T> {
   const start = Date.now();

   return fn().finally(() => {
      const duration = Date.now() - start;

      logger.info('Performance measurement', {
         operation,
         duration,
         timestamp: new Date().toISOString(),
      });

      // Send to metrics service
      recordMetric('api_response_time', duration, { operation });
   });
}

// Usage in API routes
export async function GET(request: NextRequest) {
   return measurePerformance('get_campaigns', async () => {
      // API logic here
      const campaigns = await prisma.campaign.findMany();
      return NextResponse.json(campaigns);
   });
}
```

#### 2. Database Query Performance

```typescript
// lib/prisma-performance.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
   log: [
      {
         emit: 'event',
         level: 'query',
      },
   ],
});

prisma.$on('query', (e) => {
   logger.info('Database query', {
      query: e.query,
      params: e.params,
      duration: e.duration,
      timestamp: new Date().toISOString(),
   });

   // Alert on slow queries
   if (e.duration > 1000) {
      // > 1 second
      logger.warn('Slow database query detected', {
         query: e.query,
         duration: e.duration,
         threshold: 1000,
      });
   }
});
```

### 📊 Metrics Collection

#### 1. Custom Metrics

```typescript
// lib/metrics.ts
export class MetricsCollector {
   private metrics: Map<string, number[]> = new Map();

   recordMetric(name: string, value: number, labels?: Record<string, string>) {
      const key = this.buildKey(name, labels);
      if (!this.metrics.has(key)) {
         this.metrics.set(key, []);
      }
      this.metrics.get(key)!.push(value);
   }

   getMetrics() {
      const result: Record<string, any> = {};

      for (const [key, values] of this.metrics) {
         result[key] = {
            count: values.length,
            sum: values.reduce((a, b) => a + b, 0),
            average: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values),
         };
      }

      return result;
   }

   private buildKey(name: string, labels?: Record<string, string>): string {
      if (!labels) return name;
      const labelStr = Object.entries(labels)
         .map(([k, v]) => `${k}=${v}`)
         .join(',');
      return `${name}{${labelStr}}`;
   }
}

export const metrics = new MetricsCollector();
```

#### 2. Metrics Endpoint

```typescript
// app/api/metrics/route.ts
import { NextResponse } from 'next/server';
import { metrics } from '@/lib/metrics';

export async function GET() {
   const currentMetrics = metrics.getMetrics();

   return NextResponse.json({
      timestamp: new Date().toISOString(),
      metrics: currentMetrics,
   });
}
```

## Alerting

### 🚨 Alert Configuration

#### 1. Alert Rules

```typescript
// lib/alerts.ts
export interface AlertRule {
   name: string;
   condition: (metrics: any) => boolean;
   severity: 'low' | 'medium' | 'high' | 'critical';
   message: string;
   cooldown: number; // seconds
}

export const alertRules: AlertRule[] = [
   {
      name: 'high_error_rate',
      condition: (metrics) => metrics.error_rate > 0.05, // > 5%
      severity: 'high',
      message: 'Error rate is above 5%',
      cooldown: 300, // 5 minutes
   },
   {
      name: 'slow_response_time',
      condition: (metrics) => metrics.avg_response_time > 2000, // > 2 seconds
      severity: 'medium',
      message: 'Average response time is above 2 seconds',
      cooldown: 600, // 10 minutes
   },
   {
      name: 'database_connection_failed',
      condition: (metrics) => metrics.database_health === 'unhealthy',
      severity: 'critical',
      message: 'Database connection failed',
      cooldown: 60, // 1 minute
   },
];
```

#### 2. Alert Notifications

```typescript
// lib/alert-notifier.ts
export class AlertNotifier {
   private lastAlert: Map<string, number> = new Map();

   async sendAlert(rule: AlertRule, context: any) {
      const now = Date.now();
      const lastSent = this.lastAlert.get(rule.name) || 0;

      if (now - lastSent < rule.cooldown * 1000) {
         return; // Still in cooldown
      }

      const alert = {
         name: rule.name,
         severity: rule.severity,
         message: rule.message,
         context,
         timestamp: new Date().toISOString(),
      };

      // Send to different channels based on severity
      switch (rule.severity) {
         case 'critical':
            await this.sendCriticalAlert(alert);
            break;
         case 'high':
            await this.sendHighPriorityAlert(alert);
            break;
         case 'medium':
            await this.sendMediumPriorityAlert(alert);
            break;
         case 'low':
            await this.sendLowPriorityAlert(alert);
            break;
      }

      this.lastAlert.set(rule.name, now);
   }

   private async sendCriticalAlert(alert: any) {
      // Send to Slack, email, phone
      await this.sendSlackAlert(alert, '#alerts-critical');
      await this.sendEmailAlert(alert, 'oncall@company.com');
      await this.sendSMSAlert(alert);
   }

   private async sendSlackAlert(alert: any, channel: string) {
      // Slack integration
      const message = {
         channel,
         text: `🚨 ${alert.severity.toUpperCase()} ALERT: ${alert.message}`,
         attachments: [
            {
               fields: [
                  { title: 'Alert', value: alert.name },
                  { title: 'Severity', value: alert.severity },
                  { title: 'Time', value: alert.timestamp },
                  { title: 'Context', value: JSON.stringify(alert.context, null, 2) },
               ],
            },
         ],
      };

      // Send to Slack webhook
      await fetch(process.env.SLACK_WEBHOOK_URL, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(message),
      });
   }
}
```

## Best Practices

### 🔒 Security

- **Log Sanitization**: Never log sensitive data (passwords, tokens, PII)
- **Access Control**: Restrict access to logs và metrics
- **Audit Trail**: Log all security-related events
- **Data Retention**: Implement log rotation và retention policies

### 📊 Performance

- **Async Logging**: Use async logging để avoid blocking
- **Batch Processing**: Batch logs và metrics khi possible
- **Sampling**: Implement sampling cho high-volume operations
- **Caching**: Cache frequently accessed metrics

### 🧪 Testing

- **Test Alerts**: Verify alerting system works correctly
- **Load Testing**: Test logging performance under load
- **Error Scenarios**: Test error handling và logging
- **Health Checks**: Test health check endpoints

### 📝 Documentation

- **Alert Runbooks**: Document how to respond to each alert
- **Log Formats**: Document log structure và fields
- **Metrics Definitions**: Document what each metric means
- **Troubleshooting**: Document common issues và solutions

---

_Last Updated: 2025-01-02_
_Version: 1.0_
_Maintainer: DevOps Team_
