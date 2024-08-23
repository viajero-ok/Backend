import {
	Controller,
	HttpException,
	HttpStatus,
	Post,
	Req,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { AlojamientosService } from './alojamientos.service';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
	getSchemaPath,
} from '@nestjs/swagger';
import { AlojamientoDto } from './dto/alojamiento.dto';
import { Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../utils/multer.config';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { eliminarArchivos } from '../utils/eliminar-archivos';

@ApiTags('Alojamientos')
@ApiBearerAuth()
@Controller('alojamientos')
export class AlojamientosController {
	constructor(private readonly alojamientosService: AlojamientosService) {}

	@ApiOperation({ summary: 'REGISTRAR ALOJAMIENTO' })
	@ApiResponse({
		status: 201,
		description: 'Registro exitoso.',
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
		status: 400,
		description: 'No se ha enviado información del alojamiento.',
		schema: {
			type: 'object',
			properties: {
				statusCode: { type: 'number', example: 400 },
				message: {
					type: 'string',
					example: 'No se ha enviado información del alojamiento.',
				},
			},
		},
	})
	@ApiResponse({
		status: 400,
		description: 'Solicitud inválida o datos de validación incorrectos.',
		schema: {
			type: 'object',
			properties: {
				statusCode: { type: 'number', example: 400 },
				message: {
					type: 'object',
					example: {
						'habitaciones.habitaciones[0].nombre': [
							'El nombre de la habitación es requerido',
						],
						'habitaciones.habitaciones[0].capacidad': [
							'La capacidad debe ser un número',
						],
					},
				},
				error: { type: 'string', example: 'Validation failed' },
			},
		},
	})
	@ApiBody({
		description: 'Información del alojamiento y archivos de habitaciones',
		schema: {
			type: 'object',
			properties: {
				...Array.from({ length: 5 }, (_, i) => ({
					[`habitacion${i + 1}`]: {
						type: 'array',
						items: {
							type: 'string',
							format: 'binary',
						},
						description: `Archivos para la habitación ${i + 1}`,
					},
				})).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
				alojamiento: {
					$ref: getSchemaPath(AlojamientoDto),
				},
			},
		},
	})
	@ApiConsumes('multipart/form-data')
	@Post('registrar-alojamiento')
	@UseInterceptors(
		FileFieldsInterceptor(
			Array.from({ length: 100 }, (_, i) => ({
				name: `habitacion${i + 1}`,
				maxCount: 10,
			})),
			multerConfig,
		),
	)
	async registrarAlojamiento(
		@Req() req: Request,
		@UploadedFiles() files: { [fieldname: string]: Express.Multer.File[] },
	) {
		try {
			if (!req.body.alojamiento) {
				throw new HttpException(
					'No se ha enviado información del alojamiento.',
					HttpStatus.BAD_REQUEST,
				);
			}
			const alojamientoJson = JSON.parse(req.body.alojamiento);

			// Crear una instancia de AlojamientoDto utilizando plainToInstance
			const alojamiento = plainToInstance(
				AlojamientoDto,
				alojamientoJson,
			);

			const errors = await validate(alojamiento);
			if (errors.length > 0) {
				const formattedErrors = this.formatErrors(errors);
				throw new HttpException(
					{
						message: formattedErrors,
						error: 'Validation failed',
						statusCode: HttpStatus.BAD_REQUEST,
					},
					HttpStatus.BAD_REQUEST,
				);
			}

			return await this.alojamientosService.registrarAlojamiento(
				req,
				alojamiento,
				files,
			);
		} catch (error) {
			await eliminarArchivos(
				Object.values(files)
					.flat()
					.map((file) => file.path),
			);
			throw error;
		}
	}
	formatErrors(errors: ValidationError[], parentPath = ''): any {
		return errors.reduce((acc, error) => {
			const propertyPath = parentPath
				? `${parentPath}.${error.property}`
				: error.property;

			if (error.constraints) {
				acc[propertyPath] = Object.values(error.constraints);
			}

			if (error.children && error.children.length > 0) {
				Object.assign(
					acc,
					this.formatErrors(error.children, propertyPath),
				);
			}

			return acc;
		}, {});
	}
}
