import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Req,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';
import { PestañaDatosBasicosService } from './pestaña-datos-basicos.service';
import { DatosBasicosCampingDto } from './dto/datos-basicos-camping.dto';

@ApiTags('Alojamientos/Camping/Datos Básicos')
@ApiBearerAuth()
@Controller('alojamientos/camping/pestanna-datos-basicos')
export class PestañaDatosBasicosController {
	constructor(
		private readonly pestañaDatosBasicosService: PestañaDatosBasicosService,
	) {}

	@ApiOperation({
		summary: 'OBTENER DATOS REGISTRO CAMPING - DATOS BÁSICOS',
	})
	@ApiResponse({
		status: 200,
		description: 'Datos para el registro de datos básicos del camping',
		schema: {
			type: 'object',
			properties: {
				caracteristicas: {
					type: 'object',
					properties: {
						caracteristicas_espacios_uso_comun: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_caracteristica: {
										type: 'number',
										example: 1,
									},
									caracteristica: {
										type: 'string',
										example: 'Sala de usos múltiples',
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
										example: 'Proveeduría',
									},
								},
							},
						},
						caracteristicas_entretenimiento: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_caracteristica: {
										type: 'number',
										example: 17,
									},
									caracteristica: {
										type: 'string',
										example: 'Pileta',
									},
								},
							},
						},
						caracteristicas_normas: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_caracteristica: {
										type: 'number',
										example: 23,
									},
									caracteristica: {
										type: 'string',
										example: 'Acepta niños',
									},
								},
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
								example: 'Porcentaje de la estadía',
							},
						},
					},
				},
				metodos_pago: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_metodo_pago: { type: 'number', example: 1 },
							metodo_pago: {
								type: 'string',
								example: 'Todos',
							},
						},
					},
				},
			},
		},
	})
	@Get('datos-registro-camping')
	async obtenerDatosRegistroCamping() {
		return await this.pestañaDatosBasicosService.obtenerDatosRegistroCamping();
	}

	@ApiOperation({ summary: 'ACTUALIZAR DATOS BÁSICOS DEL CAMPING' })
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
				id_oferta: {
					type: 'string',
					example: '123e4567-e89b-12d3-a456-426614174000',
				},
			},
		},
	})
	@ApiResponse({
		status: 409,
		description: 'Error al registrar datos del camping.',
		schema: {
			type: 'object',
			properties: {
				statusCode: { type: 'number', example: 409 },
				message: {
					type: 'string',
					example: 'Error al registrar alojamiento.',
				},
			},
		},
	})
	@ApiResponse({
		status: 409,
		description: 'Error al registrar características.',
		schema: {
			type: 'object',
			properties: {
				statusCode: { type: 'number', example: 409 },
				message: {
					type: 'string',
					example: 'Error al registrar características.',
				},
			},
		},
	})
	@ApiResponse({
		status: 409,
		description: 'Error al registrar métodos de pago.',
		schema: {
			type: 'object',
			properties: {
				statusCode: { type: 'number', example: 409 },
				message: {
					type: 'string',
					example: 'Error al registrar métodos de pago.',
				},
			},
		},
	})
	@ApiResponse({
		status: 409,
		description: 'Error al registrar observación.',
		schema: {
			type: 'object',
			properties: {
				statusCode: { type: 'number', example: 409 },
				message: {
					type: 'string',
					example: 'Error al registrar observación.',
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Patch('actualizar-datos-basicos')
	async actualizarDatosBasicos(
		@Req() req: Request,
		@Body() datosBasicosCampingDto: DatosBasicosCampingDto,
	) {
		return await this.pestañaDatosBasicosService.actualizarDatosBasicos(
			req,
			datosBasicosCampingDto,
		);
	}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRADOS DEL CAMPING' })
	@ApiResponse({
		status: 200,
		schema: {
			type: 'object',
			properties: {
				datos: {
					type: 'object',
					properties: {
						datos_basicos: {
							type: 'object',
							properties: {
								id_oferta_turistica: { type: 'string' },
								nombre: { type: 'string' },
								descripcion: { type: 'string' },
								id_tipo_oferta: { type: 'number' },
								tipo_oferta: { type: 'string' },
								id_sub_tipo_oferta: { type: 'number' },
								sub_tipo_oferta: { type: 'string' },
								id_politica_cancelacion: { type: 'number' },
								plazo_dias_cancelacion: { type: 'number' },
								bl_solicita_garantia: { type: 'number' },
								monto_garantia: { type: 'string' },
								id_tipo_pago_anticipado: { type: 'number' },
								porcentaje_pago_anticipado: { type: 'string' },
								min_dias_estadia: { type: 'number' },
							},
						},
						metodos_pago: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_metodo_pago_oferta: { type: 'number' },
									id_metodo_pago: { type: 'number' },
									metodo_pago: { type: 'string' },
								},
							},
						},
						caracteristicas: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_caracteristica_oferta: {
										type: 'number',
									},
									id_caracteristica: { type: 'number' },
									caracteristica: { type: 'string' },
									id_ambito: { type: 'number' },
									ambito: { type: 'string' },
								},
							},
						},
						observaciones: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_observacion_oferta: { type: 'number' },
									observacion: { type: 'string' },
									id_tipo_observacion: { type: 'number' },
									tipo_observacion: { type: 'string' },
								},
							},
						},
					},
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Get('obtener-datos-registrados-camping/:id_oferta')
	async obtenerDatosRegistradosCamping(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.pestañaDatosBasicosService.obtenerDatosRegistradosCamping(
			req,
			id_oferta,
		);
	}
}
