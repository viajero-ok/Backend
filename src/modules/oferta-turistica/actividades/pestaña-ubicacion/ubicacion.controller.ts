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

	@ApiOperation({ summary: 'OBTENER DATOS REGISTRADOS UBICACION' })
	@ApiResponse({
		status: 200,
		description: 'Datos de registro de ubicacion',
	})
	@UseGuards(OfertaOwnerGuard)
	@Get('obtener-datos-registrados-ubicacion/:id_oferta')
	async obtenerDatosRegistradosUbicacion(
		@Req() req,
		@Param('id_oferta') id_oferta: string,
	) {
		return await this.ubicacionService.obtenerDatosRegistradosUbicacion(
			req,
			id_oferta,
		);
	}
}
