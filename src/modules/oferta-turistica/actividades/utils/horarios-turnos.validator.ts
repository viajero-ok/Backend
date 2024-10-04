import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { HorariosTurnosDto } from '../dto/pestaña-tarifas/horarios.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ name: 'validateHorariosTurnos', async: false })
export class HorariosTurnosValidator implements ValidatorConstraintInterface {
	validate(value: HorariosTurnosDto[], args: ValidationArguments): any {
		const checkInOuts = value;
		const errores = this.validarHorariosTurnos(checkInOuts);
		args.object['horariosTurnosErrors'] = errores;
		return errores.length === 0;
	}

	validarHorariosTurnos(horariosTurnosDto: HorariosTurnosDto[]): string[] {
		const errores: string[] = [];
		const cantidad_horarios_turnos = horariosTurnosDto.length;

		if (cantidad_horarios_turnos === 0) {
			errores.push('Debe haber al menos un horario');
			return errores;
		}
		const daysMap = new Map();
		const diasSemana = [
			'aplica_lunes',
			'aplica_martes',
			'aplica_miercoles',
			'aplica_jueves',
			'aplica_viernes',
			'aplica_sabado',
			'aplica_domingo',
		];
		for (const cio of horariosTurnosDto) {
			if (cio.aplica_todos_los_dias) {
				if (cantidad_horarios_turnos > 1) {
					errores.push(
						'No puede haber más de un horario que aplique para todos los días',
					);
				}
			} else {
				if (!cio.dias_semana) {
					errores.push(
						'Cuando el horario no aplica para todos los días, se deben especificar los días de la semana',
					);
				}
				for (const day of diasSemana) {
					if (cio.dias_semana[day]) {
						if (daysMap.has(day)) {
							errores.push(
								`El día ${day.replace('aplica_', '')} está solapado en múltiples horarios`,
							);
						}
						daysMap.set(day, true);
					}
				}
			}
		}
		return errores;
	}

	defaultMessage(args: ValidationArguments) {
		const errors = args.object['horariosTurnosErrors'];
		return errors.length > 0
			? errors.join(', \n')
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
