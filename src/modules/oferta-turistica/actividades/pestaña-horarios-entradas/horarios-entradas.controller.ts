import {
	Body,
	Controller,
	Delete,
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
import { HorariosEntradasService } from './horarios-entradas.service';
import { HorarioVacioDto } from './dto/horario-vacio.dto';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';
import { EntradaVaciaDto } from './dto/entrada-vacia.dto';
import { FinalizarRegistroDto } from './dto/finalizar-registro.dto';

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
		@Body() horarioVacioDto: HorarioVacioDto,
	) {
		return await this.horariosEntradasService.registrarHorario(
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
		@Body() entradaVaciaDto: EntradaVaciaDto,
	) {
		return await this.horariosEntradasService.registrarEntrada(
			req,
			entradaVaciaDto,
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
}
