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
			if (!ubicacionDto.id_establecimiento) {
				const resultado_ubicacion = await manager.query(
					'CALL SP_ABM_DOMICILIO_OFERTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[
						ubicacionDto.id_oferta,
						ubicacionDto.calle,
						ubicacionDto.numero,
						ubicacionDto.id_localidad,
						ubicacionDto.id_departamento,
						ubicacionDto.id_provincia,
						1,
						ubicacionDto.sin_numero,
						parseFloat(ubicacionDto.latitud),
						parseFloat(ubicacionDto.longitud),
						0,
						null,
					],
				);
				resultados.ubicacion = resultado_ubicacion[0][0];
			} else {
				const resultado_ubicacion = await manager.query(
					'CALL SP_ABM_DOMICILIO_OFERTA(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[
						ubicacionDto.id_oferta,
						null,
						null,
						null,
						null,
						null,
						null,
						null,
						null,
						null,
						0,
						ubicacionDto.id_establecimiento,
					],
				);
				resultados.ubicacion = resultado_ubicacion[0][0];
			}
			if (
				ubicacionDto.observaciones !== null &&
				ubicacionDto.observaciones !== ''
			) {
				const resultado_observacion = await manager.query(
					'CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)',
					[
						ubicacionDto.id_oferta,
						TipoObservacion.DOMICILIOS,
						ubicacionDto.observaciones,
						id_usuario,
						0,
					],
				);
				resultados.observacion = resultado_observacion[0][0];
			}
		});
		return resultados;
	}

	async obtenerDatosRegistradosUbicacion(
		id_usuario: string,
		id_oferta: string,
	) {
		const result = await this.entityManager.query(
			`CALL SP_OBT_DOMICILIO_OFERTA(?, ?)`,
			[id_oferta, id_usuario],
		);
		return result[0][0];
	}
}
