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
import { multerConfig } from '../utils/multer.config';
import { AlojamientoVacioDto } from './dto/alojamiento/alojamiento-vacio.dto';
import { HabitacionDto } from './dto/habitacion/habitacion.dto';
import { HabitacionVaciaDto } from './dto/habitacion/habitacion-vacia.dto';
import { TarifaDto } from './dto/tarifa/tarifa.dto';
import { DetalleAlojamientoDto } from './dto/detalle-alojamiento.dto';

@ApiTags('Alojamientos')
@ApiBearerAuth()
@Controller('alojamientos')
export class AlojamientosController {
	constructor(private readonly alojamientosService: AlojamientosService) {}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRO ALOJAMIENTO' })
	@ApiResponse({
		status: 200,
		description: 'Datos para el registro del alojamiento',
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
	@Get('datos-registro')
	async obtenerDatosRegistro() {
		return await this.alojamientosService.obtenerDatosRegistro();
	}

	@ApiOperation({ summary: 'REGISTRAR ALOJAMIENTO VACIO' })
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
	@Post('registrar-alojamiento-vacio')
	async registrarAlojamientoVacio(
		@Req() req: Request,
		@Body() alojamientoVacioDto: AlojamientoVacioDto,
	) {
		return await this.alojamientosService.registrarAlojamientoVacio(
			req,
			alojamientoVacioDto,
		);
	}

	@ApiOperation({ summary: 'ABM ALOJAMIENTO SIN IMAGENES' })
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
	@Post('registrar-alojamiento')
	async registrarAlojamiento(
		@Req() req: Request,
		@Body()
		alojamientoDto: AlojamientoDto,
	) {
		return await this.alojamientosService.registrarAlojamiento(
			req,
			alojamientoDto,
		);
	}

	@ApiOperation({ summary: 'REGISTRAR IMAGEN ALOJAMIENTO' })
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
				id_oferta: {
					type: 'string',
					description: 'ID de la oferta del alojamiento',
				},
			},
		},
	})
	@ApiConsumes('multipart/form-data')
	@Post('registrar-imagen-alojamiento')
	@UseInterceptors(FileInterceptor('imagen', multerConfig))
	async registrarImagenAlojamiento(
		@Req() req: Request,
		@UploadedFile() file: Express.Multer.File,
		@Body('id_oferta') id_oferta: string,
	) {
		return await this.alojamientosService.registrarImagenAlojamiento(
			req,
			file,
			id_oferta,
		);
	}

	@ApiOperation({ summary: 'ELIMINAR IMAGEN ALOJAMIENTO' })
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
	@Delete('eliminar-imagen-alojamiento/:id_imagen')
	async eliminarImagenAlojamiento(
		@Req() req: Request,
		@Param('id_imagen') id_imagen: string,
	) {
		return await this.alojamientosService.eliminarImagenAlojamiento(
			req,
			id_imagen,
		);
	}

	@ApiOperation({ summary: 'REGISTRAR HABITACION VACIA' })
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
	@Post('registrar-habitacion-vacia')
	async registrarHabitacionVacia(
		@Req() req: Request,
		@Body() habitacionVaciaDto: HabitacionVaciaDto,
	) {
		return await this.alojamientosService.registrarHabitacionVacia(
			req,
			habitacionVaciaDto,
		);
	}

	@ApiOperation({ summary: 'ABM HABITACION' })
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
		@Body() habitacionDto: HabitacionDto,
	) {
		return await this.alojamientosService.registrarHabitacion(
			req,
			habitacionDto,
		);
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
	async registrarTarifa(@Req() req: Request, @Body() tarifaDto: TarifaDto) {
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
