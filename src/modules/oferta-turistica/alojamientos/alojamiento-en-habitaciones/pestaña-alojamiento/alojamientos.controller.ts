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
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';
import { AlojamientosService } from './alojamientos.service';
import { AlojamientoDto } from './dto/alojamiento.dto';
import { HorarioDto, HorarioNuevoDto } from './dto/horarios.dto';

@ApiTags('Alojamientos/Alojamiento')
@ApiBearerAuth()
@Controller('alojamientos')
export class AlojamientosController {
	constructor(private readonly alojamientosService: AlojamientosService) {}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRO ALOJAMIENTO' })
	@ApiResponse({
		status: 200,
		description: 'Datos para el registro de la habitación',
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
										example: 'Sala de estar',
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
								example: 'Transferencia',
							},
						},
					},
				},
			},
		},
	})
	@Get('datos-registro-alojamiento')
	async obtenerDatosRegistroAlojamiento() {
		return await this.alojamientosService.obtenerDatosRegistroAlojamiento();
	}

	@ApiOperation({ summary: 'ACTUALIZAR ALOJAMIENTO' })
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
		description: 'Error al registrar alojamiento.',
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
	@ApiResponse({
		status: 409,
		description: 'Error al registrar horario.',
		schema: {
			type: 'object',
			properties: {
				statusCode: { type: 'number', example: 409 },
				message: {
					type: 'string',
					example: 'Error al registrar horario.',
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Patch('actualizar-alojamiento')
	async actualizarAlojamiento(
		@Req() req: Request,
		@Body()
		alojamientoDto: AlojamientoDto,
	) {
		return await this.alojamientosService.actualizarAlojamiento(
			req,
			alojamientoDto,
		);
	}

	@ApiOperation({ summary: 'REGISTRAR HORARIO' })
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
				id_horario: {
					type: 'string',
					example: '123e4567-e89b-12d3-a456-426614174000',
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Post('registrar-horario')
	async registrarHorario(
		@Req() req: Request,
		@Body() horarioNuevoDto: HorarioNuevoDto,
	) {
		return await this.alojamientosService.registrarHorario(horarioNuevoDto);
	}

	@ApiOperation({ summary: 'MODIFICAR HORARIO' })
	@ApiResponse({
		status: 200,
	})
	@UseGuards(OfertaOwnerGuard)
	@Post('modificar-horario')
	async modificarHorario(
		@Req() req: Request,
		@Body() horarioDto: HorarioDto,
	) {
		return await this.alojamientosService.modificarHorario(horarioDto);
	}

	@ApiOperation({ summary: 'ELIMINAR HORARIO' })
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
	@Delete('eliminar-horario/:id_horario')
	async eliminarHorario(
		@Req() req: Request,
		@Param('id_horario') id_horario: string,
	) {
		return await this.alojamientosService.eliminarHorario(req, id_horario);
	}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRADOS' })
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
						horarios_checkin_checkout: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_horario: { type: 'number' },
									check_in_hora: { type: 'number' },
									check_in_minuto: { type: 'number' },
									check_out_hora: { type: 'number' },
									check_out_minuto: { type: 'number' },
									aplica_lunes: { type: 'number' },
									aplica_martes: { type: 'number' },
									aplica_miercoles: { type: 'number' },
									aplica_jueves: { type: 'number' },
									aplica_viernes: { type: 'number' },
									aplica_sabado: { type: 'number' },
									aplica_domingo: { type: 'number' },
									cupo_maximo: {
										type: 'number',
										nullable: true,
									},
									cupo_actual: {
										type: 'number',
										nullable: true,
									},
									sin_cupo: {
										type: 'number',
										nullable: true,
									},
								},
							},
						},
					},
				},
				imagenes: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_imagen: { type: 'number' },
							nombre: { type: 'string' },
							datos: { type: 'string' },
						},
					},
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Get('obtener-datos-registrados-alojamiento/:id_oferta')
	async obtenerDatosRegistradosAlojamiento(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.alojamientosService.obtenerDatosRegistradosAlojamiento(
			req,
			id_oferta,
		);
	}

	@ApiOperation({ summary: 'Obtener horarios registrados' })
	@ApiResponse({ status: 200 })
	@UseGuards(OfertaOwnerGuard)
	@Get('obtener-horarios-registrados/:id_oferta')
	async obtenerHorariosRegistrados(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.alojamientosService.obtenerHorariosRegistrados(
			id_oferta,
		);
	}
}
