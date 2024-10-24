import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { PublicacionesActividadesService } from './publicaciones-actividades.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';
import { RegistrarTarifasDto } from './dto/registrar-tarifa.dto';
import { ActualizarTarifasDto } from './dto/actualizar-tarifa.dto';

@ApiTags('Publicaciones/Actividades')
@ApiBearerAuth()
@Controller('publicaciones/actividades')
export class PublicacionesActividadesController {
	constructor(
		private readonly publicacionesActividadesService: PublicacionesActividadesService,
	) {}

	@ApiOperation({ summary: 'OBTENER DATOS PUBLICACION ACTIVIDAD' })
	@ApiResponse({
		status: 200,
		description: 'Datos de publicacion actividad',
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
	@Get('datos-publicacion-actividad/:id_oferta')
	async obtenerDatosPublicacionActividad(
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.publicacionesActividadesService.obtenerDatosPublicacionActividad(
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
		@Body() registrarTarifasDto: RegistrarTarifasDto,
	) {
		return await this.publicacionesActividadesService.registrarTarifa(
			req,
			registrarTarifasDto,
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
		return await this.publicacionesActividadesService.actualizarTarifa(
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
	@UseGuards(OfertaOwnerGuard)
	@Delete('eliminar-tarifa/:id_tarifa')
	async eliminarTarifa(
		@Req() req: Request,
		@Param('id_tarifa') id_tarifa: string,
	) {
		return await this.publicacionesActividadesService.eliminarTarifa(
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
		return await this.publicacionesActividadesService.obtenerDatosRegistradosTarifa(
			req,
			id_oferta,
		);
	}
}
