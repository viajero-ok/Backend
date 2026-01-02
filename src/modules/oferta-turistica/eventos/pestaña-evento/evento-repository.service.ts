import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { GuardarDatosBasicosEventoDto } from './dto/datos-basicos.dto';

@Injectable()
export class EventoRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerCategoriasEvento() {
		const result = await this.entityManager.query(
			`CALL SP_LISTAR_SUBTIPOS_EVENTOS`,
		);
		return result[0];
	}

	async guardarDatosBasicos(
		id_usuario: string,
		datosBasicosDto: GuardarDatosBasicosEventoDto,
	) {
		await this.entityManager.query(
			`CALL SP_ABM_EVENTO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				datosBasicosDto.id_oferta,
				3, // Porque es un evento
				datosBasicosDto.id_sub_categoria,
				datosBasicosDto.nombre,
				datosBasicosDto.descripcion,
				datosBasicosDto.requisitos,
				datosBasicosDto.url_venta_entradas,
				new Date(datosBasicosDto.fecha_hora_inicio)
					.toISOString()
					.slice(0, 19)
					.replace('T', ' '),
				new Date(datosBasicosDto.fecha_hora_fin)
					.toISOString()
					.slice(0, 19)
					.replace('T', ' '),
				id_usuario,
				0,
			],
		);

		await this.entityManager.query(
			`CALL SP_ABM_OBSERVACIONES_X_OFERTA(?, ?, ?, ?, ?)`,
			[
				datosBasicosDto.id_oferta,
				8,
				datosBasicosDto.observaciones,
				id_usuario,
				0,
			],
		);

		return;
	}

	async obtenerDatosRegistrados(id_oferta: string) {
		const result = await this.entityManager.query(
			`CALL SP_OBT_INFO_EVENTO(?)`,
			[id_oferta],
		);

		return {
			datos_basicos: result[0][0],
			redes_sociales: result[1],
			observaciones: result[2][0],
		};
	}
}
