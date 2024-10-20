import { Controller, Get, Post, Query, Redirect } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { Public } from 'src/common/decorators/public/public.decorator';

@Controller('pagos')
export class PagosController {
	constructor(private readonly pagosService: PagosService) {}

	@Post('generar-orden')
	async generarOrden() {
		return this.pagosService.generarOrden();
	}

	@Public()
	@Get('oauth')
	async oauthCallback(@Query('code') code: string) {
		/* return this.pagosService.oauthCallback(code); */
		console.log(code);
	}

	@Public()
	@Get('solicitar-autorizacion-prestador')
	@Redirect()
	async solicitarAutorizacionPrestador() {
		const appId = process.env.MERCADO_PAGO_APP_ID;
		const redirectUri = process.env.REDIRECT_URI;
		return {
			url: `https://auth.mercadopago.com.ar/authorization?client_id=${appId}&response_type=code&platform_id=mp&redirect_uri=${redirectUri}`,
		};
	}
}
