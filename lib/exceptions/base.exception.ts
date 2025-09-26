export abstract class BaseException extends Error {
   abstract readonly statusCode: number;
   abstract readonly errorCode: string;
   readonly timestamp: string;
   readonly details?: any;

   constructor(message: string, details?: any) {
      super(message);
      this.name = this.constructor.name;
      this.timestamp = new Date().toISOString();
      this.details = details;
      Error.captureStackTrace(this, this.constructor);
   }

   toJSON() {
      return {
         name: this.name,
         message: this.message,
         statusCode: this.statusCode,
         errorCode: this.errorCode,
         timestamp: this.timestamp,
         details: this.details,
      };
   }
}
