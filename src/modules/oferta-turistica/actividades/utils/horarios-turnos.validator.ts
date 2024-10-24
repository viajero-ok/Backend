import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { HorariosTurnosDto } from '../dto/pestaña-horarios-entradas/horarios.dto';
import { Injectable } from '@nestjs/common';

interface TimeRange {
	start: number;
	end: number;
	index: number; // Cambiamos id_horario por index
}

@Injectable()
@ValidatorConstraint({ name: 'validateHorariosTurnos', async: false })
export class HorariosTurnosValidator implements ValidatorConstraintInterface {
	validate(value: HorariosTurnosDto[], args: ValidationArguments): any {
		const checkInOuts = value;
		const errores = this.validarHorariosTurnos(checkInOuts);
		args.object['horariosTurnosErrors'] = errores;
		return errores.length === 0;
	}

	private convertToMinutes(hours: number, minutes: number): number {
		return hours * 60 + minutes;
	}

	private doTimeRangesOverlap(range1: TimeRange, range2: TimeRange): boolean {
		if (range1.end <= range1.start) {
			range1.end += 24 * 60;
		}
		if (range2.end <= range2.start) {
			range2.end += 24 * 60;
		}

		return range1.start < range2.end && range2.start < range1.end;
	}

	validarHorariosTurnos(horariosTurnosDto: HorariosTurnosDto[]): string[] {
		const errores: string[] = [];
		const cantidad_horarios_turnos = horariosTurnosDto.length;

		if (cantidad_horarios_turnos === 0) {
			errores.push('Debe haber al menos un horario');
			return errores;
		}

		const diasSemana = [
			'aplica_lunes',
			'aplica_martes',
			'aplica_miercoles',
			'aplica_jueves',
			'aplica_viernes',
			'aplica_sabado',
			'aplica_domingo',
		];

		const horariosPorDia: { [key: string]: TimeRange[] } = {};

		for (const dia of diasSemana) {
			horariosPorDia[dia] = [];
		}

		horariosTurnosDto.forEach((horario, index) => {
			if (!horario.check_in || !horario.check_out) {
				errores.push(
					`El horario ${index + 1} debe tener hora de entrada y salida`,
				);
				return;
			}

			const timeRange: TimeRange = {
				start: this.convertToMinutes(
					horario.check_in.hora_check_in,
					horario.check_in.minuto_check_in,
				),
				end: this.convertToMinutes(
					horario.check_out.hora_check_out,
					horario.check_out.minuto_check_out,
				),
				index: index + 1, // Guardamos el índice + 1 para que empiece desde 1 en vez de 0
			};

			if (horario.aplica_todos_los_dias) {
				for (const dia of diasSemana) {
					this.verificarSolapamiento(
						horariosPorDia[dia],
						timeRange,
						dia,
						errores,
					);
					horariosPorDia[dia].push(timeRange);
				}
			} else {
				if (!horario.dias_semana) {
					errores.push(
						'Cuando el horario no aplica para todos los días, se deben especificar los días de la semana',
					);
					return;
				}

				for (const dia of diasSemana) {
					if (horario.dias_semana[dia]) {
						this.verificarSolapamiento(
							horariosPorDia[dia],
							timeRange,
							dia,
							errores,
						);
						horariosPorDia[dia].push(timeRange);
					}
				}
			}
		});

		return errores;
	}

	private verificarSolapamiento(
		horariosExistentes: TimeRange[],
		nuevoHorario: TimeRange,
		dia: string,
		errores: string[],
	): void {
		for (const horarioExistente of horariosExistentes) {
			if (this.doTimeRangesOverlap(horarioExistente, nuevoHorario)) {
				errores.push(
					`Hay un solapamiento de horarios el día ${dia.replace('aplica_', '')} entre el horario ${
						horarioExistente.index
					} y el horario ${nuevoHorario.index}`,
				);
			}
		}
	}

	defaultMessage(args: ValidationArguments) {
		const errors = args.object['horariosTurnosErrors'];
		return errors.length > 0
			? errors.join(', \u000A')
			: 'Los horarios no son válidos';
	}
}

export function ValidateHorariosTurnos(validationOptions?: ValidationOptions) {
	return function (object, propertyName: string) {
		registerDecorator({
			name: 'validateHorariosTurnos',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: HorariosTurnosValidator,
		});
	};
}
