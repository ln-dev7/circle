import { NextResponse } from 'next/server';
import { ApiSuccessResponse, ApiErrorResponse, PaginationMeta } from '../types/api-response.types';
import { BaseException } from '../exceptions/base.exception';
import { ZodError } from 'zod';

export class ApiResponseUtil {
   static success<T>(
      data: T,
      message?: string,
      meta?: { pagination?: PaginationMeta; [key: string]: any },
      status: number = 200
   ): NextResponse<ApiSuccessResponse<T>> {
      return NextResponse.json(
         {
            success: true,
            data,
            message,
            meta,
         },
         { status }
      );
   }

   static created<T>(data: T, message?: string, meta?: any): NextResponse<ApiSuccessResponse<T>> {
      return this.success(data, message || 'Resource created successfully', meta, 201);
   }

   static error(
      error: BaseException | ZodError | Error,
      requestId?: string
   ): NextResponse<ApiErrorResponse> {
      let statusCode = 500;
      let errorCode = 'INTERNAL_SERVER_ERROR';
      let message = 'An unexpected error occurred';
      let details: any = undefined;

      if (error instanceof BaseException) {
         statusCode = error.statusCode;
         errorCode = error.errorCode;
         message = error.message;
         details = error.details;
      } else if (error instanceof ZodError) {
         statusCode = 400;
         errorCode = 'VALIDATION_ERROR';
         message = 'Validation failed';
         details = error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
         }));
      } else if (error instanceof Error) {
         message = error.message;
      }

      const response: ApiErrorResponse = {
         success: false,
         error: {
            code: errorCode,
            message,
            details,
            timestamp: new Date().toISOString(),
         },
         meta: requestId ? { requestId } : undefined,
      };

      return NextResponse.json(response, { status: statusCode });
   }

   static paginated<T>(
      data: T[],
      pagination: PaginationMeta,
      message?: string
   ): NextResponse<ApiSuccessResponse<T[]>> {
      return this.success(data, message, { pagination });
   }
}
