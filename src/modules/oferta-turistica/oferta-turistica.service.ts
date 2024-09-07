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
		const result =
			await this.ofertaTuristicaRepositoryService.obtenerTiposSubtipos();
		return { resultado: 'ok', statusCode: 200, tipos_y_subtipos: result };
	}
}
