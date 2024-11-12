import {
	Controller,
	Get,
	Delete,
	Param,
	Post,
	Req,
	Body,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { RegistrarReservaAlojamientoDto } from './dto/registrar-reserva-alojamiento.dto';
import { RegistrarReservaActividadDto } from './dto/registrar-reserva-actividad.dto';

@ApiTags('Reservas')
@ApiBearerAuth()
@Controller('reservas')
export class ReservasController {
	constructor(private readonly reservasService: ReservasService) {}

	@ApiOperation({ summary: 'OBTENER OFERTAS RESERVADAS POR USUARIO' })
	@Get('obtener-ofertas-reservadas-por-usuario')
	async obtenerOfertasReservadasPorUsuario(@Req() req: Request) {
		return await this.reservasService.obtenerOfertasReservadasPorUsuario(
			req,
		);
	}

	@ApiOperation({ summary: 'OBTENER RESERVAS POR PRESTADOR' })
	@ApiResponse({
		status: 200,
		description: 'Reservas obtenidas correctamente',
		schema: {
			type: 'object',
			properties: {
				estados_reserva: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_estado: { type: 'number', example: 7 },
							nombre_estado: {
								type: 'string',
								example: 'Pendiente de pago',
							},
						},
					},
				},
				reservas: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_reserva: {
								type: 'string',
								example: '271185d8-a09e-11ef-82ba-0242ac140003',
							},
							fecha_inicio: {
								type: 'string',
								format: 'date-time',
								example: '2024-12-05T03:00:00.000Z',
							},
							fecha_fin: {
								type: 'string',
								format: 'date-time',
								example: '2024-12-07T03:00:00.000Z',
							},
							monto_final: { type: 'string', example: '0.00' },
							id_oferta_turistica: {
								type: 'string',
								example: '2b1f6c72-9fb9-11ef-b3ca-0242ac140003',
							},
							nombre_oferta: {
								type: 'string',
								example: 'Hotel Paraíso 2',
							},
							descripcion_oferta: {
								type: 'string',
								example: 'Un hermoso hotel con vista al mar',
							},
							id_tipo_oferta: { type: 'number', example: 1 },
							tipo_oferta: {
								type: 'string',
								example: 'Alojamiento',
							},
							id_sub_tipo_oferta: { type: 'number', example: 1 },
							sub_tipo_oferta: {
								type: 'string',
								example: 'En habitaciones',
							},
							id_estado_reserva: { type: 'number', example: 7 },
							estado_reserva: {
								type: 'string',
								example: 'Pendiente de pago',
							},
							id_turista: {
								type: 'string',
								example: 'f0223886-8590-11ef-8ae1-0242ac140002',
							},
							nombre_turista: {
								type: 'string',
								example: 'Federico',
							},
							apellido_turista: {
								type: 'string',
								example: 'Cañete',
							},
						},
					},
				},
				detalles_reserva: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_reserva: {
								type: 'string',
								example: 'c5ce8267-a0a1-11ef-82ba-0242ac140003',
							},
							id_oferta_turistica: {
								type: 'string',
								example: '2b1f6c72-9fb9-11ef-b3ca-0242ac140003',
							},
							id_tipo_detalle: {
								type: 'string',
								example: 'e4a9a9ef-9a3b-11ef-9129-0242ac140007',
							},
							nombre_tipo_detalle: {
								type: 'string',
								example: 'Habitación triple',
							},
							id_tipo_entrada: { type: 'string', nullable: true },
							nombre_tipo_entrada: {
								type: 'string',
								nullable: true,
							},
							cantidad_detalle_entrada: {
								type: 'number',
								example: 1,
							},
							precio_unitario: {
								type: 'string',
								example: '0.00',
							},
							monto_total_detalle: {
								type: 'string',
								example: '0.00',
							},
						},
					},
				},
				turistas: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_turista: {
								type: 'string',
								example: '2ac0a66c-576e-11ef-8d6a-0242ac140002',
							},
							nombre_turista: {
								type: 'string',
								example: 'Mariano',
							},
							apellido_turista: {
								type: 'string',
								example: 'Luque',
							},
						},
					},
				},
				ofertas: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_oferta_turistica: {
								type: 'string',
								example: '0232c8de-9b26-11ef-9129-0242ac140007',
							},
							nombre_oferta: {
								type: 'string',
								example: 'Senderismo en la Sierra Nevada',
							},
						},
					},
				},
			},
		},
	})
	@Get('obtener-reservas-por-prestador')
	async obtenerReservasPorPrestador(@Req() req: Request) {
		return await this.reservasService.obtenerReservasPorPrestador(req);
	}

	@ApiOperation({ summary: 'RESERVAR ALOJAMIENTO' })
	@ApiResponse({
		status: 201,
		description: 'Reserva registrada correctamente',
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
				id_reserva: {
					type: 'number',
					example: 1,
				},
			},
		},
	})
	@Post('reservar-alojamiento')
	async reservarOfertaTuristica(
		@Req() req,
		@Body() registrarReservaAlojamientoDto: RegistrarReservaAlojamientoDto,
	) {
		return await this.reservasService.reservarAlojamiento(
			req,
			registrarReservaAlojamientoDto,
		);
	}

	@ApiOperation({ summary: 'RESERVAR ACTIVIDAD' })
	@ApiResponse({
		status: 201,
		description: 'Reserva registrada correctamente',
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
				id_reserva: {
					type: 'number',
					example: 1,
				},
			},
		},
	})
	@Post('reservar-actividad')
	async reservarActividad(
		@Req() req,
		@Body() registrarReservaActividadDto: RegistrarReservaActividadDto,
	) {
		return await this.reservasService.reservarActividad(
			req,
			registrarReservaActividadDto,
		);
	}

	@ApiOperation({ summary: 'CANCELAR RESERVA DE OFERTA TURÍSTICA' })
	@ApiResponse({
		status: 200,
		description: 'Reserva cancelada correctamente',
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
	@Delete('cancelar-reserva-oferta-turistica/:id_reserva')
	async cancelarReservaOfertaTuristica(
		@Req() req: Request,
		@Param('id_reserva') id_reserva: string,
	) {
		return await this.reservasService.cancelarReservaOfertaTuristica(
			req,
			id_reserva,
		);
	}
}
