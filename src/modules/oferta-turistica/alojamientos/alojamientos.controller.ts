import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { AlojamientosService } from './alojamientos.service';
import { CreateAlojamientoDto } from './dto/create-alojamiento.dto';
import { UpdateAlojamientoDto } from './dto/update-alojamiento.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EstablecimientoDto } from './dto/establecimiento.dto';

@ApiTags('Alojamientos')
@Controller('alojamientos')
export class AlojamientosController {
	constructor(private readonly alojamientosService: AlojamientosService) {}

	@ApiOperation({ summary: 'REGISTRAR ESTABLECIMIENTO' })
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
			},
		},
	})
	@ApiResponse({
		status: 409,
		schema: {
			type: 'object',
			properties: {
				statusCode: {
					type: 'number',
					example: 409,
				},
				message: {
					type: 'string',
					example:
						'Error al registrar establecimiento',
				},
			},
		},
	})
	@ApiBearerAuth()
	@Post('registrar-establecimiento')
	registrarEstablecimiento(@Body() establecimientoDto: EstablecimientoDto) {
		return this.alojamientosService.registrarEstablecimiento(establecimientoDto);
	}
}
