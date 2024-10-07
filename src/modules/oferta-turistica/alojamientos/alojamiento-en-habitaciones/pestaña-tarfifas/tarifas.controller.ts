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
import { TarifasService } from './tarifas.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { RegistrarTarifasDto } from './dto/registrar-tarifa.dto';
import { ActualizarTarifasDto } from './dto/actualizar-tarifa.dto';
import { ConsultarDetallesDto } from './dto/consultar-detalles.dto';

@ApiTags('Alojamientos/Tarifas')
@ApiBearerAuth()
@Controller('alojamientos')
export class TarifasController {
	constructor(private readonly tarifasService: TarifasService) {}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRO TARIFA' })
	@ApiResponse({
		status: 200,
		description: 'Datos de tipos de pension',
		schema: {
			type: 'object',
			properties: {
				tipos_pension: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_tipo_pension: { type: 'number', example: 1 },
							tipo_pension: {
								type: 'string',
								example: 'Completa',
							},
						},
					},
				},
			},
		},
	})
	@Get('datos-registro-tarifa')
	async obtenerDatosRegistroTarifa(
		@Body() consultarDetallesDto: ConsultarDetallesDto,
	) {
		return await this.tarifasService.obtenerDatosRegistroTarifa(
			consultarDetallesDto,
		);
	}

	@ApiOperation({ summary: 'REGISTRAR TARIFA' })
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
				id_tarifa: {
					type: 'string',
					example: '123e4567-e89b-12d3-a456-426614174000',
				},
			},
		},
	})
	@Post('registrar-tarifa')
	async registrarTarifa(
		@Req() req: Request,
		@Body() tarifasDto: RegistrarTarifasDto,
	) {
		return await this.tarifasService.registrarTarifa(req, tarifasDto);
	}

	@ApiOperation({ summary: 'ACTUALIZAR TARIFA' })
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
				id_tarifa: {
					type: 'string',
					example: '123e4567-e89b-12d3-a456-426614174000',
				},
			},
		},
	})
	@Patch('actualizar-tarifa')
	async actualizarTarifa(
		@Req() req: Request,
		@Body() actualizarTarifasDto: ActualizarTarifasDto,
	) {
		return await this.tarifasService.actualizarTarifa(
			req,
			actualizarTarifasDto,
		);
	}

	@ApiOperation({ summary: 'ELIMINAR TARIFA' })
	@ApiResponse({
		status: 200,
		description: 'TARIFA ELIMINADA',
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
	@Delete('eliminar-tarifa/:id_tarifa')
	async eliminarTarifa(
		@Req() req: Request,
		@Param('id_tarifa') id_tarifa: number,
	) {
		return await this.tarifasService.eliminarTarifa(req, id_tarifa);
	}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRADOS' })
	@ApiResponse({
		status: 200,
		schema: {
			type: 'object',
			properties: {
				datos: {
					type: 'array',
					items: {
						type: 'object',
					},
				},
			},
		},
	})
	@Get('obtener-datos-registrados-tarifa/:id_oferta')
	async obtenerDatosRegistradosTarifa(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.tarifasService.obtenerDatosRegistradosTarifa(
			req,
			id_oferta,
		);
	}
}
