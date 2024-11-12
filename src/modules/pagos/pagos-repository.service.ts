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

	async obtenerDatosPreferencia(id_reserva: string) {
		const resultados = {
			items: [],
			access_token: '',
		};
		const result = await this.entityManager.query(
			'CALL SP_OBT_DATOS_PREFERENCIA(?)',
			[id_reserva],
		);
		console.log('RESULT', result);
		resultados.items = result[0];
		resultados.access_token = result[1][0].access_token;
		return resultados;
	}

	async registrarDatosReserva(datos_reserva: any) {
		const result = await this.entityManager.query(
			'CALL SP_REGISTRAR_DATOS_RESERVA(?, ?, ?, ?, ?, ?, ?)',
			[
				datos_reserva.id_reserva,
				datos_reserva.preference_id,
				datos_reserva.external_reference,
				datos_reserva.init_point,
				new Date(datos_reserva.fecha_expiracion_desde)
					.toISOString()
					.slice(0, 19)
					.replace('T', ' '),
				new Date(datos_reserva.fecha_expiracion_hasta)
					.toISOString()
					.slice(0, 19)
					.replace('T', ' '),
				datos_reserva.id_usuario,
			],
		);
		return result[0][0];
	}

	async registrarPago(datos_pago: any) {
		const result = await this.entityManager.query(
			'CALL SP_REGISTRAR_PAGO_RESERVA(?, ?, ?)',
			[
				datos_pago.payment_id,
				datos_pago.external_reference,
				datos_pago.preference_id,
			],
		);
		return result[0][0];
	}
}
