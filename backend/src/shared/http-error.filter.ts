import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  code: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | null;
}

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status: HttpStatus = isHttpException
      ? (exception.getStatus() as HttpStatus)
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: ErrorResponse = {
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? (isHttpException ? exception.message : 'Bilinmeyen bir hata') ||
            null
          : 'Sunucu hatası',
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR)
      Logger.error(
        `${request.method} ${request.url}`,
        isHttpException ? exception.stack : String(exception),
        'ExceptionFilter',
      );
    else
      Logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(errorResponse),
        'ExceptionFilter',
      );

    response.status(status).json(errorResponse);
  }
}
