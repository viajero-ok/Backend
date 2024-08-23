import { Injectable } from '@nestjs/common';
import { UbicacionesRepositoryService } from './ubicaciones-repository.service';

@Injectable()
export class UbicacionesService {
	constructor(
		private readonly ubicacionesRepositoryService: UbicacionesRepositoryService,
	) {}

	async obtenerUbicaciones() {
		const ubicaciones =
			await this.ubicacionesRepositoryService.obtenerUbicaciones();
		return {
			resultado: 'ok',
			statusCode: 200,
			ubicaciones,
		};
	}
}
