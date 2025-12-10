import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response as ExpressResponse, Request } from 'express';

interface ErrorResponse {
  message?: string | string[];
  error?: string;
  [key: string]: unknown;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const isDevelopment = process.env.NODE_ENV !== 'production';

    const errorResponse: ErrorResponse =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as ErrorResponse);

    const mainMessage: string = Array.isArray(errorResponse.message)
      ? errorResponse.message.join(', ')
      : (errorResponse.message as string) || exception.message;

    if (isDevelopment) {
      response.status(status).json({
        statusCode: status,
        message: mainMessage,
        error: (errorResponse.error as string) || null,
        details: errorResponse,
        timestamp: new Date().toISOString(),
        path: request.url,
        env: 'development',
      });
    } else {
      // production mode
      response.status(status).json({
        statusCode: status,
        message: mainMessage || 'Something went wrong',
        error: (errorResponse.error as string) || 'Bad Request',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
