import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { TipoObservacion } from '../../enum/tipo-observacion.enum';
import { UbicacionActividadDto } from './dto/ubicacion-actividad.dto';

@Injectable()
export class UbicacionRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async registrarUbicacionActividad(
		id_usuario: string,
		ubicacionDto: UbicacionActividadDto,
	) {
		const resultados = { ubicacion: null, observacion: null };
		await this.entityManager.transaction(async (manager) => {
			const resultado_ubicacion = await manager.query(
				'CALL SP_ABM_DOMICILIO_OFERTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
				[
					ubicacionDto.id_oferta,
					ubicacionDto.calle,
					ubicacionDto.numero,
					ubicacionDto.id_localidad,
					ubicacionDto.id_departamento,
					ubicacionDto.id_provincia,
					1,
					ubicacionDto.sin_numero,
					ubicacionDto.latitud,
					ubicacionDto.longitud,
					0,
				],
			);
			resultados.ubicacion = resultado_ubicacion[0][0];
			const resultado_observacion = await manager.query(
				'CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)',
				[
					ubicacionDto.id_oferta,
					TipoObservacion.NORMAS,
					ubicacionDto.observaciones,
					id_usuario,
					0,
				],
			);
			resultados.observacion = resultado_observacion[0][0];
		});
		return resultados;
	}
}
