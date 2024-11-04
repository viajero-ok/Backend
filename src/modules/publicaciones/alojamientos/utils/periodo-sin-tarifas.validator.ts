import { Injectable } from '@nestjs/common';
import { ActualizarTarifasDto } from '../dto/actualizar-tarifa.dto';

interface TipoHabitacion {
	id_tipo_detalle: string;
	nombre_tipo_detalle: string;
	descripcion_tipo_detalle: string;
}

@Injectable()
export class PeriodoSinTarifasValidator {
	async validarPeriodoSinTarifas(
		tarifasExistentes: ActualizarTarifasDto[],
		tipos_detalles: TipoHabitacion[],
	): Promise<string[]> {
		const errores: string[] = [];

		if (tarifasExistentes.length === 0) {
			errores.push(
				`No hay tarifas registradas para ningún tipo de habitación`,
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

		// Agrupar tarifas por tipo de habitación
		const tarifasPorTipo = new Map<string, ActualizarTarifasDto[]>();

		// Inicializar el Map con arrays vacíos para cada tipo de habitación
		tipos_detalles.forEach((tipo) => {
			tarifasPorTipo.set(tipo.id_tipo_detalle, []);
		});

		// Agrupar las tarifas existentes por tipo de habitación
		tarifasExistentes.forEach((tarifa) => {
			const tarifasDelTipo =
				tarifasPorTipo.get(tarifa.id_tipo_detalle) || [];
			tarifasDelTipo.push(tarifa);
			tarifasPorTipo.set(tarifa.id_tipo_detalle, tarifasDelTipo);
		});

		// Validar cada tipo de habitación
		tipos_detalles.forEach((tipo) => {
			const tarifasDelTipo =
				tarifasPorTipo.get(tipo.id_tipo_detalle) || [];

			// Validar que el tipo de habitación tenga al menos una tarifa
			if (tarifasDelTipo.length === 0) {
				errores.push(
					`El tipo de habitación "${tipo.nombre_tipo_detalle}" no tiene tarifas asignadas`,
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
					`Hay un hueco en la tipología "${tipo.nombre_tipo_detalle}" entre el ${fechaDesdeExtremos.toISOString().split('T')[0]} y el ${tarifasOrdenadas[0].fecha_desde.toISOString().split('T')[0]}. Debe haber al menos una tarifa para cada tipología en el periodo entre el ${fechaDesdeExtremos.toISOString().split('T')[0]} y el ${fechaHastaExtremos.toISOString().split('T')[0]}`,
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
					`Hay un hueco en la tipología "${tipo.nombre_tipo_detalle}" entre el ${tarifasOrdenadas[tarifasOrdenadas.length - 1].fecha_hasta.toISOString().split('T')[0]} y el ${fechaHastaExtremos.toISOString().split('T')[0]}. Debe haber al menos una tarifa para cada tipología en el periodo entre el ${fechaDesdeExtremos.toISOString().split('T')[0]} y el ${fechaHastaExtremos.toISOString().split('T')[0]}`,
				);
			}

			// Verificar huecos entre tarifas para este tipo
			for (let i = 0; i < tarifasOrdenadas.length - 1; i++) {
				const tarifaActual = tarifasOrdenadas[i];
				const tarifaSiguiente = tarifasOrdenadas[i + 1];
				console.log('TARIFA ACTUAL', tarifaActual);
				console.log('TARIFA SIGUIENTE', tarifaSiguiente);

				const fechaHastaActual = tarifaActual.fecha_hasta.setDate(
					tarifaActual.fecha_hasta.getDate(),
				);
				const fechaDesdeSiguiente = tarifaSiguiente.fecha_desde.setDate(
					tarifaSiguiente.fecha_desde.getDate() - 1,
				);
				console.log('FECHA HASTA ACTUAL', fechaHastaActual);
				console.log('FECHA DESDE SIGUIENTE', fechaDesdeSiguiente);

				if (fechaHastaActual < fechaDesdeSiguiente) {
					errores.push(
						`Hay un hueco en la tipología "${tipo.nombre_tipo_detalle}" entre ${
							tarifaActual.fecha_hasta.toISOString().split('T')[0]
						} y ${
							tarifaSiguiente.fecha_desde
								.toISOString()
								.split('T')[0]
						}`,
					);
					console.log('ERRORES', errores);
				}
			}
		});

		return errores;
	}
}
