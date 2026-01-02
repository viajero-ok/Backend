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
import { HabitacionesService } from './habitaciones.service';
import { HabitacionDto } from './dto/habitacion.dto';
import { RegistrarHabitacionDto } from './dto/registrar-habitacion.dto';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';

@ApiTags('Alojamientos/Habitaciones')
@Controller(
	'alojamientos/alojamiento-con-tipologias/pestaña-tipologias/habitaciones',
)
export class HabitacionesController {
	constructor(private readonly habitacionesService: HabitacionesService) {}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRO HABITACION' })
	@ApiResponse({
		status: 200,
		description:
			'Datos de tipos de camas y características de habitaciones',
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
				caracteristicas_habitaciones: {
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
				caracteristicas_servicios: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_caracteristica: {
								type: 'number',
								example: 8,
							},
							caracteristica: {
								type: 'string',
								example: 'Cochera',
							},
						},
					},
				},
			},
		},
	})
	@Get('datos-registro-habitacion')
	async obtenerDatosRegistroHabitacion() {
		return await this.habitacionesService.obtenerDatosRegistroHabitacion();
	}

	@ApiOperation({ summary: 'REGISTRAR HABITACION' })
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
	@Post('registrar-habitacion')
	async registrarHabitacion(
		@Req() req: Request,
		@Body() registrarHabitacionDto: RegistrarHabitacionDto,
	) {
		return await this.habitacionesService.registrarHabitacion(
			req,
			registrarHabitacionDto,
		);
	}

	@ApiOperation({ summary: 'ACTUALIZAR HABITACION' })
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
	@Patch('actualizar-habitacion')
	async actualizarHabitacion(
		@Req() req: Request,
		@Body() habitacionDto: HabitacionDto,
	) {
		return await this.habitacionesService.actualizarHabitacion(
			req,
			habitacionDto,
		);
	}

	@ApiOperation({ summary: 'ELIMINAR HABITACION' })
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
	@Delete('eliminar-habitacion/:id_tipo_detalle')
	async eliminarHabitacion(
		@Req() req: Request,
		@Param('id_tipo_detalle') id_tipo_detalle: string,
	) {
		return await this.habitacionesService.eliminarHabitacion(
			req,
			id_tipo_detalle,
		);
	}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRADOS HABITACIONES' })
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
	@Get('obtener-datos-registrados-habitacion/:id_oferta')
	async obtenerDatosRegistradosHabitacion(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.habitacionesService.obtenerDatosRegistradosHabitacion(
			req,
			id_oferta,
		);
	}
}
