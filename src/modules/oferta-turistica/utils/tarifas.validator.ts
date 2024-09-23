import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { TarifaDto, TarifasDto } from '../alojamientos/dto/tarifa/tarifa.dto';
import { AlojamientosRepositoryService } from '../alojamientos/alojamientos-repository.service';

@Injectable()
@ValidatorConstraint({ name: 'validateTarifas', async: true })
export class TarifasValidator implements ValidatorConstraintInterface {
	constructor(
		private readonly alojamientosRepositoryService: AlojamientosRepositoryService,
	) {}

	async validate(
		value: TarifaDto,
		args: ValidationArguments,
	): Promise<boolean> {
		const tarifaDto = value;
		console.log('TARIFAS');
		console.log(value);
		const errores = await this.validarTarifa(tarifaDto.tarifa);
		args.constraints = errores;
		return errores.length === 0;
	}

	async validarTarifa(tarifaDto: TarifasDto): Promise<string[]> {
		const errores: string[] = [];

		if (tarifaDto.fecha_desde >= tarifaDto.fecha_hasta) {
			errores.push('La fecha desde debe ser anterior a la fecha hasta');
		}

		const tarifasExistentes =
			await this.alojamientosRepositoryService.obtenerTarifas(
				tarifaDto.id_tipo_oferta,
			);

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

	defaultMessage(args: ValidationArguments) {
		return args.constraints?.length > 0
			? args.constraints.join(', ')
			: 'La tarifa no es válida';
	}
}

export function ValidateTarifas(validationOptions?: ValidationOptions) {
	return function (object, propertyName: string) {
		registerDecorator({
			name: 'validateTarifas',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: TarifasValidator,
		});
	};
}
