import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { AlojamientoDto } from './dto/alojamiento.dto';
import { RegistrarCaracteristicasAlojamientoDto } from './dto/registrar-caracteristicas-alojamiento.dto';

@Injectable()
export class AlojamientosRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async registrarAlojamiento(
		id_usuario: string,
		alojamientoDto: AlojamientoDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_ABM_ALOJAMIENTOS(?)',
			[id_usuario],
			// atributos de alojamientoDto
		);
		return result[0][0];
		return this.entityManager.transaction(
			async (manager: EntityManager) => {
				await manager.query(`CALL sp_procedimiento1(?, ?)`, []);
				await manager.query(`CALL sp_procedimiento2(?)`, []);
				await manager.query(`CALL sp_procedimiento3(?, ?, ?)`, []);
				await manager.query(`CALL sp_procedimiento4(?, ?)`, []);
				await manager.query(`CALL sp_procedimiento5(?)`, []);

				// Aquí puedes realizar otras operaciones con el manager
			},
		);
	}

	async registrarCaracteristicasAlojamiento(
		registrarCaracteristicasAlojamientoDto: RegistrarCaracteristicasAlojamientoDto,
	) {
		const result = await this.entityManager.query(
			'CALL SP_REGISTRAR_CARACTERISTICAS_ALOJAMIENTO(?)',
			[],
			// atributos de alojamientoDto
		);
		return result[0][0];
	}
}
