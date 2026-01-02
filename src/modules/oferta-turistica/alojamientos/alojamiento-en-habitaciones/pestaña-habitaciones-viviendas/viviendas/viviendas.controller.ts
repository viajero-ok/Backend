import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ViviendasService } from './viviendas.service';
import { ViviendaDto } from './dto/vivienda.dto';
import { RegistrarViviendaDto } from './dto/registrar-vivienda.dto';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';

@ApiTags('Alojamientos/Viviendas')
@Controller(
	'alojamientos/alojamiento-con-tipologias/pestanna-tipologias/viviendas',
)
export class ViviendasController {
	constructor(private readonly viviendasService: ViviendasService) {}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRO VIVIENDA' })
	@ApiResponse({
		status: 200,
		description: 'Datos de tipos de camas y características de viviendas',
		schema: {
			type: 'object',
			properties: {
				tipos_camas: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_tipo_cama: { type: 'number', example: 1 },
							tipo_cama: {
								type: 'string',
								example: 'Cama simple',
							},
						},
					},
				},
				caracteristicas_viviendas: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_caracteristica: { type: 'number', example: 28 },
							caracteristica: {
								type: 'string',
								example: 'Apta personas con movilidad reducida',
							},
						},
					},
				},
			},
		},
	})
	@Get('datos-registro-vivienda')
	async obtenerDatosRegistroVivienda() {
		return await this.viviendasService.obtenerDatosRegistroVivienda();
	}

	@ApiOperation({ summary: 'REGISTRAR VIVIENDA' })
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
				id_tipo_detalle: {
					type: 'string',
					example: '123e4567-e89b-12d3-a456-426614174000',
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Post('registrar-vivienda')
	async registrarVivienda(
		@Req() req: Request,
		@Body() registrarViviendaDto: RegistrarViviendaDto,
	) {
		return await this.viviendasService.registrarVivienda(
			req,
			registrarViviendaDto,
		);
	}

	@ApiOperation({ summary: 'ACTUALIZAR VIVIENDA' })
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
				id_tipo_detalle: {
					type: 'string',
					example: '123e4567-e89b-12d3-a456-426614174000',
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Patch('actualizar-vivienda')
	async actualizarVivienda(
		@Req() req: Request,
		@Body() viviendaDto: ViviendaDto,
	) {
		return await this.viviendasService.actualizarVivienda(req, viviendaDto);
	}

	@ApiOperation({ summary: 'ELIMINAR VIVIENDA' })
	@ApiResponse({
		status: 200,
		schema: {
			type: 'object',
			properties: {
				resultado: { type: 'string', example: 'ok' },
				statusCode: { type: 'number', example: 200 },
			},
		},
	})
	@Delete('eliminar-vivienda/:id_tipo_detalle')
	async eliminarVivienda(
		@Req() req: Request,
		@Param('id_tipo_detalle') id_tipo_detalle: string,
	) {
		return await this.viviendasService.eliminarVivienda(
			req,
			id_tipo_detalle,
		);
	}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRADOS VIVIENDAS' })
	@ApiResponse({
		status: 200,
		schema: {
			type: 'object',
			properties: {
				datos: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_tipo_detalle: { type: 'string' },
							tipo_detalle: { type: 'string' },
							cantidad: { type: 'number' },
							cantidad_baños: { type: 'number' },
							bl_baño_compartido: { type: 'boolean' },
							bl_baño_adaptado: { type: 'boolean' },
							plazas: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										id_tipo_detalle: { type: 'string' },
										id_plaza_x_tipo_detalle: {
											type: 'number',
										},
										id_tipo_cama: { type: 'number' },
										tipo_cama: { type: 'string' },
										cantidad_camas: { type: 'number' },
									},
								},
							},
							caracteristicas: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										id_tipo_detalle: { type: 'string' },
										id_caracteristica_x_detalle: {
											type: 'number',
										},
										id_caracteristica: { type: 'number' },
										caracteristica: { type: 'string' },
										ambito: { type: 'string' },
									},
								},
							},
							imagenes: { type: 'array' },
						},
					},
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Get('obtener-datos-registrados-vivienda/:id_oferta')
	async obtenerDatosRegistradosVivienda(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.viviendasService.obtenerDatosRegistradosVivienda(
			req,
			id_oferta,
		);
	}
}
