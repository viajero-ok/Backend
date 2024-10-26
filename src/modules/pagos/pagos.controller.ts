import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { Public } from 'src/common/decorators/public/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('pagos')
export class PagosController {
	constructor(private readonly pagosService: PagosService) {}

	@Post('generar-orden')
	async generarOrden() {
		return this.pagosService.generarOrden();
	}

	/* @Public() */
	@Get('solicitar-autorizacion-prestador')
	async solicitarAutorizacionPrestador(@Req() req) {
		return this.pagosService.solicitarAutorizacionPrestador(req);
	}

	@Public()
	@Get('oauth')
	async oauthCallback(
		@Query('code') code: string,
		@Query('id_usuario') id_usuario: string,
		@Req() req,
	) {
		console.log('REQUEST', req);
		console.log('CODE', code);
		console.log('ID_USUARIO', id_usuario);
		return this.pagosService.oauthCallback(code, id_usuario);
	}
}
