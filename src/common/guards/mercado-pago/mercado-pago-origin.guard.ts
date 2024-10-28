import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class MercadoPagoOriginGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const referer = request.headers.referer || request.headers.origin;

		if (!referer || !referer.includes('auth.mercadopago.com.ar')) {
			throw new UnauthorizedException('Origen no autorizado');
		}
		return true;
	}
}
