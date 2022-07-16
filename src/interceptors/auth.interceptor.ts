import {
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Injectable,ExecutionContext,CallHandler ,NestInterceptor,} from '@nestjs/common';
import {Observable,catchError} from 'rxjs';
import {UserNotFoundError} from '../errors/UserNotFoundError';
import {UserExistError} from '../errors/UserExistError';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(catchError(error => {
        
        if(error instanceof UserExistError){
          throw new HttpException(
            { status: 'error', msg:error.message },
            HttpStatus.BAD_REQUEST,
          );
        }  
        if(error instanceof UserNotFoundError){
          throw new HttpException(
            { status: 'error', msg:error.message },
            HttpStatus.BAD_REQUEST,
          );
        }
        throw error;
      }));
  }
}