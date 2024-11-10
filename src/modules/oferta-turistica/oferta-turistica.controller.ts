import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
	Req,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { OfertaTuristicaService } from './oferta-turistica.service';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { OfertaTuristicaDto } from './dto/oferta-turistica.dto';
import { multerOfertaConfig } from './utils/multer-oferta.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConsultarOfertasDto } from './dto/consultar-ofertas.dto';
import { RegistrarImagenOfertaDto } from './dto/imagenes/registrar-imagen-oferta.dto';
import { Public } from 'src/common/decorators/public/public.decorator';
import { RegistrarOfertaGuardadaDto } from './dto/guardadas/registrar-oferta-guardada.dto';

@ApiTags('Ofertas Turísticas')
@ApiBearerAuth()
@Controller('ofertas-turisticas')
export class OfertaTuristicaController {
	constructor(
		private readonly ofertaTuristicaService: OfertaTuristicaService,
	) {}

	@ApiOperation({ summary: 'OBTENER OFERTAS POR PRESTADOR' })
	@Get('por-prestador')
	async obtenerOfertasPorPrestador(@Req() req: Request) {
		return await this.ofertaTuristicaService.obtenerOfertasPorPrestador(
			req,
		);
	}

	@ApiOperation({ summary: 'OBTENER TIPOS Y SUBTIPOS DE OFERTAS' })
	@ApiResponse({
		status: 200,
		description: 'Listado de tipos y subtipos de oferta',
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
			},
		},
	})
	@Get('tipos-subtipos')
	async obtenerTiposSubtipos() {
		return await this.ofertaTuristicaService.obtenerTiposSubtipos();
	}

	@ApiOperation({ summary: 'REGISTRAR OFERTA TURÍSTICA' })
	@ApiResponse({
		status: 200,
		description: 'Oferta turística registrada correctamente',
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
				id_oferta: {
					type: 'string',
					example: '64d54123648f4a3b38a4b746',
				},
			},
		},
	})
	@Post('registrar-oferta-turistica')
	async registrarOfertaTuristica(
		@Req() req: Request,
		@Body() ofertaTuristicaDto: OfertaTuristicaDto,
	) {
		return await this.ofertaTuristicaService.registrarOfertaTuristica(
			req,
			ofertaTuristicaDto,
		);
	}

	@ApiOperation({ summary: 'REGISTRAR IMAGEN OFERTA TURÍSTICA' })
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
	@UseInterceptors(FileInterceptor('imagen', multerOfertaConfig))
	@Post('registrar-imagen-oferta-turistica')
	async registrarImagenOfertaTuristica(
		@Req() req: Request,
		@Body() registrarImagenOfertaDto: RegistrarImagenOfertaDto,
		@UploadedFile() imagen: Express.Multer.File,
	) {
		const resultado =
			await this.ofertaTuristicaService.registrarImagenOfertaTuristica(
				req,
				imagen,
				registrarImagenOfertaDto,
			);

		return resultado;
	}

	@ApiOperation({ summary: 'ELIMINAR IMAGEN OFERTA TURÍSTICA' })
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
	@Delete('eliminar-imagen-oferta-turistica/:id_imagen')
	async eliminarImagenOfertaTuristica(
		@Req() req: Request,
		@Param('id_imagen') id_imagen: string,
	) {
		return await this.ofertaTuristicaService.eliminarImagenOfertaTuristica(
			req,
			id_imagen,
		);
	}

	@Public()
	@ApiOperation({ summary: 'OBTENER OFERTAS TURÍSTICAS CON PAGINACIÓN' })
	@ApiResponse({
		status: 200,
		description: 'Listado de ofertas turísticas',
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
				ofertas: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_oferta: {
								type: 'string',
								example: '67710514-9cb6-11ef-a123-0242ac140007',
							},
							nombre_oferta: {
								type: 'string',
								example: 'Hotel Paraíso 2',
							},
							descripcion: {
								type: 'string',
								example: 'Un hermoso hotel con vista al mar',
							},
							fecha_alta: {
								type: 'string',
								example: '2024-11-07T06:14:30.000Z',
							},
							fecha_baja: {
								type: 'string',
								nullable: true,
								example: null,
							},
							id_establecimiento: {
								type: 'number',
								example: 21,
							},
							nombre_establecimiento: {
								type: 'string',
								example: 'La Aldea18',
							},
							razon_social_prestador: {
								type: 'string',
								example: 'La mejor razon social',
							},
							id_tipo_oferta: {
								type: 'number',
								example: 1,
							},
							id_subtipo_oferta: {
								type: 'number',
								example: 1,
							},
							subtipo_oferta: {
								type: 'string',
								example: 'En habitaciones',
							},
							garantia_alojamiento: {
								type: 'string',
								example: '100.00',
							},
							pago_anticipado: {
								type: 'string',
								nullable: true,
								example: null,
							},
							porcentaje_pago_anticipado: {
								type: 'string',
								example: '10.00',
							},
							minimo_dias_estadia: {
								type: 'number',
								example: 4,
							},
							nombre_calle: {
								type: 'string',
								example: 'Punta del Oeste',
							},
							nombre_barrio: {
								type: 'string',
								nullable: true,
								example: null,
							},
							id_localidad: {
								type: 'string',
								example: '1',
							},
							localidad: {
								type: 'string',
								example: 'Villa Santos Tesei',
							},
							id_departamento: {
								type: 'string',
								example: '1',
							},
							id_provincia: {
								type: 'string',
								example: '1',
							},
							precios_desde: {
								type: 'string',
								example: '34.50',
							},
							id_tipo_detalle: {
								type: 'string',
								example: '9a41791b-9cb6-11ef-a123-0242ac140007',
							},
						},
					},
				},
			},
		},
	})
	@Get('obtener-ofertas-turisticas')
	async obtenerOfertasTuristicas(
		@Req() req: Request,
		@Query() consultarOfertasDto: ConsultarOfertasDto,
	) {
		return await this.ofertaTuristicaService.obtenerOfertasTuristicas(
			req,
			consultarOfertasDto,
		);
	}

	/* @Public()
	@ApiOperation({ summary: 'OBTENER DETALLES DE UNA OFERTA TURÍSTICA' })
	@ApiResponse({
		status: 200,
		description: 'Listado de ofertas turísticas',
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
				ofertas: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_oferta: {
								type: 'string',
								example: '67710514-9cb6-11ef-a123-0242ac140007',
							},
							nombre_oferta: {
								type: 'string',
								example: 'Hotel Paraíso 2',
							},
							descripcion: {
								type: 'string',
								example: 'Un hermoso hotel con vista al mar',
							},
							fecha_alta: {
								type: 'string',
								example: '2024-11-07T06:14:30.000Z',
							},
							fecha_baja: {
								type: 'string',
								nullable: true,
								example: null,
							},
							id_establecimiento: {
								type: 'number',
								example: 21,
							},
							nombre_establecimiento: {
								type: 'string',
								example: 'La Aldea18',
							},
							razon_social_prestador: {
								type: 'string',
								example: 'La mejor razon social',
							},
							id_tipo_oferta: {
								type: 'number',
								example: 1,
							},
							id_subtipo_oferta: {
								type: 'number',
								example: 1,
							},
							subtipo_oferta: {
								type: 'string',
								example: 'En habitaciones',
							},
							garantia_alojamiento: {
								type: 'string',
								example: '100.00',
							},
							pago_anticipado: {
								type: 'string',
								nullable: true,
								example: null,
							},
							porcentaje_pago_anticipado: {
								type: 'string',
								example: '10.00',
							},
							minimo_dias_estadia: {
								type: 'number',
								example: 4,
							},
							nombre_calle: {
								type: 'string',
								example: 'Punta del Oeste',
							},
							nombre_barrio: {
								type: 'string',
								nullable: true,
								example: null,
							},
							id_localidad: {
								type: 'string',
								example: '1',
							},
							localidad: {
								type: 'string',
								example: 'Villa Santos Tesei',
							},
							id_departamento: {
								type: 'string',
								example: '1',
							},
							id_provincia: {
								type: 'string',
								example: '1',
							},
							precios_desde: {
								type: 'string',
								example: '34.50',
							},
							id_tipo_detalle: {
								type: 'string',
								example: '9a41791b-9cb6-11ef-a123-0242ac140007',
							},
						},
					},
				},
			},
		},
	})
	@Get('obtener-ofertas-turisticas/:id_oferta')
	async obtenerOfertaTuristica(
		@Req() req: Request,
		@Query() consultarOfertasDto: ConsultarOfertasDto,
	) {
		return await this.ofertaTuristicaService.obtenerOfertasTuristicas(
			req,
			consultarOfertasDto,
		);
	} */

	@ApiOperation({ summary: 'OBTENER OFERTAS GUARDADAS POR USUARIO' })
	@ApiResponse({
		status: 200,
		description: 'Listado de ofertas guardadas por usuario',
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
				ofertas_guardadas: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_oferta_guardada: {
								type: 'string',
								example: '36932ba9-9571-11ef-a05a-0242ac140007',
							},
							id_oferta_turistica: {
								type: 'string',
								example: '9d999919-94cb-11ef-a05a-0242ac140007',
							},
							nombre_oferta: {
								type: 'string',
								example: 'Senderismo en la Sierra Nevada',
							},
							descripcion_oferta: {
								type: 'string',
								example:
									'Disfruta de una emocionante caminata por los senderos de la Sierra Nevada, admirando la belleza natural y la diversidad de flora y fauna.',
							},
							id_tipo_oferta: {
								type: 'number',
								example: 2,
							},
							tipo_oferta: {
								type: 'string',
								example: 'Actividad',
							},
							id_sub_tipo_oferta: {
								type: 'number',
								example: 2,
							},
							sub_tipo_oferta: {
								type: 'string',
								example: 'En unidades de vivienda',
							},
						},
					},
				},
			},
		},
	})
	@Get('obtener-ofertas-guardadas-por-usuario')
	async obtenerOfertasGuardadasPorUsuario(@Req() req: Request) {
		return await this.ofertaTuristicaService.obtenerOfertasGuardadasPorUsuario(
			req,
		);
	}

	@ApiOperation({ summary: 'GUARDAR OFERTA TURÍSTICA' })
	@ApiResponse({
		status: 201,
		description: 'Oferta turística guardada correctamente',
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
				id_oferta_guardada: {
					type: 'number',
					example: 1,
				},
			},
		},
	})
	@Post('guardar-oferta-turistica')
	async guardarOfertaTuristica(
		@Req() req: Request,
		@Body() registrarOfertaGuardadaDto: RegistrarOfertaGuardadaDto,
	) {
		return await this.ofertaTuristicaService.registrarOfertaTuristicaGuardada(
			req,
			registrarOfertaGuardadaDto,
		);
	}

	@ApiOperation({ summary: 'ELIMINAR OFERTA TURÍSTICA GUARDADA' })
	@ApiResponse({
		status: 200,
		description: 'Oferta turística guardada eliminada correctamente',
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
	@Delete('eliminar-oferta-turistica-guardada/:id_oferta_guardada')
	async eliminarOfertaTuristicaGuardada(
		@Req() req: Request,
		@Param('id_oferta_guardada') id_oferta_guardada: string,
	) {
		return await this.ofertaTuristicaService.eliminarOfertaTuristicaGuardada(
			req,
			id_oferta_guardada,
		);
	}
}
