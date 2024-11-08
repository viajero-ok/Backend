import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { OfertaTuristicaDto } from './dto/oferta-turistica.dto';
import { ImagenProcesadaDto } from './dto/imagenes/imagen-procesada.dto';
import { ConsultarOfertasDto } from './dto/consultar-ofertas.dto';
import { RegistrarImagenOfertaDto } from './dto/imagenes/registrar-imagen-oferta.dto';
import { RegistrarOfertaGuardadaDto } from './dto/guardadas/registrar-oferta-guardada.dto';

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
			'CALL SP_ALTA_OFERTA(?, ?, ?, ?)',
			[
				ofertaTuristicaDto.id_tipo_oferta,
				ofertaTuristicaDto.id_sub_tipo_oferta,
				ofertaTuristicaDto.id_establecimiento,
				id_usuario,
			],
		);
		return result[0][0];
	}

	async registrarImagenOfertaTuristica(
		registrarImagenOfertaDto: RegistrarImagenOfertaDto,
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
				registrarImagenOfertaDto.id_oferta,
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

	async obtenerOfertasTuristicas(
		pagina: number,
		limite: number,
		consultarOfertasDto: ConsultarOfertasDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_ALOJAMIENTOS_X_FILTRO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				pagina,
				limite,
				consultarOfertasDto.id_sub_tipo_oferta,
				consultarOfertasDto.id_establecimiento,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
			],
		);
		return result[0];
	}

	async registrarOfertaTuristicaGuardada(
		id_usuario: string,
		registrarOfertaGuardadaDto: RegistrarOfertaGuardadaDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_OFERTA_GUARDADA(?, ?, ?)',
			[null, registrarOfertaGuardadaDto.id_oferta, id_usuario],
		);
		return result[0][0];
	}

	async eliminarOfertaTuristicaGuardada(
		id_oferta_guardada: string,
		id_usuario: string,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_OFERTA_GUARDADA(?, ?, ?)',
			[id_oferta_guardada, null, id_usuario],
		);
		return result[0][0];
	}

	async obtenerOfertasGuardadasPorUsuario(id_usuario: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_OFERTAS_GUARDADAS_X_USUARIO(?)',
			[id_usuario],
		);
		return result[0];
	}
}
