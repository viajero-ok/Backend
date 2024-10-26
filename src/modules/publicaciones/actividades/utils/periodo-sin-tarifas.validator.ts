import { Injectable } from '@nestjs/common';
import { ActualizarTarifasDto } from '../dto/actualizar-tarifa.dto';

@Injectable()
export class PeriodoSinTarifasValidator {
	async validarPeriodoSinTarifas(
		tarifasExistentes: ActualizarTarifasDto[],
	): Promise<string[]> {
		const errores: string[] = [];

		// Obtener la menor fecha_desde y la mayor fecha_hasta
		const fechaInicio = new Date(
			Math.min(...tarifasExistentes.map((t) => t.fecha_desde.getTime())),
		);
		const fechaFin = new Date(
			Math.max(...tarifasExistentes.map((t) => t.fecha_hasta.getTime())),
		);

		// Ordenar las tarifas por fecha_desde
		const tarifasOrdenadas = tarifasExistentes.sort(
			(a, b) => a.fecha_desde.getTime() - b.fecha_desde.getTime(),
		);

		// Verificar si hay huecos en el período
		for (let i = 0; i < tarifasOrdenadas.length - 1; i++) {
			const tarifaActual = tarifasOrdenadas[i];
			const tarifaSiguiente = tarifasOrdenadas[i + 1];

			if (
				tarifaActual.fecha_hasta.getTime() <
				tarifaSiguiente.fecha_desde.getTime() - 1
			) {
				errores.push(
					`Hay un hueco entre ${tarifaActual.fecha_hasta.toISOString().split('T')[0]} y ${tarifaSiguiente.fecha_desde.toISOString().split('T')[0]}`,
				);
			}
		}

		// Verificar si hay huecos al inicio o al final del período
		if (tarifasOrdenadas[0].fecha_desde.getTime() > fechaInicio.getTime()) {
			errores.push(
				`Hay un hueco al inicio del período: desde ${fechaInicio.toISOString().split('T')[0]} hasta ${tarifasOrdenadas[0].fecha_desde.toISOString().split('T')[0]}`,
			);
		}

		if (
			tarifasOrdenadas[
				tarifasOrdenadas.length - 1
			].fecha_hasta.getTime() < fechaFin.getTime()
		) {
			errores.push(
				`Hay un hueco al final del período: desde ${tarifasOrdenadas[tarifasOrdenadas.length - 1].fecha_hasta.toISOString().split('T')[0]} hasta ${fechaFin.toISOString().split('T')[0]}`,
			);
		}

		return errores;
	}
}
