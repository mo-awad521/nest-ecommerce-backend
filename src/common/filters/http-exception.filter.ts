import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let errorMessage: string = 'Error occurred';
    let errorDetails: string | undefined = undefined;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const errorObject = exceptionResponse as Record<string, any>;

      if (typeof errorObject.message === 'string') {
        errorMessage = errorObject.message;
      }

      if (errorObject.error && typeof errorObject.error === 'string') {
        errorDetails = errorObject.error;
      } else if (errorObject.message && Array.isArray(errorObject.message)) {
        errorDetails = errorObject.message.join(', ');
      }
    } else if (typeof exceptionResponse === 'string') {
      errorMessage = exceptionResponse;
    }

    response.status(status).json({
      statusCode: status,

      message: errorMessage,

      error: errorDetails || exception.message,
      //error: 'error',

      timestamp: new Date().toISOString(),
    });
  }
}
