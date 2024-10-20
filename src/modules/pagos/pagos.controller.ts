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
		return this.pagosService.solicitarAutorizacionPrestador();
	}
}
