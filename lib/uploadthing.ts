import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { auth } from '@/lib/auth';

const f = createUploadthing();

export const ourFileRouter = {
   assetUploader: f({
      image: { maxFileSize: '4MB' },
      video: { maxFileSize: '16MB' },
      audio: { maxFileSize: '8MB' },
      pdf: { maxFileSize: '4MB' },
   })
      .middleware(async ({ req }) => {
         const session = await auth();

         if (!session?.user?.id) throw new UploadThingError('Unauthorized');

         return { userId: session.user.id };
      })
      .onUploadComplete(async ({ metadata, file }) => {
         console.log('Upload complete for userId:', metadata.userId);
         console.log('file url', file.url);

         return { uploadedBy: metadata.userId, url: file.url };
      }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
