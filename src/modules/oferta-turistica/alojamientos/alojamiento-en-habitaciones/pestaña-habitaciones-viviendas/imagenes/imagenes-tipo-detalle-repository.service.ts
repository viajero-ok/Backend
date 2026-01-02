import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ImagenProcesadaDto } from '../../dto/imagen-procesada.dto';

@Injectable()
export class ImagenesTipoDetalleRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async registrarImagen(
		id_tipo_detalle: string,
		id_usuario: string,
		imagen: ImagenProcesadaDto,
	) {
		const resultado = await this.entityManager.query(
			'CALL SP_ABM_IMAGEN_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				imagen.nombre_original,
				imagen.nombre_unico,
				imagen.ruta,
				imagen.mime_type,
				id_tipo_detalle,
				id_usuario,
				imagen.tamaño,
				null,
				0,
			],
		);
		return resultado[0][0];
	}

	async eliminarImagen(id_usuario: string, id_imagen: string) {
		const resultado = await this.entityManager.query(
			'CALL SP_ABM_IMAGEN_TIPO_DETALLE(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[null, null, null, null, null, id_usuario, null, id_imagen, 1],
		);
		return resultado[0][0];
	}

	async obtenerImagenes(id_tipo_detalle: string) {
		const resultado = await this.entityManager.query(
			'CALL SP_OBT_IMAGENES_X_TIPO_DETALLE(?)',
			[id_tipo_detalle],
		);
		return resultado[0];
	}
}
