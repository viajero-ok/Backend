import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { EliminarRedSocialDto, NuevaRedSocialDto } from './dto/RedSocial.dto';

@Injectable()
export class RedesSocialesRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async registrarRedSocial(nuevaRedSocialDto: NuevaRedSocialDto) {
		const result = await this.entityManager.query(
			`CALL SP_ABM_REDES_X_ENTIDAD(?, ?, ?, ?, ?, ?)`,
			[
				nuevaRedSocialDto.id_tipo_entidad,
				nuevaRedSocialDto.id_entidad, // Por ej: id_oferta
				nuevaRedSocialDto.id_red_social,
				nuevaRedSocialDto.nombre_usuario,
				nuevaRedSocialDto.url,
				0,
			],
		);

		console.log('result redes: ', result);

		return result;
	}

	async eliminarRedSocial(eliminarRedSocialDto: EliminarRedSocialDto) {
		const result = await this.entityManager.query(
			`CALL SP_ABM_REDES_X_ENTIDAD(?, ?, ?, ?, ?, ?)`,
			[
				eliminarRedSocialDto.id_tipo_entidad,
				eliminarRedSocialDto.id_entidad, // Por ej: id_oferta
				eliminarRedSocialDto.id_red_social,
				null,
				null,
				1,
			],
		);

		console.log('result redes: ', result);

		return result;
	}

	/**
	 * Instagram, X, Facebook, etc. Con sus respectivos IDs
	 */
	async obtenerRedesSociales() {
		const result = await this.entityManager.query(
			`CALL SP_LISTAR_REDES_SOCIALES`,
			[],
		);

		return result[0];
	}

	// async obtenerCategoriasEvento() {
	// 	const result = await this.entityManager.query(
	// 		`CALL SP_LISTAR_SUBTIPOS_EVENTOS`,
	// 	);
	// 	return result[0];
	// }

	// async guardarDatosBasicos(
	// 	id_usuario: string,
	// 	datosBasicosDto: GuardarDatosBasicosEventoDto,
	// ) {
	// 	await this.entityManager.query(
	// 		`CALL SP_ABM_EVENTO(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
	// 		[
	// 			datosBasicosDto.id_oferta,
	// 			3, // Porque es un evento
	// 			datosBasicosDto.id_sub_categoria,
	// 			datosBasicosDto.nombre,
	// 			datosBasicosDto.descripcion,
	// 			datosBasicosDto.requisitos,
	// 			datosBasicosDto.url_venta_entradas,
	// 			id_usuario,
	// 			0,
	// 		],
	// 	);

	// 	await this.entityManager.query(
	// 		`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
	// 		[
	// 			datosBasicosDto.id_oferta,
	// 			8,
	// 			datosBasicosDto.observaciones,
	// 			id_usuario,
	// 			0,
	// 		],
	// 	);

	// 	return;
	// }

	// async obtenerDatosRegistrados(id_oferta: string) {
	// 	const result = await this.entityManager.query(
	// 		`CALL SP_OBT_INFO_EVENTO(?)`,
	// 		[id_oferta],
	// 	);
	// 	return {
	// 		datos_basicos: result[0][0],
	// 		redes_sociales: result[1],
	// 		observaciones: result[2][0],
	// 	};
	// }
}
