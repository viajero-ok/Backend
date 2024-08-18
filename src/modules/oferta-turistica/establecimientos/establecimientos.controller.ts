import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { EstablecimientosService } from './establecimientos.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
	getSchemaPath,
} from '@nestjs/swagger';
import { EstablecimientoDto } from './dto/establecimiento.dto';
import { Request } from 'express';

@ApiTags('Establecimientos')
@ApiBearerAuth()
@Controller('establecimientos')
export class EstablecimientosController {
	constructor(
		private readonly establecimientosService: EstablecimientosService,
	) {}

	@ApiOperation({ summary: 'REGISTRAR ESTABLECIMIENTO' })
	@ApiResponse({
		status: 201,
		schema: {
			type: 'object',
			properties: {
				resultado: {
					type: 'string',
					example: 'ok',
				},
				statusCode: {
					type: 'number',
					example: 201,
				},
			},
		},
	})
	@ApiResponse({
		status: 409,
		schema: {
			type: 'object',
			properties: {
				statusCode: {
					type: 'number',
					example: 409,
				},
				message: {
					type: 'string',
					example: 'Error al registrar establecimiento',
				},
			},
		},
	})
	@Post('registrar-establecimiento')
	async registrarEstablecimiento(
		@Req() req: Request,
		@Body() establecimientoDto: EstablecimientoDto,
	) {
		return await this.establecimientosService.registrarEstablecimiento(
			req,
			establecimientoDto,
		);
	}

	@ApiOperation({ summary: 'OBTENER ESTABLECIMIENTOS DE UN PRESTADOR' })
	@ApiResponse({
		status: 200,
		schema: {
			type: 'object',
			properties: {
				statusCode: {
					type: 'number',
					example: 200,
				},
				message: {
					type: 'string',
					example: 'ok',
				},
				establecimientos: {
					type: 'array',
					items: { $ref: getSchemaPath(EstablecimientoDto) },
				},
			},
		},
	})
	@Get('obtener-establecimientos')
	async obtenerEstablecimientosPorPrestador(@Req() req: Request) {
		return await this.establecimientosService.obtenerEstablecimientosPorPrestador(
			req,
		);
	}
}
