import {
	Body,
	Controller,
	Delete,
	Param,
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
import { TarifasDto } from './dto/tarifa.dto';

@ApiTags('Publicaciones/Actividades')
@ApiBearerAuth()
@Controller('publicaciones')
export class PublicacionesActividadesController {
	constructor(
		private readonly publicacionesActividadesService: PublicacionesActividadesService,
	) {}

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
	async registrarTarifa(@Req() req: Request, @Body() tarifaDto: TarifasDto) {
		return await this.publicacionesActividadesService.registrarTarifa(
			req,
			tarifaDto,
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
}
