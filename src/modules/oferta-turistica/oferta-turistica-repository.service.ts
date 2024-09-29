import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { OfertaTuristicaDto } from './dto/oferta-turistica.dto';
import { ImagenProcesadaDto } from './dto/imagen-procesada.dto';

@Injectable()
export class OfertaTuristicaRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerOfertasPorPrestador(id_usuario: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_OFERTAS_TURISTICAS_X_USUARIO(?)',
			[id_usuario],
		);
		return result[0];
	}

	async obtenerTiposSubtipos() {
		const result = await this.entityManager.query(
			'CALL SP_LISTAR_TIPOS_SUBTIPOS_OFERTA()',
		);
		return { tipos: result[0], subtipos: result[1] };
	}

	async registrarOfertaTuristica(
		id_usuario: string,
		ofertaTuristicaDto: OfertaTuristicaDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ALTA_OFERTA(?, ?, ?)',
			[
				ofertaTuristicaDto.id_tipo_oferta,
				ofertaTuristicaDto.id_sub_tipo_oferta,
				id_usuario,
			],
		);
		return result[0][0];
	}

	async registrarImagenOfertaTuristica(
		id_oferta: string,
		id_usuario: string,
		imagen: ImagenProcesadaDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_IMAGEN_OFERTA(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				imagen.nombre_original,
				imagen.nombre_unico,
				imagen.ruta,
				imagen.mime_type,
				id_oferta,
				id_usuario,
				imagen.tamaño,
				null,
				0,
			],
		);
		return result[0][0];
	}

	async eliminarImagenOfertaTuristica(id_usuario: string, id_imagen: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_IMAGEN_OFERTA(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[null, null, null, null, null, id_usuario, null, id_imagen, 1],
		);
		return result[0][0];
	}
}
