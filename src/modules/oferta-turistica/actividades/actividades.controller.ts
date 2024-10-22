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
import { ActividadesService } from './actividades.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { GuiaDto } from './dto/pestaña-actividad/guia.dto';
import { EliminarGuiaDto } from './dto/pestaña-actividad/eliminar-guia.dto';
import { ActividadDto } from './dto/pestaña-actividad/actividad.dto';
import { UbicacionActividadDto } from './dto/pestaña-ubicacion/ubicacion-actividad.dto';
import { HorarioVacioDto } from './dto/pestaña-tarifas/horario-vacio.dto';
import { HorariosOfertaDto } from './dto/pestaña-tarifas/horarios-oferta.dto';
import { TarifasDto } from './dto/pestaña-tarifas/tarifa.dto';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';

@ApiTags('Actividades')
@ApiBearerAuth()
@Controller('actividades')
export class ActividadesController {
	constructor(private readonly actividadesService: ActividadesService) {}

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
			},
		},
	})
	@Get('datos-registro-actividades')
	async obtenerDatosRegistroActividades() {
		return await this.actividadesService.obtenerDatosRegistroActividades();
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
		return await this.actividadesService.registrarGuia(req, guiaDto);
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
		return await this.actividadesService.eliminarGuia(req, eliminarGuiaDto);
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
		return await this.actividadesService.actualizarActividad(
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
		return await this.actividadesService.eliminarActividad(req, id_oferta);
	}

	@ApiOperation({ summary: 'REGISTRAR UBICACION ACTIVIDAD' })
	@ApiResponse({
		status: 201,
		description: 'Ubicacion registrada',
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
	@Post('registrar-ubicacion-actividad')
	async registrarUbicacionActividad(
		@Req() req: Request,
		@Body() ubicacionDto: UbicacionActividadDto,
	) {
		return await this.actividadesService.registrarUbicacionActividad(
			req,
			ubicacionDto,
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
		@Body() horarioVacioDto: HorarioVacioDto,
	) {
		return await this.actividadesService.registrarHorario(
			req,
			horarioVacioDto,
		);
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
		return await this.actividadesService.eliminarHorario(req, id_horario);
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
	async registrarTarifa(@Req() req: Request, @Body() tarifaDto: TarifasDto) {
		return await this.actividadesService.registrarTarifa(req, tarifaDto);
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
	@UseGuards(OfertaOwnerGuard)
	@Delete('eliminar-tarifa/:id_tarifa')
	async eliminarTarifa(
		@Req() req: Request,
		@Param('id_tarifa') id_tarifa: string,
	) {
		return await this.actividadesService.eliminarTarifa(req, id_tarifa);
	}

	@ApiOperation({ summary: 'FINALIZAR REGISTRO ACTIVIDAD' })
	@ApiResponse({
		status: 201,
		description: 'Actividad registrada',
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
	@Post('finalizar-registro-actividad')
	async finalizarRegistroActividad(
		@Req() req: Request,
		@Body() horariosOfertaDto: HorariosOfertaDto,
	) {
		return await this.actividadesService.finalizarRegistroActividad(
			req,
			horariosOfertaDto,
		);
	}
}
