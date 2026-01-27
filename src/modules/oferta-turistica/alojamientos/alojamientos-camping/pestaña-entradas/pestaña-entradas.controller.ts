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
import { Request } from 'express';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';
import {
	EntradaCampingDto,
	EntradaCampingNuevaDto,
} from './dto/entrada-camping.dto';
import { PestañaEntradasService } from './pestaña-entradas.service';

@ApiTags('Alojamientos/Camping/Entradas')
@ApiBearerAuth()
@Controller('alojamientos/camping/pestanna-entradas')
export class PestañaEntradasController {
	constructor(
		private readonly pestañaEntradasService: PestañaEntradasService,
	) {}

	@ApiOperation({ summary: 'REGISTRAR TIPO DE ENTRADA CAMPING' })
	@ApiResponse({
		status: 201,
		description: 'Tipo de entrada registrado exitosamente',
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
				id_entrada: {
					type: 'number',
					example: 1,
				},
			},
		},
	})
	@ApiResponse({
		status: 409,
		description: 'Error al registrar tipo de entrada',
		schema: {
			type: 'object',
			properties: {
				statusCode: { type: 'number', example: 409 },
				message: {
					type: 'string',
					example: 'Error al registrar tipo de entrada',
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Post('registrar-entrada')
	async registrarEntrada(
		@Req() req: Request,
		@Body() entradaNueva: EntradaCampingNuevaDto,
	) {
		return await this.pestañaEntradasService.registrarEntrada(
			req,
			entradaNueva,
		);
	}

	@ApiOperation({ summary: 'ACTUALIZAR TIPO DE ENTRADA CAMPING' })
	@ApiResponse({
		status: 200,
		description: 'Tipo de entrada actualizado exitosamente',
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
				id_entrada: {
					type: 'number',
					example: 1,
				},
			},
		},
	})
	@ApiResponse({
		status: 409,
		description: 'Error al actualizar tipo de entrada',
		schema: {
			type: 'object',
			properties: {
				statusCode: { type: 'number', example: 409 },
				message: {
					type: 'string',
					example: 'Error al actualizar tipo de entrada',
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Post('actualizar-entrada')
	async actualizarEntrada(
		@Req() req: Request,
		@Body() entrada: EntradaCampingDto,
	) {
		return await this.pestañaEntradasService.actualizarEntrada(
			req,
			entrada,
		);
	}

	@ApiOperation({ summary: 'ELIMINAR TIPO DE ENTRADA CAMPING' })
	@ApiResponse({
		status: 200,
		description: 'Tipo de entrada eliminado exitosamente',
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
	@ApiResponse({
		status: 409,
		description: 'Error al eliminar tipo de entrada',
		schema: {
			type: 'object',
			properties: {
				statusCode: { type: 'number', example: 409 },
				message: {
					type: 'string',
					example: 'Error al eliminar tipo de entrada',
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Delete('eliminar-entrada/:id_entrada')
	async eliminarEntrada(
		@Req() req: Request,
		@Param('id_entrada') id_entrada: string,
	) {
		return await this.pestañaEntradasService.eliminarEntrada(
			req,
			id_entrada,
		);
	}

	@ApiOperation({ summary: 'OBTENER TIPOS DE ENTRADAS REGISTRADAS' })
	@ApiResponse({
		status: 200,
		description: 'Datos de tipos de entradas del camping',
		schema: {
			type: 'object',
			properties: {
				datos_entradas: {
					type: 'object',
					properties: {
						entradas: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_tipo_entrada: {
										type: 'number',
										example: 1,
									},
									nombre_tipo_entrada: {
										type: 'string',
										example: 'Pase por día',
									},
									descripcion_tipo_entrada: {
										type: 'string',
										example:
											'Incluye acceso a todas las instalaciones',
									},
									bl_sin_cupo: {
										type: 'boolean',
										example: false,
									},
									cupo_maximo: {
										type: 'number',
										example: 50,
										nullable: true,
									},
								},
							},
						},
					},
				},
			},
		},
	})
	@ApiResponse({
		status: 409,
		description: 'Error al obtener tipos de entradas',
		schema: {
			type: 'object',
			properties: {
				statusCode: { type: 'number', example: 409 },
				message: {
					type: 'string',
					example: 'Error al obtener tipos de entradas registradas',
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Get('obtener-entradas-registradas/:id_oferta')
	async obtenerEntradasRegistradas(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.pestañaEntradasService.obtenerEntradasRegistradas(
			req,
			id_oferta,
		);
	}
}
