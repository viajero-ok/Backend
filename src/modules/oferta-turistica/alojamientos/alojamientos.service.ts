import { Injectable } from '@nestjs/common';
import { CreateAlojamientoDto } from './dto/create-alojamiento.dto';
import { UpdateAlojamientoDto } from './dto/update-alojamiento.dto';

@Injectable()
export class AlojamientosService {
	create(createAlojamientoDto: CreateAlojamientoDto) {
		return 'This action adds a new alojamiento';
	}

	findAll() {
		return `This action returns all alojamientos`;
	}

	findOne(id: number) {
		return `This action returns a #${id} alojamiento`;
	}
}
