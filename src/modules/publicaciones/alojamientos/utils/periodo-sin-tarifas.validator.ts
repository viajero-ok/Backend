import { Injectable } from '@nestjs/common';
import { ActualizarTarifasDto } from '../dto/actualizar-tarifa.dto';

@Injectable()
export class PeriodoSinTarifasValidator {
	async validarPeriodoSinTarifas(
		tarifasExistentes: ActualizarTarifasDto[],
	): Promise<string[]> {
		const errores: string[] = [];

		// Verificar si hay huecos en el período
		for (let i = 0; i < tarifasExistentes.length - 1; i++) {
			const tarifaActual = tarifasExistentes[i];
			const tarifaSiguiente = tarifasExistentes[i + 1];

			if (
				tarifaActual.fecha_hasta.getTime() <
				tarifaSiguiente.fecha_desde.getTime() - 1
			) {
				errores.push(
					`Hay un hueco entre ${tarifaActual.fecha_hasta.toISOString().split('T')[0]} y ${tarifaSiguiente.fecha_desde.toISOString().split('T')[0]}`,
				);
			}
		}

		return errores;
	}
}
