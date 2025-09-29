import { NextRequest } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import { ValidationException } from '../exceptions/http.exception';

export class ValidationUtil {
   static async validateBody<T>(request: NextRequest, schema: ZodSchema<T>): Promise<T> {
      try {
         const body = await request.json();
         return schema.parse(body);
      } catch (error) {
         if (error instanceof ZodError) {
            throw error; // Will be handled by ApiResponseUtil.error
         }
         throw new ValidationException('Invalid JSON format');
      }
   }

   static validateQuery<T>(request: NextRequest, schema: ZodSchema<T>): T {
      try {
         const { searchParams } = new URL(request.url);
         const queryObject: Record<string, any> = {};

         searchParams.forEach((value, key) => {
            // Handle array parameters (e.g., ?tags=tag1&tags=tag2)
            if (queryObject[key]) {
               if (Array.isArray(queryObject[key])) {
                  queryObject[key].push(value);
               } else {
                  queryObject[key] = [queryObject[key], value];
               }
            } else {
               queryObject[key] = value;
            }
         });

         return schema.parse(queryObject);
      } catch (error) {
         if (error instanceof ZodError) {
            throw error;
         }
         throw new ValidationException('Invalid query parameters');
      }
   }

   static validateParams<T>(params: any, schema: ZodSchema<T>): T {
      try {
         return schema.parse(params);
      } catch (error) {
         if (error instanceof ZodError) {
            throw error;
         }
         throw new ValidationException('Invalid route parameters');
      }
   }
}
