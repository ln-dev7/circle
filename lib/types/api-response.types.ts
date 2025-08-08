export interface ApiSuccessResponse<T = any> {
   success: true;
   data: T;
   message?: string;
   meta?: {
      pagination?: PaginationMeta;
      [key: string]: any;
   };
}

export interface ApiErrorResponse {
   success: false;
   error: {
      code: string;
      message: string;
      details?: any;
      timestamp: string;
   };
   meta?: {
      requestId?: string;
      [key: string]: any;
   };
}

export interface PaginationMeta {
   page: number;
   limit: number;
   total: number;
   totalPages: number;
   hasNext: boolean;
   hasPrev: boolean;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
