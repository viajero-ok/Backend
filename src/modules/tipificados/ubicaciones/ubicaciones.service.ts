import { Injectable } from '@nestjs/common';
import { UbicacionesRepositoryService } from './ubicaciones-repository.service';

@Injectable()
export class UbicacionesService {
	constructor(
		private readonly ubicacionesRepositoryService: UbicacionesRepositoryService,
	) {}

	async obtenerUbicaciones() {
		return await this.ubicacionesRepositoryService.obtenerUbicaciones();
	}
}
