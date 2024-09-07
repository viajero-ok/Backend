import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'validateCheckInOut', async: false })
export class CheckInOutValidator implements ValidatorConstraintInterface {
	validate(value: any[], args: ValidationArguments) {
		const politicasYNormas = args.object as any;
		const checkInOuts = value;

		if (politicasYNormas.aplica_todos_los_dias) {
			if (checkInOuts.length !== 1) {
				args.constraints = [
					'Cuando el horario aplica para todos los días, solo debe haber un horario de check-in/out',
				];
				return false;
			}
			return true;
		} else {
			const daysMap = new Map();
			for (const cio of checkInOuts) {
				for (const [day, applies] of Object.entries(cio.dias_semana)) {
					if (applies && daysMap.has(day)) {
						args.constraints = [
							`El día ${day} está solapado en múltiples horarios de check-in/out`,
						];
						return false;
					}
					if (applies) {
						daysMap.set(day, true);
					}
				}
			}
			return true;
		}
	}

	defaultMessage(args: ValidationArguments) {
		return args.constraints[0];
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
