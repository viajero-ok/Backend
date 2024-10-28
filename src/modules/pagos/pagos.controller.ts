import { Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public/public.decorator';
import { Response } from 'express';

@ApiBearerAuth()
@ApiTags('Mercado Pago')
@Controller('pagos')
export class PagosController {
	constructor(private readonly pagosService: PagosService) {}

	@Post('generar-orden')
	async generarOrden() {
		return this.pagosService.generarOrden();
	}

	@Get('solicitar-autorizacion-prestador')
	async solicitarAutorizacionPrestador(@Req() req) {
		return this.pagosService.solicitarAutorizacionPrestador(
			req.user.id_usuario,
		);
	}

	@Public()
	@Get('oauth')
	/* @UseGuards(MercadoPagoOriginGuard) */
	async oauthCallback(
		@Query('code') code: string,
		@Query('state') state: string,
		@Res() res: Response,
	) {
		return this.pagosService.oauthCallback(code, state, res);
	}
}
