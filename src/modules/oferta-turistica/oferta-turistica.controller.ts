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
import { RegistrarImagenOfertaDto } from './dto/registrar-imagen-oferta.dto';
import { Public } from 'src/common/decorators/public/public.decorator';

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
	@Post('registrar-imagen-oferta-turistica')
	@UseInterceptors(FileInterceptor('imagen', multerOfertaConfig))
	async registrarImagenOfertaTuristica(
		@Req() req: Request,
		@UploadedFile() imagen: Express.Multer.File,
		@Body() registrarImagenOfertaDto: RegistrarImagenOfertaDto,
	) {
		return await this.ofertaTuristicaService.registrarImagenOfertaTuristica(
			req,
			imagen,
			registrarImagenOfertaDto,
		);
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
	@Get('obtener-ofertas-turisticas')
	async obtenerOfertasTuristicas(
		@Req() req: Request,
		@Query('pagina') pagina: number,
		@Query('limite') limite: number,
		@Query() consultarOfertasDto: ConsultarOfertasDto,
	) {
		return await this.ofertaTuristicaService.obtenerOfertasTuristicas(
			req,
			pagina,
			limite,
			consultarOfertasDto,
		);
	}

	@ApiOperation({ summary: 'OBTENER OFERTAS GUARDADAS POR USUARIO' })
	@Get('obtener-ofertas-guardadas-por-usuario')
	async obtenerOfertasGuardadasPorUsuario(@Req() req: Request) {
		return await this.ofertaTuristicaService.obtenerOfertasGuardadasPorUsuario(
			req,
		);
	}

	/* @ApiOperation({ summary: 'GUARDAR OFERTA TURÍSTICA' })
	@Post('guardar-oferta-turistica')
	async guardarOfertaTuristica(@Req() req: Request) {
		return await this.ofertaTuristicaService.guardarOfertaTuristica(req);
	}

	@ApiOperation({ summary: 'ELIMINAR OFERTA TURÍSTICA GUARDADA' })
	@Delete('eliminar-oferta-turistica-guardada/:id_oferta')
	async eliminarOfertaTuristicaGuardada(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.ofertaTuristicaService.eliminarOfertaTuristicaGuardada(
			req,
			id_oferta,
		);
	} */

	@ApiOperation({ summary: 'OBTENER OFERTAS RESERVADAS POR USUARIO' })
	@Get('obtener-ofertas-reservadas-por-usuario')
	async obtenerOfertasReservadasPorUsuario(@Req() req: Request) {
		return await this.ofertaTuristicaService.obtenerOfertasReservadasPorUsuario(
			req,
		);
	}

	/* @ApiOperation({ summary: 'RESERVAR OFERTA TURÍSTICA' })
	@Post('reservar-oferta-turistica')
	async reservarOfertaTuristica(@Req() req: Request) {
		return await this.ofertaTuristicaService.reservarOfertaTuristica(req);
	}

	@ApiOperation({ summary: 'ELIMINAR RESERVA DE OFERTA TURÍSTICA' })
	@Delete('eliminar-reserva-oferta-turistica/:id_reserva')
	async eliminarReservaOfertaTuristica(
		@Req() req: Request,
		@Param('id_reserva') id_reserva: string,
	) {
		return await this.ofertaTuristicaService.eliminarReservaOfertaTuristica(
			req,
			id_reserva,
		);
	} */
}
