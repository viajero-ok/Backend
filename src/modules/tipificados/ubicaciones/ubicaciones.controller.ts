import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UbicacionesService } from './ubicaciones.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Ubicaciones')
@ApiBearerAuth()
@Controller('ubicaciones')
export class UbicacionesController {
	constructor(private readonly ubicacionesService: UbicacionesService) {}

	@ApiOperation({ summary: 'OBTENER UBICACIONES' })
	@UseInterceptors(CacheInterceptor)
	@CacheTTL(60 * 60 * 24 * 15) // 15 días en segundos
	@Get()
	async obtenerUbicaciones() {
		return await this.ubicacionesService.obtenerUbicaciones();
	}
}
