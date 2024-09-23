import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { CheckInOutDto } from '../alojamientos/dto/alojamiento/horarios.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ name: 'validateCheckInOut', async: false })
export class CheckInOutValidator implements ValidatorConstraintInterface {
	validate(value: CheckInOutDto[], args: ValidationArguments): any {
		const checkInOuts = value;
		const errores = this.validarCheckInOut(checkInOuts);
		args.object['checkInOutErrors'] = errores;
		return errores.length === 0;
	}

	validarCheckInOut(checkInOuts: CheckInOutDto[]): string[] {
		const errores: string[] = [];
		const cantidad_check_in_out = checkInOuts.length;

		if (cantidad_check_in_out === 0) {
			errores.push('Debe haber al menos un horario de check-in/out');
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
		for (const cio of checkInOuts) {
			if (cio.aplica_todos_los_dias) {
				if (cantidad_check_in_out > 1) {
					errores.push(
						'No puede haber más de un horario de check-in/out que aplique para todos los días',
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
								`El día ${day.replace('aplica_', '')} está solapado en múltiples horarios de check-in/out`,
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
		const errors = args.object['checkInOutErrors'];
		return errors.length > 0
			? errors.join(', \n')
			: 'Los horarios de check-in/out no son válidos';
	}
}

export function ValidateCheckInOut(validationOptions?: ValidationOptions) {
	return function (object, propertyName: string) {
		registerDecorator({
			name: 'validateCheckInOut',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: CheckInOutValidator,
		});
	};
}
