import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	UploadedFile,
	UseInterceptors,
	Delete,
	Param,
	Patch,
} from '@nestjs/common';
import { AlojamientosService } from './alojamientos.service';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { AlojamientoDto } from './dto/alojamiento/alojamiento.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { HabitacionDto } from './dto/habitacion/habitacion.dto';
import { HabitacionVaciaDto } from './dto/habitacion/habitacion-vacia.dto';
import { TarifasDto } from './dto/tarifa/tarifa.dto';
import { DetalleAlojamientoDto } from './dto/detalle-alojamiento.dto';
import { multerHabitacionConfig } from '../utils/multer-habitacion.config';

@ApiTags('Alojamientos')
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

	@ApiOperation({ summary: 'ELIMINAR ALOJAMIENTO' })
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
	@Delete('eliminar-alojamiento/:id_oferta')
	async eliminarAlojamiento(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.alojamientosService.eliminarAlojamiento(
			req,
			id_oferta,
		);
	}

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
			},
		},
	})
	@Get('datos-registro-habitacion')
	async obtenerDatosRegistroHabitacion() {
		return await this.alojamientosService.obtenerDatosRegistroHabitacion();
	}

	@ApiOperation({ summary: 'REGISTRAR IMAGEN HABITACIÓN' })
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
				id_imagen: {
					type: 'number',
					example: 1,
				},
			},
		},
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				imagen: {
					type: 'string',
					format: 'binary',
					description: 'Archivo de imagen del alojamiento',
				},
				id_tipo_detalle: {
					type: 'string',
					description: 'ID de la habitación del alojamiento',
				},
			},
		},
	})
	@ApiConsumes('multipart/form-data')
	@Post('registrar-imagen-habitacion')
	@UseInterceptors(FileInterceptor('imagen', multerHabitacionConfig))
	async registrarImagenHabitacion(
		@Req() req: Request,
		@UploadedFile() file: Express.Multer.File,
		@Body('id_tipo_detalle') id_tipo_detalle: string,
	) {
		return await this.alojamientosService.registrarImagenHabitacion(
			req,
			file,
			id_tipo_detalle,
		);
	}

	@ApiOperation({ summary: 'ELIMINAR IMAGEN HABITACIÓN' })
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
	@Delete('eliminar-imagen-habitacion/:id_imagen')
	async eliminarImagenHabitacion(
		@Req() req: Request,
		@Param('id_imagen') id_imagen: string,
	) {
		return await this.alojamientosService.eliminarImagenHabitacion(
			req,
			id_imagen,
		);
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
	@Post('registrar-habitacion')
	async registrarHabitacion(
		@Req() req: Request,
		@Body() habitacionVaciaDto: HabitacionVaciaDto,
	) {
		return await this.alojamientosService.registrarHabitacion(
			req,
			habitacionVaciaDto,
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
	@Patch('actualizar-habitacion')
	async actualizarHabitacion(
		@Req() req: Request,
		@Body() habitacionDto: HabitacionDto,
	) {
		return await this.alojamientosService.actualizarHabitacion(
			req,
			habitacionDto,
		);
	}

	@ApiOperation({ summary: 'ELIMINAR HABITACION' })
	@Delete('eliminar-habitacion/:id_tipo_detalle')
	async eliminarHabitacion(
		@Req() req: Request,
		@Param('id_tipo_detalle') id_tipo_detalle: string,
	) {
		return await this.alojamientosService.eliminarHabitacion(
			req,
			id_tipo_detalle,
		);
	}

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
	async obtenerDatosRegistroTarifa() {
		return await this.alojamientosService.obtenerDatosRegistroTarifa();
	}

	@ApiOperation({ summary: 'ABM TARIFA' })
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
	async registrarTarifa(@Req() req: Request, @Body() tarifaDto: TarifasDto) {
		return await this.alojamientosService.registrarTarifa(req, tarifaDto);
	}

	@ApiOperation({ summary: 'FINALIZAR REGISTRO DE ALOJAMIENTO' })
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
	@Post('finalizar-registro-alojamiento')
	async finalizarRegistroAlojamiento(
		@Req() req: Request,
		@Body() detalleAlojamientoDto: DetalleAlojamientoDto,
	) {
		return await this.alojamientosService.finalizarRegistroAlojamiento(
			req,
			detalleAlojamientoDto,
		);
	}
}
