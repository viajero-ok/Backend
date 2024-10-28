import { Injectable } from '@nestjs/common';
import { ActualizarTarifasDto } from '../dto/actualizar-tarifa.dto';

interface TipoEntrada {
	id_tipo_entrada: number;
	nombre_tipo_entrada: string;
	descripcion_tipo_entrada: string;
}

@Injectable()
export class PeriodoSinTarifasValidator {
	async validarPeriodoSinTarifas(
		tarifasExistentes: ActualizarTarifasDto[],
		tipos_entradas: TipoEntrada[],
	): Promise<string[]> {
		const errores: string[] = [];

		if (tarifasExistentes.length === 0) {
			errores.push(
				`No hay tarifas registradas para ningún tipo de entrada`,
			);
			return errores;
		}

		// Fechas desde y hasta extremos
		const fechaDesdeExtremos = new Date(
			tarifasExistentes[0].fecha_desde.getTime(),
		);
		const fechaHastaExtremos = new Date(
			tarifasExistentes[
				tarifasExistentes.length - 1
			].fecha_hasta.getTime(),
		);

		// Agrupar tarifas por tipo de entrada
		const tarifasPorTipo = new Map<number, ActualizarTarifasDto[]>();

		// Inicializar el Map con arrays vacíos para cada tipo de entrada
		tipos_entradas.forEach((tipo) => {
			tarifasPorTipo.set(tipo.id_tipo_entrada, []);
		});

		// Agrupar las tarifas existentes por tipo de entrada
		tarifasExistentes.forEach((tarifa) => {
			const tarifasDelTipo =
				tarifasPorTipo.get(tarifa.id_tipo_entrada) || [];
			tarifasDelTipo.push(tarifa);
			tarifasPorTipo.set(tarifa.id_tipo_entrada, tarifasDelTipo);
		});

		// Validar cada tipo de entrada
		tipos_entradas.forEach((tipo) => {
			const tarifasDelTipo =
				tarifasPorTipo.get(tipo.id_tipo_entrada) || [];

			// Validar que el tipo de entrada tenga al menos una tarifa
			if (tarifasDelTipo.length === 0) {
				errores.push(
					`El tipo de entrada "${tipo.nombre_tipo_entrada}" no tiene tarifas asignadas`,
				);
				return;
			}

			// Ordenar tarifas por fecha
			const tarifasOrdenadas = tarifasDelTipo.sort(
				(a, b) => a.fecha_desde.getTime() - b.fecha_desde.getTime(),
			);

			// Verificar si hay hueco entre la fecha desde del primer elemento y la fecha desde del extremo
			if (
				fechaDesdeExtremos.getTime() <
				tarifasOrdenadas[0].fecha_desde.getTime()
			) {
				errores.push(
					`Hay un hueco en el tipo "${tipo.nombre_tipo_entrada}" entre el ${fechaDesdeExtremos.toISOString().split('T')[0]} y el ${tarifasOrdenadas[0].fecha_desde.toISOString().split('T')[0]}. Debe haber al menos una tarifa para cada tipo de entrada en el periodo entre el ${fechaDesdeExtremos.toISOString().split('T')[0]} y el ${fechaHastaExtremos.toISOString().split('T')[0]}`,
				);
			}

			// Verificar si hay hueco entre la fecha hasta del último elemento y la fecha hasta del extremo
			if (
				fechaHastaExtremos.getTime() >
				tarifasOrdenadas[
					tarifasOrdenadas.length - 1
				].fecha_hasta.getTime()
			) {
				errores.push(
					`Hay un hueco en el tipo "${tipo.nombre_tipo_entrada}" entre el ${tarifasOrdenadas[tarifasOrdenadas.length - 1].fecha_hasta.toISOString().split('T')[0]} y el ${fechaHastaExtremos.toISOString().split('T')[0]}. Debe haber al menos una tarifa para cada tipo de entrada en el periodo entre el ${fechaDesdeExtremos.toISOString().split('T')[0]} y el ${fechaHastaExtremos.toISOString().split('T')[0]}`,
				);
			}

			// Verificar huecos entre tarifas para este tipo
			for (let i = 0; i < tarifasOrdenadas.length - 1; i++) {
				const tarifaActual = tarifasOrdenadas[i];
				const tarifaSiguiente = tarifasOrdenadas[i + 1];

				const fechaHastaActual = tarifaActual.fecha_hasta.setDate(
					tarifaActual.fecha_hasta.getDate(),
				);
				const fechaDesdeSiguiente = tarifaSiguiente.fecha_desde.setDate(
					tarifaSiguiente.fecha_desde.getDate() - 1,
				);

				if (fechaHastaActual < fechaDesdeSiguiente) {
					errores.push(
						`Hay un hueco en el tipo "${tipo.nombre_tipo_entrada}" entre ${
							tarifaActual.fecha_hasta.toISOString().split('T')[0]
						} y ${
							tarifaSiguiente.fecha_desde
								.toISOString()
								.split('T')[0]
						}`,
					);
				}
			}
		});

		return errores;
	}
}
