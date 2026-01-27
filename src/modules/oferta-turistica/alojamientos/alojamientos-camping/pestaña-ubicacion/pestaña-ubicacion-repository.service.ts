import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { TipoObservacion } from '../../../enum/tipo-observacion.enum';
import { UbicacionCampingDto } from './dto/ubicacion-camping.dto';

@Injectable()
export class PestañaUbicacionRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async registrarUbicacionCamping(
		id_usuario: string,
		ubicacionDto: UbicacionCampingDto,
	) {
		const resultados = { ubicacion: null, observacion: null };
		await this.entityManager.transaction(async (manager) => {
			if (!ubicacionDto.misma_ubicacion_establecimiento) {
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
				return;
			}

			const idEstablecimiento = (
				await manager.query(
					`SELECT ot.ID_ESTABLECIMIENTO FROM ofertas_turisticas ot WHERE ot.ID_OFERTA_TURISTICA = ?`,
					[ubicacionDto.id_oferta],
				)
			)[0].ID_ESTABLECIMIENTO;
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
					idEstablecimiento,
				],
			);
			resultados.ubicacion = resultado_ubicacion[0][0];
			return;
		});
		return resultados;
	}

	async obtenerUbicacionEstablecimiento(
		id_usuario: string,
		id_oferta: string,
	) {
		const result = await this.entityManager.query(
			`select
				d.TX_LATITUD,
				d.TX_LONGITUD
			from
				domicilios d
			inner join establecimientos e on
				e.ID_DOMICILIO = d.ID_DOMICILIO
			inner join ofertas_turisticas ot on
				ot.ID_ESTABLECIMIENTO = e.ID_ESTABLECIMIENTO
				and ot.ID_OFERTA_TURISTICA = ?
			inner join prestadores p on
				p.ID_PRESTADOR = ot.ID_PRESTADOR
			inner join usuarios u on
				u.ID_USUARIO = p.ID_USUARIO
				and u.ID_USUARIO = ?;`,
			[id_oferta, id_usuario],
		);
		return {
			latitud: result[0]?.TX_LATITUD ?? null,
			longitud: result[0]?.TX_LONGITUD ?? null,
			sin_establecimiento: result.length == 0,
		};
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
