import { Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { PagosService } from './pagos.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public/public.decorator';
import { Response } from 'express';

@ApiBearerAuth()
@ApiTags('Mercado Pago')
@Controller('pagos')
export class PagosController {
	constructor(private readonly pagosService: PagosService) {}

	@ApiOperation({ summary: 'GENERAR ORDEN DE PAGO' })
	@Post('generar-orden/:id_reserva')
	async generarOrden(@Param('id_reserva') id_reserva: string) {
		return this.pagosService.generarOrden(id_reserva);
	}

	@ApiOperation({ summary: 'SOLICITAR AUTORIZACIÓN PRESTADOR' })
	@ApiResponse({
		status: 200,
		description: 'URL de autorización',
		schema: {
			type: 'object',
			properties: {
				url: {
					type: 'string',
					example:
						'https://www.mercadopago.com.ar/authorization?authorization_id=1234567890',
				},
			},
		},
	})
	@Get('solicitar-autorizacion-prestador')
	async solicitarAutorizacionPrestador(@Req() req) {
		return this.pagosService.solicitarAutorizacionPrestador(
			req.user.id_usuario,
		);
	}

	@ApiOperation({ summary: 'OAUTH CALLBACK' })
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

	@Public()
	@ApiOperation({ summary: 'NOTIFICACIÓN DE PAGO (WEBHOOK)' })
	@Post('notification')
	async notification(@Req() req) {
		return this.pagosService.notification(req);
	}

	/* @ApiOperation({ summary: 'NOTIFICACIÓN DE PAGO (WEBHOOK) SUCCESS' })
	@Post('success')
	async success(@Req() req) {
		return this.pagosService.success(req);
	}

	@ApiOperation({ summary: 'NOTIFICACIÓN DE PAGO (WEBHOOK) FAILURE' })
	@Post('failure')
	async failure(@Req() req) {
		return this.pagosService.failure(req);
	} */

	@Get('external-reference/:external_reference')
	async externalReference(
		@Param('external_reference') external_reference: string,
	) {
		return this.pagosService.externalReference(external_reference);
	}
}
