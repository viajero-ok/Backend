import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
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
	@Get('oauth/:id_usuario')
	async oauthCallback(
		@Query('code') code: string,
		@Param('id_usuario') id_usuario: string,
		@Req() req?,
	) {
		if (req.user) console.log('REQUEST', req.user);
		console.log('CODE', code);
		console.log('ID_USUARIO', id_usuario);
		return this.pagosService.oauthCallback(code, id_usuario);
	}
}
