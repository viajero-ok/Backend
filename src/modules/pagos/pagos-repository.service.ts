import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class PagosRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async guardarCodigoRandom(
		id_usuario: string,
		code_verifier: string,
		fecha_creacion: number,
	) {
		const result = await this.entityManager.query(
			'CALL SP_REGISTRAR_CODIGO_MP(?, ?, ?)',
			[id_usuario, code_verifier, fecha_creacion],
		);
		return result[0][0];
	}

	async obtenerDatosUsuarioAutorizado(codigoRandom: string) {
		const result = await this.entityManager.query(
			'CALL SP_OBT_DATOS_USUARIO_AUTORIZADO(?)',
			[codigoRandom],
		);
		return result[0][0];
	}

	async guardarDatosMP(
		id_usuario: string,
		access_token: string,
		public_key: string,
		refresh_token: string,
		live_mode: boolean,
		user_id: string,
		token_type: string,
		expires_in: number,
		scope: string,
	) {
		const result = await this.entityManager.query(
			'CALL SP_REGISTRAR_DATOS_MP(?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				id_usuario,
				access_token,
				public_key,
				refresh_token,
				live_mode,
				user_id,
				token_type,
				expires_in,
				scope,
			],
		);
		return result[0][0];
	}
}
