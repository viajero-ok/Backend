import {
	CallHandler,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeOutInterceptor implements NestInterceptor {
	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		const time = parseInt(process.env.TIMEOUT_MILISECONDS) || 5000;
		return next.handle().pipe(
			timeout(time),
			catchError((err) => {
				if (err instanceof TimeoutError) {
					throw new HttpException(
						'La solicitud ha excedido el tiempo máximo de espera',
						HttpStatus.REQUEST_TIMEOUT,
					);
				}
				return throwError(() => err);
			}),
		);
	}
}
