import { Inject, Injectable } from '@nestjs/common';
import { UbicacionesRepositoryService } from './ubicaciones-repository.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class UbicacionesService {
	constructor(
		private readonly ubicacionesRepositoryService: UbicacionesRepositoryService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	async obtenerUbicaciones() {
		const cacheKey = 'ubicaciones';
		let ubicaciones = await this.cacheManager.get(cacheKey);

		if (!ubicaciones) {
			ubicaciones =
				await this.ubicacionesRepositoryService.obtenerUbicaciones();
			await this.cacheManager.set(cacheKey, ubicaciones);
		}

		return {
			resultado: 'ok',
			statusCode: 200,
			ubicaciones,
		};
	}
}
