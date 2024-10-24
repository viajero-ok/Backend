import { Injectable } from '@nestjs/common';
import { TarifasDto } from '../dto/tarifa.dto';

@Injectable()
export class TarifasValidator {
	async validarTarifa(
		tarifaDto: TarifasDto,
		tarifasExistentes: TarifasDto[],
	): Promise<string[]> {
		const errores: string[] = [];

		if (tarifaDto.fecha_desde >= tarifaDto.fecha_hasta) {
			errores.push('La fecha desde debe ser anterior a la fecha hasta');
		}

		const tarifasSolapadas = tarifasExistentes.filter(
			(t) =>
				t.id_tipo_entrada === tarifaDto.id_tipo_entrada &&
				t.id_tarifa !== tarifaDto.id_tarifa &&
				((tarifaDto.fecha_desde >= t.fecha_desde &&
					tarifaDto.fecha_desde < t.fecha_hasta) ||
					(tarifaDto.fecha_hasta > t.fecha_desde &&
						tarifaDto.fecha_hasta <= t.fecha_hasta) ||
					(tarifaDto.fecha_desde <= t.fecha_desde &&
						tarifaDto.fecha_hasta >= t.fecha_hasta)),
		);

		if (tarifasSolapadas.length > 0) {
			errores.push(
				'Ya existe una tarifa para este tipo de pensión con fechas que se solapan',
			);
		}

		return errores;
	}
}
