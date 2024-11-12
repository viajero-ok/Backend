import {
	Body,
	Controller,
	Param,
	Get,
	Patch,
	Req,
	UseGuards,
	Delete,
	Post,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { ActividadService } from './actividad.service';
import { ActividadDto } from './dto/actividad.dto';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';
import { EliminarGuiaDto } from './dto/eliminar-guia.dto';
import { RegistrarGuiaDto } from './dto/registrar-guia.dto';
import { ModificarGuiaDto } from './dto/modificar-guia.dto';

@ApiTags('Actividades/Actividad')
@ApiBearerAuth()
@Controller('actividades')
export class ActividadController {
	constructor(private readonly actividadService: ActividadService) {}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRO ACTIVIDADES' })
	@ApiResponse({
		status: 200,
		description: 'Datos de registro de actividades',
		schema: {
			type: 'object',
			properties: {
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
				sub_categorias_actividades: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_sub_categoria: {
								type: 'number',
								example: 1,
							},
							id_sub_tipo_oferta: {
								type: 'number',
								example: 5,
							},
							nombre_sub_categoria: {
								type: 'string',
								example: 'Vuelo de parapente',
							},
						},
					},
				},
				dificultad_actividades: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_dificultad: {
								type: 'number',
								example: 1,
							},
							dificultad: {
								type: 'string',
								example: 'Nivel básico',
							},
							descripcion: {
								type: 'string',
								example: 'Agregar info para tooltip?',
							},
						},
					},
				},
				politicas_cancelacion: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_politica_cancelacion: {
								type: 'number',
								example: 1,
							},
							politica_cancelacion: {
								type: 'string',
								example:
									'Cancelación con devolución de pago anticipado',
							},
						},
					},
				},
				tipos_pago_anticipado: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_tipo_pago_anticipado: {
								type: 'number',
								example: 1,
							},
							tipo_pago_anticipado: {
								type: 'string',
								example: 'Porcentaje en concepto de seña',
							},
						},
					},
				},
				metodos_pago: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_metodo_pago: {
								type: 'number',
								example: 1,
							},
							metodo_pago: {
								type: 'string',
								example: 'Transferencia',
							},
						},
					},
				},
			},
		},
	})
	@Get('datos-registro-actividades')
	async obtenerDatosRegistroActividades() {
		return await this.actividadService.obtenerDatosRegistroActividades();
	}

	@ApiOperation({ summary: 'REGISTRAR GUIA' })
	@ApiResponse({
		status: 201,
		description: 'Guia registrado',
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
	@UseGuards(OfertaOwnerGuard)
	@Post('registrar-guia')
	async registrarGuia(
		@Req() req: Request,
		@Body() guiaDto: RegistrarGuiaDto,
	) {
		return await this.actividadService.registrarGuia(req, guiaDto);
	}

	@ApiOperation({ summary: 'MODIFICAR GUIA' })
	@ApiResponse({
		status: 201,
		description: 'Guia modificado',
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
	@UseGuards(OfertaOwnerGuard)
	@Patch('modificar-guia')
	async modificarGuia(
		@Req() req: Request,
		@Body() guiaDto: ModificarGuiaDto,
	) {
		return await this.actividadService.modificarGuia(req, guiaDto);
	}

	@ApiOperation({ summary: 'ELIMINAR GUIA' })
	@ApiResponse({
		status: 200,
		description: 'Guia eliminado',
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
	@UseGuards(OfertaOwnerGuard)
	@Delete('eliminar-guia')
	async eliminarGuia(
		@Req() req: Request,
		@Body() eliminarGuiaDto: EliminarGuiaDto,
	) {
		return await this.actividadService.eliminarGuia(req, eliminarGuiaDto);
	}

	@ApiOperation({ summary: 'ACTUALIZAR ACTIVIDAD' })
	@ApiResponse({
		status: 201,
		description: 'Actividad actualizada',
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
				id_oferta: {
					type: 'string',
					example: '123e4567-e89b-12d3-a456-426614174000',
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Patch('actualizar-actividad')
	async actualizarActividad(
		@Req() req: Request,
		@Body() actividadDto: ActividadDto,
	) {
		return await this.actividadService.actualizarActividad(
			req,
			actividadDto,
		);
	}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRADOS ACTIVIDAD' })
	@ApiResponse({
		status: 200,
		description: 'Datos de registro de actividad',
		schema: {
			type: 'object',
			properties: {
				datos_actividad: {
					type: 'object',
					properties: {
						datos_basicos: {
							type: 'object',
							properties: {
								id_oferta_turistica: {
									type: 'string',
									example:
										'8c8b0b1a-9481-11ef-a05a-0242ac140007',
								},
								nombre: {
									type: 'string',
									example: 'Senderismo en la Sierra Nevada',
								},
								descripcion: {
									type: 'string',
									example:
										'Disfruta de una emocionante caminata por los senderos de la Sierra Nevada, admirando la belleza natural y la diversidad de flora y fauna.',
								},
								id_tipo_oferta: { type: 'number', example: 2 },
								tipo_oferta: {
									type: 'string',
									example: 'Actividad',
								},
								id_sub_tipo_oferta: {
									type: 'number',
									example: 2,
								},
								sub_tipo_oferta: {
									type: 'string',
									example: 'En unidades de vivienda',
								},
								id_sub_categoria: {
									type: 'string',
									example: 'Vuelo de paracaídas/paracaídismo',
								},
								id_politica_cancelacion: {
									type: 'number',
									example: 2,
								},
								plazo_dias_cancelacion: {
									type: 'number',
									example: 5,
								},
								bl_solicita_garantia: {
									type: 'boolean',
									nullable: true,
								},
								monto_garantia: {
									type: 'number',
									nullable: true,
								},
								id_tipo_pago_anticipado: {
									type: 'number',
									example: 1,
								},
								porcentaje_pago_anticipado: {
									type: 'string',
									example: '30.00',
								},
								duracion_horas: {
									type: 'string',
									example: '4.50',
								},
								distancia_km: {
									type: 'string',
									example: '8.00',
								},
								id_dificultad: { type: 'number', example: 2 },
								dificultad: {
									type: 'string',
									example: 'Nivel medio',
								},
								requisitos: {
									type: 'string',
									example:
										'Buena condición física, calzado adecuado para senderismo, ropa cómoda, protector solar y agua.',
								},
								bl_con_guia: { type: 'number', example: 1 },
							},
						},
						metodos_pago: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_metodo_pago_oferta: {
										type: 'number',
										example: 88,
									},
									id_metodo_pago: {
										type: 'number',
										example: 1,
									},
									metodo_pago: {
										type: 'string',
										example: 'Transferencia',
									},
								},
							},
						},
						guias: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_guia: {
										type: 'number',
										example: 1,
									},
									nro_resolucion: {
										type: 'string',
										example: '1234567890',
									},
									nombre_y_apellido: {
										type: 'string',
										example: 'Juan Pérez',
									},
								},
							},
						},
					},
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Get('obtener-datos-registrados-actividad/:id_oferta')
	async obtenerDatosRegistradosActividad(
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.actividadService.obtenerDatosRegistradosActividad(
			id_oferta,
		);
	}
}
