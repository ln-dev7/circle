import { BaseException } from './base.exception';

export class ValidationException extends BaseException {
   readonly statusCode = 400;
   readonly errorCode = 'VALIDATION_ERROR';

   constructor(message: string = 'Validation failed', details?: any) {
      super(message, details);
   }
}

export class NotFoundException extends BaseException {
   readonly statusCode = 404;
   readonly errorCode = 'RESOURCE_NOT_FOUND';

   constructor(resource: string = 'Resource', id?: string) {
      const message = id ? `${resource} with ID '${id}' not found` : `${resource} not found`;
      super(message);
   }
}

export class ConflictException extends BaseException {
   readonly statusCode = 409;
   readonly errorCode = 'RESOURCE_CONFLICT';

   constructor(message: string = 'Resource conflict occurred') {
      super(message);
   }
}

export class UnauthorizedException extends BaseException {
   readonly statusCode = 401;
   readonly errorCode = 'UNAUTHORIZED';

   constructor(message: string = 'Authentication required') {
      super(message);
   }
}

export class ForbiddenException extends BaseException {
   readonly statusCode = 403;
   readonly errorCode = 'FORBIDDEN';

   constructor(message: string = 'Access denied') {
      super(message);
   }
}

export class InternalServerException extends BaseException {
   readonly statusCode = 500;
   readonly errorCode = 'INTERNAL_SERVER_ERROR';

   constructor(message: string = 'Internal server error occurred') {
      super(message);
   }
}

export class BadRequestException extends BaseException {
   readonly statusCode = 400;
   readonly errorCode = 'BAD_REQUEST';

   constructor(message: string = 'Bad request') {
      super(message);
   }
}

// Business logic specific exceptions
export class CompanyNotFoundException extends NotFoundException {
   constructor(id?: string) {
      super('Company', id);
   }
}

export class OnboardingNotFoundException extends NotFoundException {
   constructor(id?: string) {
      super('Onboarding', id);
   }
}

export class CompanyAlreadyExistsException extends ConflictException {
   constructor(email: string) {
      super(`Company with email '${email}' already exists`);
   }
}

export class CompanyHasTeamsException extends ConflictException {
   constructor(companyId: string) {
      super(`Cannot delete company '${companyId}' because it has existing teams`);
   }
}
