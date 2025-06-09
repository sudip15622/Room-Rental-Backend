// exceptions/zod-validation.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';

export class ZodValidationException extends HttpException {
  constructor(public readonly error: ZodError) {
    super(
      {
        message: 'Validation failed!',
        errors: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
