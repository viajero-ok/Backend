import { Controller, Get } from '@nestjs/common';
import { UbicacionesService } from './ubicaciones.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Ubicaciones')
@ApiBearerAuth()
@Controller('ubicaciones')
export class UbicacionesController {
	constructor(private readonly ubicacionesService: UbicacionesService) {}

	@ApiOperation({ summary: 'OBTENER UBICACIONES' })
	@Get()
	async obtenerUbicaciones() {
		return await this.ubicacionesService.obtenerUbicaciones();
	}
}
