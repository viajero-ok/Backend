import { Injectable } from '@nestjs/common';
import { RegistrarTarifasDto } from '../dto/registrar-tarifa.dto';
import { ActualizarTarifasDto } from '../dto/actualizar-tarifa.dto';

@Injectable()
export class TarifasValidator {
	async validarTarifa(
		tarifaDto: RegistrarTarifasDto | ActualizarTarifasDto,
		tarifasExistentes: RegistrarTarifasDto[] | ActualizarTarifasDto[],
	): Promise<string[]> {
		const errores: string[] = [];

		// verificar que las fechas sean requeridas
		if (tarifaDto.fecha_desde === null || tarifaDto.fecha_hasta === null) {
			errores.push('La fecha desde y hasta son requeridas');
		}
		// verificar que sean posteriores a la fecha actual
		if (
			tarifaDto.fecha_desde instanceof Date &&
			tarifaDto.fecha_desde < new Date()
		) {
			errores.push('La fecha desde debe ser posterior a la fecha actual');
		}
		if (
			tarifaDto.fecha_hasta instanceof Date &&
			tarifaDto.fecha_hasta < new Date()
		) {
			errores.push('La fecha hasta debe ser posterior a la fecha actual');
		}
		// verificar que la fecha desde sea anterior a la fecha hasta
		if (tarifaDto.fecha_desde > tarifaDto.fecha_hasta) {
			errores.push('La fecha desde debe ser anterior a la fecha hasta');
		}
		let tarifasSolapadas = [];
		if (tarifasExistentes.length > 0 && Array.isArray(tarifasExistentes)) {
			tarifasSolapadas = tarifasExistentes.filter((t) => {
				let seSuperpone = true;
				if ('id_tarifa' in tarifaDto && 'id_tarifa' in t) {
					if (t.id_tarifa === tarifaDto.id_tarifa) {
						return false;
					}
				}
				seSuperpone =
					tarifaDto.id_tipo_entrada === t.id_tipo_entrada &&
					((tarifaDto.fecha_desde >= t.fecha_desde &&
						tarifaDto.fecha_desde <= t.fecha_hasta) ||
						(tarifaDto.fecha_hasta >= t.fecha_desde &&
							tarifaDto.fecha_hasta <= t.fecha_hasta) ||
						(tarifaDto.fecha_desde <= t.fecha_desde &&
							tarifaDto.fecha_hasta >= t.fecha_hasta) ||
						(tarifaDto.fecha_desde <= t.fecha_desde &&
							tarifaDto.fecha_hasta >= t.fecha_desde));
				return seSuperpone;
			});
		}
		if (tarifasSolapadas.length > 0) {
			errores.push(
				'Existe una tarifa para esta actividad con fechas que se solapan con la ingresada',
			);
		}

		return errores;
	}
}
