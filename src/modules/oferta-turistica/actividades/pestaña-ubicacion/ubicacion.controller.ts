import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { UbicacionService } from './ubicacion.service';
import { UbicacionActividadDto } from './dto/ubicacion-actividad.dto';
import { OfertaOwnerGuard } from 'src/common/guards/authorization/oferta-owner.guard';

@ApiTags('Actividades/Ubicacion')
@ApiBearerAuth()
@Controller('actividades')
export class UbicacionController {
	constructor(private readonly ubicacionService: UbicacionService) {}

	@ApiOperation({ summary: 'REGISTRAR UBICACION ACTIVIDAD' })
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
	@Post('registrar-ubicacion-actividad')
	async registrarUbicacionActividad(
		@Req() req: Request,
		@Body() ubicacionDto: UbicacionActividadDto,
	) {
		return await this.ubicacionService.registrarUbicacionActividad(
			req,
			ubicacionDto,
		);
	}
}
