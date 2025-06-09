import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { ZodValidationException } from '../exceptions/zod-validation.exception';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      throw new ZodValidationException(error);
    }
  }
}
