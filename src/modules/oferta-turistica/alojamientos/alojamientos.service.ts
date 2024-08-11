import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlojamientoDto } from './dto/create-alojamiento.dto';
import { UpdateAlojamientoDto } from './dto/update-alojamiento.dto';
import { EstablecimientoDto } from './dto/establecimiento.dto';
import { AlojamientosRepositoryService } from './alojamientos-repository.service';

@Injectable()
export class AlojamientosService {
	constructor(private readonly alojamientosRepositoryService: AlojamientosRepositoryService){}
	async registrarEstablecimiento(establecimientoDto: EstablecimientoDto) {
		console.log(establecimientoDto);
		/* const result = await this.alojamientosRepositoryService.registrarEstablecimiento(establecimientoDto);
		if (result.resultado == 'error') {
			throw new HttpException(
				'Error al registrar establecimiento',
				HttpStatus.CONFLICT,
			);
		} */
		return {
			resultado: 'ok',
			statusCode: 201,
		};
	}
}
