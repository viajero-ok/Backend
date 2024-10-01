import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { GuiaDto } from './dto/guia.dto';
import { EliminarGuiaDto } from './dto/eliminar-guia.dto';

@Injectable()
export class ActividadesRepositoryService {
	constructor(
		@InjectEntityManager()
		private entityManager: EntityManager,
	) {}

	async obtenerDatosRegistroActividades() {
		const resultados = {
			tipos_y_subtipos: {
				tipos: [],
				subtipos: [],
			},
			sub_categorias_actividades: [],
			dificultad_actividades: [],
		};
		await this.entityManager.transaction(async (manager: EntityManager) => {
			const tipos_subtipos = await manager.query(
				`CALL SP_LISTAR_TIPOS_SUBTIPOS_OFERTA()`,
			);
			resultados.tipos_y_subtipos.tipos = tipos_subtipos[0];
			resultados.tipos_y_subtipos.subtipos = tipos_subtipos[1];

			const sub_categorias_actividades = await manager.query(
				`CALL SP_LISTAR_SUBCATEGORIAS_ACTIVIDADES()`,
			);
			resultados.sub_categorias_actividades =
				sub_categorias_actividades[0];

			const dificultad_actividades = await manager.query(
				`CALL SP_LISTAR_DIFICULTAD_ACTIVIDAD()`,
			);
			resultados.dificultad_actividades = dificultad_actividades[0];
		});
		return resultados;
	}

	async registrarGuia(id_usuario: string, guiaDto: GuiaDto) {
		const result = await this.entityManager.query(
			`CALL SP_ABM_GUIAS_X_ACTIVIDAD(?, ?, ?, ?, ?, ?)`,
			[
				guiaDto.id_oferta,
				guiaDto.nro_resolucion,
				guiaDto.nombre_y_apellido,
				id_usuario,
				null,
				0,
			],
		);
		return result[0][0];
	}

	async eliminarGuia(id_usuario: string, eliminarGuiaDto: EliminarGuiaDto) {
		const result = await this.entityManager.query(
			`CALL SP_ABM_GUIAS_X_ACTIVIDAD(?, ?, ?, ?, ?, ?)`,
			[
				eliminarGuiaDto.id_oferta,
				null,
				null,
				id_usuario,
				eliminarGuiaDto.id_guia,
				1,
			],
		);
		return result[0];
	}
}
