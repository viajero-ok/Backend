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

		if (tarifaDto.fecha_desde >= tarifaDto.fecha_hasta) {
			errores.push('La fecha desde debe ser anterior a la fecha hasta');
		}
		console.log(tarifasExistentes);
		let tarifasSolapadas = [];
		/* if (tarifasExistentes.length > 0 && Array.isArray(tarifasExistentes)) {
			tarifasSolapadas = tarifasExistentes.filter((t) => {
				let seSuperpone = true;
				if (
					t instanceof ActualizarTarifasDto &&
					tarifaDto instanceof ActualizarTarifasDto
				) {
					if (t.id_tarifa !== tarifaDto.id_tarifa) {
						return false;
					}
				}
				seSuperpone =
					tarifaDto.id_tipo_detalle === t.id_tipo_detalle &&
					((tarifaDto.fecha_desde >= t.fecha_desde &&
						tarifaDto.fecha_desde <= t.fecha_hasta) ||
						(tarifaDto.fecha_hasta >= t.fecha_desde &&
							tarifaDto.fecha_hasta <= t.fecha_hasta) ||
						(tarifaDto.fecha_desde <= t.fecha_desde &&
							tarifaDto.fecha_hasta >= t.fecha_hasta) ||
						(tarifaDto.fecha_desde <= t.fecha_desde &&
							tarifaDto.fecha_hasta >= t.fecha_desde));
				console.log(seSuperpone);
				return seSuperpone;
			});
		} */
		if (tarifasSolapadas.length > 0) {
			errores.push(
				'Existe una tarifa para esta habitación con fechas que se solapan con la ingresada',
			);
		}

		return errores;
	}
}
