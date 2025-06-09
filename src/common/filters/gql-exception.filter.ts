// src/common/filters/gql-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  HttpException,
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
    console.log(response);

    if (exception instanceof ZodValidationException) {
      return new GraphQLError(exception.message, {
        extensions: {
          code: 'BAD_USER_INPUT',
          errors: response.errors || response,
        },
      });
    }

    if(exception instanceof PrismaException) {
      return new GraphQLError(exception.message, {
        extensions: {
          errors: response.errors || response
        }
      })
    }

    return new GraphQLError(exception.message)
  }
}
