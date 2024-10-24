import {
	Controller,
	Param,
	Get,
	UseGuards,
	Req,
	Delete,
	Patch,
	Body,
	Post,
} from '@nestjs/common';
import { PublicacionesAlojamientosService } from './publicaciones-alojamientos.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';
import { ActualizarTarifasDto } from './dto/actualizar-tarifa.dto';
import { RegistrarTarifasDto } from './dto/registrar-tarifa.dto';

@ApiTags('Publicaciones/Alojamientos')
@ApiBearerAuth()
@Controller('publicaciones/alojamientos')
export class PublicacionesAlojamientosController {
	constructor(
		private readonly publicacionesAlojamientosService: PublicacionesAlojamientosService,
	) {}

	@ApiOperation({ summary: 'OBTENER DATOS PUBLICACION ALOJAMIENTO' })
	@ApiResponse({
		status: 200,
		description: 'Datos de publicacion alojamiento',
		schema: {
			type: 'object',
			properties: {
				tipos_detalle: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id_tipo_detalle: { type: 'number', example: 1 },
							nombre_tipo_detalle: {
								type: 'string',
								example: 'Doble',
							},
						},
					},
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Get('datos-publicacion-alojamiento/:id_oferta')
	async obtenerDatosPublicacionAlojamiento(
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.publicacionesAlojamientosService.obtenerDatosPublicacionAlojamiento(
			id_oferta,
		);
	}

	@ApiOperation({ summary: 'REGISTRAR TARIFA' })
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
	async registrarTarifa(
		@Req() req: Request,
		@Body() tarifasDto: RegistrarTarifasDto,
	) {
		return await this.publicacionesAlojamientosService.registrarTarifa(
			req,
			tarifasDto,
		);
	}

	@ApiOperation({ summary: 'ACTUALIZAR TARIFA' })
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
	@Patch('actualizar-tarifa')
	async actualizarTarifa(
		@Req() req: Request,
		@Body() actualizarTarifasDto: ActualizarTarifasDto,
	) {
		return await this.publicacionesAlojamientosService.actualizarTarifa(
			req,
			actualizarTarifasDto,
		);
	}

	@ApiOperation({ summary: 'ELIMINAR TARIFA' })
	@ApiResponse({
		status: 200,
		description: 'TARIFA ELIMINADA',
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
	@Delete('eliminar-tarifa/:id_tarifa')
	async eliminarTarifa(
		@Req() req: Request,
		@Param('id_tarifa') id_tarifa: number,
	) {
		return await this.publicacionesAlojamientosService.eliminarTarifa(
			req,
			id_tarifa,
		);
	}

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRADOS' })
	@ApiResponse({
		status: 200,
		schema: {
			type: 'object',
			properties: {
				datos: {
					type: 'array',
					items: {
						type: 'object',
					},
				},
			},
		},
	})
	@UseGuards(OfertaOwnerGuard)
	@Get('obtener-datos-registrados-tarifa/:id_oferta')
	async obtenerDatosRegistradosTarifa(
		@Req() req: Request,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.publicacionesAlojamientosService.obtenerDatosRegistradosTarifa(
			req,
			id_oferta,
		);
	}
}
