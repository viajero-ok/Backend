import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
	EntradaCampingDto,
	EntradaCampingNuevaDto,
} from './dto/entrada-camping.dto';

@Injectable()
export class PestañaEntradasRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async registrarEntrada(
		id_usuario: string,
		entradaNueva: EntradaCampingNuevaDto,
	) {
		const cupo_maximo = entradaNueva.bl_sin_cupo
			? null
			: entradaNueva.cupo_maximo || 0;

		const result = await this.entityManager.query(
			'CALL SP_ABM_TIPOS_ENTRADA_X_OFERTA(?, ?, ?, ?, ?, ?, ?, ?)',
			[
				entradaNueva.nombre,
				entradaNueva.descripcion,
				entradaNueva.id_oferta,
				id_usuario,
				null, // id_entrada es null para registrar una nueva entrada
				0, // Bandera: 0 para insertar o modificar, 1 para eliminar
				entradaNueva.bl_sin_cupo ? 1 : 0, // bl_sin_cupo
				cupo_maximo, // cupo_maximo
			],
		);
		return result[0][0];
	}

	async actualizarEntrada(id_usuario: string, entrada: EntradaCampingDto) {
		const cupo_maximo = entrada.bl_sin_cupo
			? null
			: entrada.cupo_maximo || 0;

		const result = await this.entityManager.query(
			'CALL SP_ABM_TIPOS_ENTRADA_X_OFERTA(?, ?, ?, ?, ?, ?, ?, ?)',
			[
				entrada.nombre,
				entrada.descripcion,
				entrada.id_oferta,
				id_usuario,
				entrada.id_entrada, // id_entrada para modificar
				0, // Bandera: 0 para insertar o modificar, 1 para eliminar
				entrada.bl_sin_cupo ? 1 : 0, // bl_sin_cupo
				cupo_maximo, // cupo_maximo
			],
		);
		return result[0][0];
	}

	async eliminarEntrada(id_usuario: string, id_entrada: string) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_TIPOS_ENTRADA_X_OFERTA(?, ?, ?, ?, ?, ?, ?, ?)',
			[
				null, // nombre
				null, // descripcion
				null, // id_oferta
				id_usuario,
				id_entrada, // id_entrada para eliminar
				1, // Bandera: 1 para eliminar
				null, // bl_sin_cupo
				null, // cupo_maximo
			],
		);
		return result[0][0];
	}

	async obtenerEntradasRegistradas(id_oferta: string) {
		const resultado_entradas = await this.entityManager.query(
			'CALL SP_OBT_TIPOS_ENTRADA_X_OFERTA(?)',
			[id_oferta],
		);

		const entradas = resultado_entradas[0].map((entrada: any) => ({
			...entrada,
			bl_sin_cupo: entrada.bl_sin_cupo === 1,
		}));

		return {
			entradas: entradas,
		};
	}
}
