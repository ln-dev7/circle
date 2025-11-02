# Rollback Playbook

## 📋 Table of Contents

- [Overview](#overview)
- [PR Rollback](#pr-rollback)
- [Database Migration Rollback](#database-migration-rollback)
- [Feature Flag Rollback](#feature-flag-rollback)
- [Emergency Procedures](#emergency-procedures)
- [Post-Rollback Actions](#post-rollback-actions)

## Overview

Rollback procedures là critical cho maintaining system stability và minimizing downtime. Playbook này cover các scenarios chính: PR rollback, database migration rollback, và feature flag rollback.

### Rollback Principles

1. **Speed**: Rollback phải nhanh để minimize impact
2. **Safety**: Rollback process phải safe và reliable
3. **Communication**: Team phải được notify về rollback
4. **Documentation**: Tất cả rollbacks phải được documented
5. **Testing**: Rollback phải được tested trước khi production

## PR Rollback

### 🚨 When to Rollback PR

- **Critical Bugs**: Production-breaking issues
- **Performance Issues**: Significant performance degradation
- **Security Issues**: Security vulnerabilities
- **User Complaints**: Multiple user reports về issues
- **System Instability**: Unstable system behavior

### 📋 PR Rollback Steps

#### 1. Immediate Assessment

```bash
# Check current deployment status
git log --oneline -10
git status
git branch -a

# Identify the problematic commit
git show <commit-hash>
```

#### 2. Create Rollback Branch

```bash
# Create rollback branch từ previous stable commit
git checkout -b rollback/emergency-rollback-$(date +%Y%m%d-%H%M%S)
git reset --hard <previous-stable-commit>

# Force push rollback branch
git push origin rollback/emergency-rollback-$(date +%Y%m%d-%H%M%S) --force
```

#### 3. Deploy Rollback

```bash
# Deploy rollback branch
pnpm build
pnpm start

# Verify deployment
curl http://localhost:3000/api/health
```

#### 4. Notify Team

```slack
🚨 EMERGENCY ROLLBACK
PR: #123 - Add new feature
Reason: Critical bug causing system instability
Rollback to: commit abc123
Status: Deployed and verified
```

### 🔍 PR Rollback Verification

- [ ] System health checks pass
- [ ] Critical functionality working
- [ ] Performance metrics normal
- [ ] User reports resolved
- [ ] Team notified

## Database Migration Rollback

### 🚨 When to Rollback Migration

- **Data Corruption**: Data integrity issues
- **Performance Issues**: Significant query performance degradation
- **Application Errors**: App crashes due to schema changes
- **Rollback Request**: Business request to revert changes

### 📋 Migration Rollback Steps

#### 1. Assess Migration Status

```bash
# Check migration history
pnpm prisma migrate status

# Check current database state
pnpm prisma db pull
```

#### 2. Create Rollback Migration

```bash
# Generate rollback migration
pnpm prisma migrate dev --create-only --name rollback_previous_migration

# Edit generated migration file
# Add rollback SQL commands
```

#### 3. Test Rollback Migration

```bash
# Test rollback locally
pnpm prisma migrate reset
pnpm prisma migrate deploy
pnpm prisma db seed

# Verify data integrity
pnpm test:db
```

#### 4. Deploy Rollback Migration

```bash
# Deploy rollback migration
pnpm prisma migrate deploy

# Verify rollback success
pnpm prisma migrate status
```

### 🔍 Migration Rollback Verification

- [ ] Database schema reverted
- [ ] Data integrity maintained
- [ ] Application functionality restored
- [ ] Performance metrics normal
- [ ] Rollback documented

### 📝 Rollback Migration Example

```sql
-- Migration: rollback_previous_migration
-- Rollback: add_user_status_field

-- Rollback: Remove status field from User table
ALTER TABLE "User" DROP COLUMN "status";

-- Rollback: Remove status enum
DROP TYPE "UserStatus";
```

## Feature Flag Rollback

### 🚨 When to Rollback Feature Flag

- **User Complaints**: Negative user feedback
- **Performance Issues**: Feature causing performance problems
- **Business Request**: Business decision to disable feature
- **Bug Reports**: Feature has critical bugs

### 📋 Feature Flag Rollback Steps

#### 1. Identify Feature Flag

```typescript
// Check feature flag configuration
const featureFlags = {
   NEW_CONTENT_EDITOR: false, // Disable problematic feature
   AI_CONTENT_GENERATION: true, // Keep working features
   ADVANCED_ANALYTICS: false, // Disable if causing issues
};
```

#### 2. Update Feature Flag

```typescript
// Update feature flag configuration
export const FEATURE_FLAGS = {
   NEW_CONTENT_EDITOR: false, // Rollback to false
   AI_CONTENT_GENERATION: true,
   ADVANCED_ANALYTICS: false,
};

// Or use environment variable
export const NEW_CONTENT_EDITOR_ENABLED = process.env.NEW_CONTENT_EDITOR_ENABLED === 'true';
```

#### 3. Deploy Feature Flag Change

```bash
# Deploy updated configuration
pnpm build
pnpm start

# Verify feature flag change
curl http://localhost:3000/api/health
```

#### 4. Monitor Rollback

```typescript
// Add monitoring cho feature flag rollback
if (FEATURE_FLAGS.NEW_CONTENT_EDITOR) {
   console.log('New content editor enabled');
} else {
   console.log('New content editor rolled back - using legacy editor');
   // Fallback to legacy implementation
}
```

### 🔍 Feature Flag Rollback Verification

- [ ] Feature flag disabled
- [ ] Legacy functionality restored
- [ ] User experience improved
- [ ] Performance metrics normal
- [ ] Rollback documented

## Emergency Procedures

### 🚨 Critical System Failure

#### 1. Immediate Response

```bash
# Stop current deployment
pm2 stop all
# or
docker-compose down

# Revert to last known good state
git checkout <last-known-good-commit>
```

#### 2. Emergency Communication

```slack
🚨 CRITICAL SYSTEM FAILURE
Status: System down, emergency rollback in progress
ETA: 15 minutes
Team: @oncall @engineering
```

#### 3. Emergency Rollback

```bash
# Deploy emergency rollback
git reset --hard <emergency-rollback-commit>
pnpm install
pnpm build
pnpm start

# Verify system recovery
curl http://localhost:3000/api/health
```

### 🚨 Data Loss Prevention

```bash
# Backup current database trước khi rollback
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup integrity
pg_restore --dry-run backup_$(date +%Y%m%d_%H%M%S).sql
```

## Post-Rollback Actions

### 📋 Immediate Actions

1. **Document Rollback**: Record reason, impact, và actions taken
2. **Notify Stakeholders**: Update business team về rollback
3. **Investigate Root Cause**: Analyze why rollback was necessary
4. **Update Rollback Plan**: Improve rollback procedures based on lessons learned

### 📝 Rollback Documentation Template

```markdown
# Rollback Report

## Incident Details

- **Date**: 2025-01-02
- **Time**: 14:30 UTC
- **Type**: PR Rollback
- **PR**: #123 - Add new feature

## Rollback Reason

Critical bug causing system instability and user complaints

## Actions Taken

1. Identified problematic commit
2. Created emergency rollback branch
3. Deployed rollback to production
4. Verified system stability

## Impact

- **Downtime**: 15 minutes
- **Users Affected**: ~500 active users
- **Data Loss**: None
- **Business Impact**: Minimal

## Root Cause Analysis

- Insufficient testing of edge cases
- Missing error handling in new feature
- Inadequate monitoring of system health

## Prevention Measures

1. Improve testing coverage
2. Add comprehensive error handling
3. Implement better monitoring
4. Review deployment procedures
```

### 🔄 Recovery Planning

1. **Fix Original Issue**: Address root cause của original problem
2. **Improve Testing**: Enhance test coverage và quality gates
3. **Update Procedures**: Improve rollback và deployment processes
4. **Team Training**: Train team on improved procedures

## Best Practices

### 🔒 Rollback Preparation

- **Always have rollback plan**: Prepare rollback procedures trước khi deploy
- **Test rollback procedures**: Verify rollback works trong staging environment
- **Document rollback steps**: Clear, step-by-step rollback instructions
- **Train team**: Ensure team knows how to execute rollback

### 🚨 Emergency Response

- **Act quickly**: Time is critical trong emergency situations
- **Communicate clearly**: Keep team và stakeholders informed
- **Follow procedures**: Stick to documented rollback procedures
- **Document everything**: Record all actions và decisions

### 📊 Post-Rollback Analysis

- **Analyze root cause**: Understand why rollback was necessary
- **Improve processes**: Update procedures based on lessons learned
- **Team review**: Conduct post-mortem với team
- **Update documentation**: Keep rollback procedures current

## Tools & Commands

### 🔧 Essential Commands

```bash
# Git operations
git log --oneline -10
git reset --hard <commit>
git checkout -b rollback/emergency-$(date +%Y%m%d-%H%M%S)

# Database operations
pnpm prisma migrate status
pnpm prisma migrate reset
pnpm prisma db pull

# Application operations
pnpm build
pnpm start
curl http://localhost:3000/api/health

# Monitoring
pm2 status
docker-compose ps
```

### 📱 Communication Templates

```slack
# Rollback Notification
🚨 ROLLBACK EXECUTED
Feature: <feature-name>
Reason: <reason>
Status: <status>
ETA: <estimated-time>

# Emergency Response
🚨 EMERGENCY ROLLBACK IN PROGRESS
Issue: <issue-description>
Impact: <impact-level>
ETA: <estimated-time>
Team: @oncall @engineering
```

---

_Last Updated: 2025-01-02_
_Version: 1.0_
_Maintainer: DevOps Team_
