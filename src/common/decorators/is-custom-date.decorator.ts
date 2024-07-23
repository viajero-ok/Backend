import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';

export function IsCustomDate(validationOptions?: ValidationOptions) {
	return function (target: object, propertyName: string) {
		registerDecorator({
			name: 'isCustomDate',
			target: target.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: any): boolean {
					if (typeof value !== 'string') return false;

					// Validar formato DD/MM/YYYY
					const dateFormatRegex =
						/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
					if (!dateFormatRegex.test(value)) return false;

					// Validar que la fecha sea válida
					const [day, month, year] = value.split('/');
					const date = new Date(+year, +month - 1, +day);
					return (
						date.getDate() === +day &&
						date.getMonth() === +month - 1 &&
						date.getFullYear() === +year
					);
				},
				defaultMessage(args: ValidationArguments) {
					return `${args.property} must be a valid date in the format DD/MM/YYYY`;
				},
			},
		});
	};
}
