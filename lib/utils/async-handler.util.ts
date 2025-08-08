import { NextRequest, NextResponse } from 'next/server';
import { ApiResponseUtil } from './api-response.util';
import { InternalServerException } from '../exceptions/http.exception';
import { v4 as uuidv4 } from 'uuid';

type AsyncRouteHandler = (request: NextRequest, context?: { params: any }) => Promise<NextResponse>;

type RouteHandler = (
   request: NextRequest,
   context?: { params: any }
) => NextResponse | Promise<NextResponse>;

export function asyncHandler(handler: AsyncRouteHandler): RouteHandler {
   return async (request: NextRequest, context?: { params: any }) => {
      const requestId = uuidv4();

      try {
         // Add request ID to headers for logging
         request.headers.set('x-request-id', requestId);

         const result = await handler(request, context);

         // Add request ID to response headers
         result.headers.set('x-request-id', requestId);

         return result;
      } catch (error) {
         // Log error with request ID
         console.error(`[${requestId}] API Error:`, {
            url: request.url,
            method: request.method,
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
         });

         // Convert unknown errors to internal server errors
         if (!(error instanceof Error)) {
            error = new InternalServerException('An unexpected error occurred');
         }

         return ApiResponseUtil.error(error as Error, requestId);
      }
   };
}
