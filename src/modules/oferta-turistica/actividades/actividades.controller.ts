import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { GuiaDto } from './dto/guia.dto';
import { EliminarGuiaDto } from './dto/eliminar-guia.dto';

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
	@Delete('eliminar-guia')
	async eliminarGuia(
		@Req() req: Request,
		@Body() eliminarGuiaDto: EliminarGuiaDto,
	) {
		return await this.actividadesService.eliminarGuia(req, eliminarGuiaDto);
	}
}
