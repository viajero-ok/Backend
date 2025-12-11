import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
	EliminarEntradaDto,
	EntradaDto,
	ModificarEntradaDto,
} from './dto/entrada.dto';

@Injectable()
export class EntradasRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async registrarEntrada(entradaDto: EntradaDto) {
		await this.entityManager.query(
			`CALL SP_ABM_TIPO_ENTRADA_TARIFA_EVENTO(?, ?, ?, ?, ?, ?, ?)`,
			[
				entradaDto.nombre,
				entradaDto.incluye,
				entradaDto.id_oferta,
				entradaDto.precio,
				entradaDto.sin_precio ? 1 : 0,
				null,
				0,
			],
		);

		return;
	}

	async modificarEntrada(entradaDto: ModificarEntradaDto) {
		await this.entityManager.query(
			`CALL SP_ABM_TIPO_ENTRADA_TARIFA_EVENTO(?, ?, ?, ?, ?, ?, ?)`,
			[
				entradaDto.nombre,
				entradaDto.incluye,
				entradaDto.id_oferta,
				entradaDto.precio,
				entradaDto.sin_precio ? 1 : 0,
				entradaDto.id_entrada,
				0,
			],
		);

		return;
	}

	async eliminarEntrada(entradaDto: EliminarEntradaDto) {
		await this.entityManager.query(
			`CALL SP_ABM_TIPO_ENTRADA_TARIFA_EVENTO(?, ?, ?, ?, ?, ?, ?)`,
			[
				null,
				null,
				entradaDto.id_oferta,
				null,
				null,
				entradaDto.id_entrada,
				1,
			],
		);

		return;
	}

	async obtenerEntradas(id_oferta: string) {
		const result = await this.entityManager.query(
			`CALL SP_OBT_TIPOS_ENTRADA_X_OFERTA(?)`,
			[id_oferta],
		);

		console.log('result: ', result[0]);

		return result[0];
	}
}
