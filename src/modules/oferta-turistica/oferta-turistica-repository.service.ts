import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { OfertaTuristicaDto } from './dto/oferta-turistica.dto';
import { ImagenProcesadaDto } from './dto/imagenes/imagen-procesada.dto';
import { ConsultarOfertasDto } from './dto/consultar-ofertas.dto';
import { RegistrarImagenOfertaDto } from './dto/imagenes/registrar-imagen-oferta.dto';
import { RegistrarOfertaGuardadaDto } from './dto/guardadas/registrar-oferta-guardada.dto';
import { ConsultarOfertaDto } from './dto/consultar-oferta.dto';

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
		consultarOfertasDto: ConsultarOfertasDto,
		noches_estadia: number,
	) {
		if (
			consultarOfertasDto.fecha_desde &&
			consultarOfertasDto.fecha_hasta
		) {
			consultarOfertasDto.fecha_desde = new Date(
				consultarOfertasDto.fecha_desde,
			);
			consultarOfertasDto.fecha_desde.setHours(0, 0, 0, 0);
			consultarOfertasDto.fecha_hasta = new Date(
				consultarOfertasDto.fecha_hasta,
			);
			consultarOfertasDto.fecha_hasta.setHours(0, 0, 0, 0);
		}
		const result = await this.entityManager.query(
			'CALL SP_OBT_OFERTAS_X_FILTRO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				consultarOfertasDto.pagina,
				consultarOfertasDto.limite,
				consultarOfertasDto.id_tipo_oferta,
				consultarOfertasDto.id_sub_tipo_oferta,
				consultarOfertasDto.id_localidad,
				consultarOfertasDto.min_monto,
				consultarOfertasDto.max_monto,
				noches_estadia,
				consultarOfertasDto.latitud,
				consultarOfertasDto.longitud,
				consultarOfertasDto.radio,
				consultarOfertasDto.fecha_desde,
				consultarOfertasDto.fecha_hasta,
				consultarOfertasDto.cantidad_personas,
			],
		);
		console.log(result[0]);
		return result[0];
	}

	async obtenerOfertaTuristica(
		consultarOfertaDto: ConsultarOfertaDto,
		noches_estadia: number,
	) {
		const resultados = {
			datos_basicos: null,
			metodos_pago: [],
			caracteristicas: [],
			observaciones: [],
			horarios_check_in_out: [],
			domicilio: null,
			imagenes_oferta: [],
			tipos_detalles: [],
			plazas_x_tipo_detalle: [],
			caracteristicas_x_tipo_detalle: [],
			imagenes_x_tipo_detalle: [],
			tarifas_x_tipo_detalle: [],
		};
		const result = await this.entityManager.query(
			'CALL SP_OBT_DETALLE_OFERTA_X_FILTRO(?, ?, ?, ?, ?, ?, ?)',
			[
				consultarOfertaDto.id_oferta,
				consultarOfertaDto.min_monto
					? consultarOfertaDto.min_monto
					: null,
				consultarOfertaDto.max_monto
					? consultarOfertaDto.max_monto
					: null,
				noches_estadia,
				consultarOfertaDto.fecha_desde,
				consultarOfertaDto.fecha_hasta,
				consultarOfertaDto.cantidad_personas,
			],
		);
		console.log('result', result);
		resultados.datos_basicos = result[0][0];
		resultados.metodos_pago = result[1];
		resultados.caracteristicas = result[2];
		resultados.observaciones = result[3];
		resultados.horarios_check_in_out = result[4];
		resultados.domicilio = result[5][0];
		resultados.imagenes_oferta = result[6];
		resultados.tipos_detalles = result[7];
		resultados.plazas_x_tipo_detalle = result[8];
		resultados.caracteristicas_x_tipo_detalle = result[9];
		resultados.imagenes_x_tipo_detalle = result[10];
		resultados.tarifas_x_tipo_detalle = result[11];
		return resultados;
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
