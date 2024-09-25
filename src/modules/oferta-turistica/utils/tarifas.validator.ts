import { Injectable } from '@nestjs/common';
import { TarifasDto } from '../alojamientos/dto/tarifa/tarifa.dto';

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

		const tarifaRepetida = tarifasExistentes.some(
			(t) =>
				t.id_tipo_pension === tarifaDto.id_tipo_pension &&
				t.id_tarifa !== tarifaDto.id_tarifa,
		);

		if (tarifaRepetida) {
			errores.push(
				'Ya existe una tarifa para esta combinación de tipo de detalle y tipo de pensión',
			);
		}

		return errores;
	}
}
