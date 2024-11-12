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
