import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class JwtRefreshInterceptor implements NestInterceptor {
	constructor(private readonly jwtService: JwtService) {}
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();

		return next.handle().pipe(
			tap(() => {
				const token = request.headers.authorization?.split(' ')[1];
				if (token && this.shouldRefreshToken(token)) {
					try {
						const decoded = this.jwtService.verify(token);
						const newToken = this.jwtService.sign({
							id: decoded.id,
						});
						response.setHeader('new_token', newToken);
					} catch (error) {
						// Token inválido, no hacemos nada
					}
				}
			}),
		);
	}

	private shouldRefreshToken(token: string): boolean {
		try {
			const decoded = this.jwtService.decode(token) as { exp: number };
			if (!decoded || !decoded.exp) return false;

			const currentTime = Math.floor(Date.now() / 1000);
			const timeUntilExpiry = decoded.exp - currentTime;

			return (
				timeUntilExpiry <
					parseInt(process.env.JWT_REFRESH_MILISECONDS) &&
				timeUntilExpiry > 0
			);
		} catch {
			return false;
		}
	}
}
