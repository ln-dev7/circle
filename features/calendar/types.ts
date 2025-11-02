export type Channel =
   | 'FACEBOOK'
   | 'INSTAGRAM'
   | 'TWITTER'
   | 'YOUTUBE'
   | 'LINKEDIN'
   | 'TIKTOK'
   | 'BLOG';

export type ContentStatus =
   | 'DRAFT'
   | 'SUBMITTED'
   | 'APPROVED'
   | 'SCHEDULED'
   | 'PUBLISHED'
   | 'REJECTED';

export type ScheduleStatus = 'PENDING' | 'PUBLISHED' | 'FAILED' | 'CANCELLED';

export interface Content {
   id: string;
   title: string;
   body?: string;
   status: ContentStatus;
   campaignId: string;
   campaign: {
      id: string;
      name: string;
   };
   assets: Asset[];
   createdAt: string;
   updatedAt: string;
}

export interface Asset {
   id: string;
   url: string;
   name?: string;
   type: string;
   size?: number;
   description?: string;
   tags: string[];
}

export interface Schedule {
   id: string;
   runAt: string; // ISO string
   timezone: string;
   channel: Channel;
   status: ScheduleStatus;
   campaignId: string;
   campaign: {
      id: string;
      name: string;
   };
   contentId?: string;
   content?: Content;
   createdAt: string;
   updatedAt: string;
}

export interface Campaign {
   id: string;
   name: string;
   description?: string;
   organizationId: string;
}

export interface ScheduleQuery {
   view: 'day' | 'week' | 'month';
   date: Date;
   channels?: Channel[];
   campaigns?: string[];
}
