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
import { GuiaDto } from './dto/guia.dto';

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
	async registrarGuia(@Req() req: Request, @Body() guiaDto: GuiaDto) {
		return await this.actividadService.registrarGuia(req, guiaDto);
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

	@ApiOperation({ summary: 'ELIMINAR ACTIVIDAD' })
	@ApiResponse({
		status: 200,
		description: 'Actividad eliminada',
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
	@Delete('eliminar-actividad/:id_oferta')
	async eliminarActividad(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.actividadService.eliminarActividad(req, id_oferta);
	}
}
