import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Req,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { multerHabitacionConfig } from '../utils/multer-habitacion.config';
import { HabitacionesService } from './habitaciones.service';
import { HabitacionDto } from './dto/habitacion.dto';
import { RegistrarHabitacionDto } from './dto/registrar-habitacion.dto';
import { RegistrarImagenHabitacionDto } from './dto/registrar-imagen-habitacion.dto';

@ApiTags('Alojamientos/Habitaciones')
@Controller('alojamientos')
export class HabitacionesController {
	constructor(private readonly habitacionesService: HabitacionesService) {}

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
		return await this.habitacionesService.obtenerDatosRegistroHabitacion();
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
		@Body() registrarHabitacionDto: RegistrarHabitacionDto,
	) {
		return await this.habitacionesService.registrarHabitacion(
			req,
			registrarHabitacionDto,
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
		return await this.habitacionesService.actualizarHabitacion(
			req,
			habitacionDto,
		);
	}

	@ApiOperation({ summary: 'ELIMINAR HABITACION' })
	@ApiResponse({
		status: 200,
		schema: {
			type: 'object',
			properties: {
				resultado: { type: 'string', example: 'ok' },
				statusCode: { type: 'number', example: 200 },
			},
		},
	})
	@Delete('eliminar-habitacion/:id_tipo_detalle')
	async eliminarHabitacion(
		@Req() req: Request,
		@Param('id_tipo_detalle') id_tipo_detalle: string,
	) {
		return await this.habitacionesService.eliminarHabitacion(
			req,
			id_tipo_detalle,
		);
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
		@UploadedFile() imagen: Express.Multer.File,
		@Body() registrarImagenHabitacionDto: RegistrarImagenHabitacionDto,
	) {
		return await this.habitacionesService.registrarImagenHabitacion(
			req,
			imagen,
			registrarImagenHabitacionDto,
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
		return await this.habitacionesService.eliminarImagenHabitacion(
			req,
			id_imagen,
		);
	}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRADOS' })
	@ApiResponse({
		status: 200,
		schema: {
			type: 'object',
			properties: {
				datos: {
					type: 'object',
				},
			},
		},
	})
	@Get('obtener-datos-registrados-habitacion/:id_oferta')
	async obtenerDatosRegistradosHabitacion(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.habitacionesService.obtenerDatosRegistradosHabitacion(
			req,
			id_oferta,
		);
	}
}
