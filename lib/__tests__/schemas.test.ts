import {
   createCampaignSchema,
   updateCampaignSchema,
   createContentSchema,
   updateContentSchema,
   generateContentSchema,
   createAssetSchema,
   updateAssetSchema,
   createScheduleSchema,
   updateScheduleSchema,
   createAnalyticsEventSchema,
   orgRoleSchema,
} from '../schemas';

describe('Campaign Schemas', () => {
   describe('createCampaignSchema', () => {
      it('should validate valid campaign data', () => {
         const data = { name: 'Test Campaign', description: 'Test description' };
         expect(() => createCampaignSchema.parse(data)).not.toThrow();
      });

      it('should reject empty name', () => {
         const data = { name: '', description: 'Test description' };
         expect(() => createCampaignSchema.parse(data)).toThrow();
      });

      it('should accept campaign without description', () => {
         const data = { name: 'Test Campaign' };
         expect(() => createCampaignSchema.parse(data)).not.toThrow();
      });
   });

   describe('updateCampaignSchema', () => {
      it('should validate partial updates', () => {
         const data = { name: 'Updated Campaign' };
         expect(() => updateCampaignSchema.parse(data)).not.toThrow();
      });

      it('should accept empty object', () => {
         const data = {};
         expect(() => updateCampaignSchema.parse(data)).not.toThrow();
      });
   });
});

describe('Content Schemas', () => {
   describe('createContentSchema', () => {
      it('should validate valid content data', () => {
         const data = {
            title: 'Test Content',
            body: 'Test body',
            campaignId: 'campaign-123',
         };
         expect(() => createContentSchema.parse(data)).not.toThrow();
      });

      it('should reject missing campaignId', () => {
         const data = { title: 'Test Content', body: 'Test body' };
         expect(() => createContentSchema.parse(data)).toThrow();
      });
   });

   describe('generateContentSchema', () => {
      it('should validate valid generation data', () => {
         const data = {
            prompt: 'Generate content about AI',
            campaignId: 'campaign-123',
         };
         expect(() => generateContentSchema.parse(data)).not.toThrow();
      });

      it('should reject empty prompt', () => {
         const data = { prompt: '', campaignId: 'campaign-123' };
         expect(() => generateContentSchema.parse(data)).toThrow();
      });
   });
});

describe('Asset Schemas', () => {
   describe('createAssetSchema', () => {
      it('should validate valid asset data', () => {
         const data = {
            url: 'https://example.com/image.jpg',
            name: 'Test Image',
            type: 'image/jpeg',
            size: 1024,
            contentId: 'content-123',
         };
         expect(() => createAssetSchema.parse(data)).not.toThrow();
      });

      it('should reject invalid URL', () => {
         const data = {
            url: 'invalid-url',
            type: 'image/jpeg',
            contentId: 'content-123',
         };
         expect(() => createAssetSchema.parse(data)).toThrow();
      });
   });
});

describe('Schedule Schemas', () => {
   describe('createScheduleSchema', () => {
      it('should validate valid schedule data', () => {
         const data = {
            runAt: '2024-01-01T10:00:00Z',
            timezone: 'America/New_York',
            channel: 'FACEBOOK',
            campaignId: 'campaign-123',
            contentId: 'content-123',
         };
         expect(() => createScheduleSchema.parse(data)).not.toThrow();
      });

      it('should reject invalid date', () => {
         const data = {
            runAt: 'invalid-date',
            timezone: 'America/New_York',
            channel: 'FACEBOOK',
            campaignId: 'campaign-123',
            contentId: 'content-123',
         };
         expect(() => createScheduleSchema.parse(data)).toThrow();
      });
   });
});

describe('Analytics Schemas', () => {
   describe('createAnalyticsEventSchema', () => {
      it('should validate valid event data', () => {
         const data = {
            event: 'page_view',
            data: { page: '/home' },
            organizationId: 'org-123',
         };
         expect(() => createAnalyticsEventSchema.parse(data)).not.toThrow();
      });

      it('should reject missing event', () => {
         const data = { data: { page: '/home' } };
         expect(() => createAnalyticsEventSchema.parse(data)).toThrow();
      });
   });
});

describe('Role Schema', () => {
   describe('orgRoleSchema', () => {
      it('should validate valid roles', () => {
         expect(() => orgRoleSchema.parse('ADMIN')).not.toThrow();
         expect(() => orgRoleSchema.parse('BRAND_OWNER')).not.toThrow();
         expect(() => orgRoleSchema.parse('CREATOR')).not.toThrow();
      });

      it('should reject invalid role', () => {
         expect(() => orgRoleSchema.parse('INVALID_ROLE')).toThrow();
      });
   });
});
