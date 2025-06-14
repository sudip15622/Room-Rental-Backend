import {
  ArgumentsHost,
  Catch,
  HttpException,
  UnauthorizedException,
  ExceptionFilter,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { ZodValidationException } from '../exceptions/zod-validation.exception';
import { PrismaException } from '../exceptions/prisma.exception';

@Catch(HttpException)
export class HttpExceptionFilter
  implements GqlExceptionFilter, ExceptionFilter
{
  catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = host.switchToHttp();
    const response: any = exception.getResponse();

    if (exception instanceof ZodValidationException) {
      return new GraphQLError(exception.message, {
        extensions: {
          code: 'BAD_USER_INPUT',
          errors: response.errors || response,
        },
      });
    }

    if (exception instanceof PrismaException) {
      return new GraphQLError(exception.message, {
        extensions: {
          code: 'BAD_REQUEST',
          errors: response.errors || response,
        },
      });
    }

    if (exception instanceof UnauthorizedException) {
      return new GraphQLError(exception.message, {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    // Default fallback for all other HttpExceptions
    return new GraphQLError(exception.message, {
      extensions: {
        code: exception.getStatus?.() || 'INTERNAL_SERVER_ERROR',
        errors: response,
      },
    });
  }
}
