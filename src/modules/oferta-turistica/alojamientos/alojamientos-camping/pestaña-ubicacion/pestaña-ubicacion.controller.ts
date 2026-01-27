import {
	Body,
	Controller,
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
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';
import { UbicacionCampingDto } from './dto/ubicacion-camping.dto';
import { PestañaUbicacionService } from './pestaña-ubicacion.service';

@ApiTags('Alojamientos-Camping/Ubicacion')
@ApiBearerAuth()
@Controller('alojamientos-camping')
export class PestañaUbicacionController {
	constructor(
		private readonly pestañaUbicacionService: PestañaUbicacionService,
	) {}

	@ApiOperation({ summary: 'REGISTRAR UBICACION CAMPING' })
	@ApiResponse({
		status: 201,
		description: 'Ubicacion registrada',
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
	@Post('registrar-ubicacion-camping')
	async registrarUbicacionCamping(
		@Req() req: Request,
		@Body()
		ubicacionDto: UbicacionCampingDto,
	) {
		return await this.pestañaUbicacionService.registrarUbicacionCamping(
			req,
			ubicacionDto,
		);
	}

	@ApiOperation({ summary: 'OBTENER UBICACION DEL ESTABLECIMIENTO ASOCIADO' })
	@ApiResponse({
		status: 200,
		description: 'Ubicación del establecimiento asociado',
	})
	@UseGuards(OfertaOwnerGuard)
	@Get('obtener-ubicacion-establecimiento/:id_oferta')
	async obtenerUbicacionEstablecimiento(
		@Req() req,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.pestañaUbicacionService.obtenerUbicacionEstablecimiento(
			req,
			id_oferta,
		);
	}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRADOS UBICACION' })
	@ApiResponse({
		status: 200,
		description: 'Datos de registro de ubicacion',
		schema: {
			type: 'object',
			properties: {
				datos_ubicacion: {
					type: 'object',
					properties: {
						id_domicilio: {
							type: 'null',
							example: null,
						},
						calle: {
							type: 'null',
							example: null,
						},
						sin_numero: {
							type: 'string',
							example: '0',
						},
						numero: {
							type: 'null',
							example: null,
						},
						codigo_postal: {
							type: 'null',
							example: null,
						},
						lote: {
							type: 'null',
							example: null,
						},
						manzana: {
							type: 'null',
							example: null,
						},
						piso: {
							type: 'null',
							example: null,
						},
						torre: {
							type: 'null',
							example: null,
						},
						id_localidad: {
							type: 'null',
							example: null,
						},
						id_departamento: {
							type: 'null',
							example: null,
						},
						id_provincia: {
							type: 'null',
							example: null,
						},
						id_pais: {
							type: 'null',
							example: null,
						},
						barrio: {
							type: 'null',
							example: null,
						},
						latitud: {
							type: 'null',
							example: null,
						},
						longitud: {
							type: 'null',
							example: null,
						},
						id_observacion_oferta: {
							type: 'null',
							example: null,
						},
						observacion: {
							type: 'null',
							example: null,
						},
					},
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Get('obtener-datos-registrados-ubicacion/:id_oferta')
	async obtenerDatosRegistradosUbicacion(
		@Req() req,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.pestañaUbicacionService.obtenerDatosRegistradosUbicacion(
			req,
			id_oferta,
		);
	}
}
