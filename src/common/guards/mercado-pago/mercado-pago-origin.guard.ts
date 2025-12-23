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

		const allowedDomains = [
			'auth.mercadopago.com.ar',
			'dev.viajeroturismo.me',
		];

		if (
			!referer ||
			!allowedDomains.some((domain) => referer.includes(domain))
		) {
			throw new UnauthorizedException('Origen no autorizado');
		}
		return true;
	}
}
