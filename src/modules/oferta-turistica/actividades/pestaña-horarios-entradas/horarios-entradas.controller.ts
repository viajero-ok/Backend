import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
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
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';
import { EntradaDto, EntradaNuevaDto } from './dto/entradas.dto';
import { FinalizarRegistroDto } from './dto/finalizar-registro.dto';
import { HorariosTurnosNuevoDto } from './dto/horario-nuevo.dto';
import { HorariosTurnosDto } from './dto/horarios.dto';
import { HorariosEntradasService } from './horarios-entradas.service';

@ApiTags('Actividades/HorariosEntradas')
@ApiBearerAuth()
@Controller('actividades')
export class HorariosEntradasController {
	constructor(
		private readonly horariosEntradasService: HorariosEntradasService,
	) {}

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
		@Body() horarioNuevoDto: HorariosTurnosNuevoDto,
	) {
		return await this.horariosEntradasService.registrarHorario(
			req,
			horarioNuevoDto,
		);
	}

	@ApiOperation({ summary: 'ACTUALIZAR HORARIO' })
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
	@Post('actualizar-horario')
	async actualizarHorario(
		@Req() req: Request,
		@Body() horarioDto: HorariosTurnosDto,
	) {
		return await this.horariosEntradasService.actualizarHorario(
			req,
			horarioDto,
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
		return await this.horariosEntradasService.eliminarHorario(
			req,
			id_horario,
		);
	}

	@ApiOperation({ summary: 'REGISTRAR ENTRADA' })
	@UseGuards(OfertaOwnerGuard)
	@Post('registrar-entrada')
	async registrarEntrada(
		@Req() req: Request,
		@Body() entradaNueva: EntradaNuevaDto,
	) {
		return await this.horariosEntradasService.registrarEntrada(
			req,
			entradaNueva,
		);
	}

	@ApiOperation({ summary: 'ACTUALIZAR ENTRADA' })
	@UseGuards(OfertaOwnerGuard)
	@Post('actualizar-entrada')
	async actualizarEntrada(@Req() req: Request, @Body() entrada: EntradaDto) {
		return await this.horariosEntradasService.actualizarEntrada(
			req,
			entrada,
		);
	}

	@ApiOperation({ summary: 'ELIMINAR ENTRADA' })
	@Delete('eliminar-entrada/:id_entrada')
	async eliminarEntrada(
		@Req() req: Request,
		@Param('id_entrada') id_entrada: string,
	) {
		return await this.horariosEntradasService.eliminarEntrada(
			req,
			id_entrada,
		);
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
		@Body() finalizarRegistroDto: FinalizarRegistroDto,
	) {
		return await this.horariosEntradasService.finalizarRegistroActividad(
			req,
			finalizarRegistroDto,
		);
	}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRADOS HORARIOS Y ENTRADAS' })
	@ApiResponse({
		status: 200,
		description: 'Datos registrados de horarios y entradas',
		schema: {
			type: 'object',
			properties: {
				datos_horarios_entradas: {
					type: 'object',
					properties: {
						horarios_turnos: {
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
						entradas: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_tipo_entrada: { type: 'number' },
									nombre_tipo_entrada: { type: 'string' },
									descripcion_tipo_entrada: {
										type: 'string',
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
	@Get('obtener-datos-registrados-horarios-y-entradas/:id_oferta')
	async obtenerDatosRegistradosHorariosYEntradas(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.horariosEntradasService.obtenerDatosRegistradosHorariosYEntradas(
			req,
			id_oferta,
		);
	}
}
