import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Req,
} from '@nestjs/common';
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

	@ApiOperation({ summary: 'ACTUALIZAR ESTABLECIMIENTO' })
	@ApiResponse({
		status: 200,
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
			},
		},
	})
	@Patch('actualizar-establecimiento')
	async actualizarEstablecimiento(
		@Req() req: Request,
		@Body() establecimientoDto: EstablecimientoDto,
	) {
		return await this.establecimientosService.actualizarEstablecimiento(
			req,
			establecimientoDto,
		);
	}

	@ApiOperation({ summary: 'ELIMINAR ESTABLECIMIENTO' })
	@ApiResponse({
		status: 200,
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
			},
		},
	})
	@Delete('eliminar-establecimiento/:id_establecimiento')
	async eliminarEstablecimiento(
		@Req() req: Request,
		@Param('id_establecimiento') id_establecimiento: string,
	) {
		return await this.establecimientosService.eliminarEstablecimiento(
			req,
			id_establecimiento,
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
