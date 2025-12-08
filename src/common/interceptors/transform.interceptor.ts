import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response as ExpressResponse, Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../interfaces/response.interface';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const http = context.switchToHttp();
    const response = http.getResponse<ExpressResponse>();
    const request = http.getRequest<Request>();

    const messageFromDecorator = this.reflector.get<string | undefined>(
      RESPONSE_MESSAGE_KEY,
      context.getHandler(),
    );

    const message = messageFromDecorator ?? 'Success';

    const httpCodeFromDecorator = this.reflector.get<number | undefined>(
      '__httpCode__',
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data: T) => ({
        statusCode:
          httpCodeFromDecorator ?? response.statusCode ?? HttpStatus.OK,

        message,
        data,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }
}
