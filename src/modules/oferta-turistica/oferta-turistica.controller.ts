import { Controller, Get, Req } from '@nestjs/common';
import { OfertaTuristicaService } from './oferta-turistica.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Ofertas Turísticas')
@ApiBearerAuth()
@Controller('ofertas-turisticas')
export class OfertaTuristicaController {
	constructor(
		private readonly ofertaTuristicaService: OfertaTuristicaService,
	) {}

	@ApiOperation({ summary: 'OBTENER OFERTAS POR PRESTADOR' })
	@Get('por-prestador')
	async obtenerOfertasPorPrestador(@Req() req: Request) {
		return await this.ofertaTuristicaService.obtenerOfertasPorPrestador(
			req,
		);
	}

	@ApiOperation({ summary: 'OBTENER TIPOS Y SUBTIPOS DE OFERTAS' })
	@ApiResponse({
		status: 200,
		description: 'Listado de tipos y subtipos de oferta',
		schema: {
			type: 'object',
			properties: {
				resultado: {
					type: 'string',
					example: 'ok',
				},
				statusCode: {
					type: 'number',
					example: 200,
				},
				tipos_y_subtipos: {
					type: 'object',
					properties: {
						tipos: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_tipo_oferta: {
										type: 'number',
										example: 1,
									},
									nombre_tipo_oferta: {
										type: 'string',
										example: 'Alojamiento',
									},
								},
							},
						},
						subtipos: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_sub_tipo_oferta: {
										type: 'number',
										example: 1,
									},
									id_tipo_oferta: {
										type: 'number',
										example: 1,
									},
									nombre_sub_tipo_oferta: {
										type: 'string',
										example: 'En habitaciones',
									},
								},
							},
						},
					},
				},
			},
		},
	})
	@Get('tipos-subtipos')
	async obtenerTiposSubtipos() {
		return await this.ofertaTuristicaService.obtenerTiposSubtipos();
	}
}
