import { Injectable } from '@nestjs/common';
import { OfertaTuristicaRepositoryService } from './oferta-turistica-repository.service';

@Injectable()
export class OfertaTuristicaService {
	constructor(
		private readonly ofertaTuristicaRepositoryService: OfertaTuristicaRepositoryService,
	) {}
	async obtenerOfertasPorPrestador(req) {
		return await this.ofertaTuristicaRepositoryService.obtenerOfertasPorPrestador(
			req.user.id_usuario,
		);
	}

	async obtenerTiposSubtipos() {
		return await this.ofertaTuristicaRepositoryService.obtenerTiposSubtipos();
	}
}
