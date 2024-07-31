import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { AlojamientosService } from './alojamientos.service';
import { CreateAlojamientoDto } from './dto/create-alojamiento.dto';
import { UpdateAlojamientoDto } from './dto/update-alojamiento.dto';

@Controller('alojamientos')
export class AlojamientosController {
	constructor(private readonly alojamientosService: AlojamientosService) {}

	@Post()
	create(@Body() createAlojamientoDto: CreateAlojamientoDto) {
		return this.alojamientosService.create(createAlojamientoDto);
	}

	@Get()
	findAll() {
		return this.alojamientosService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.alojamientosService.findOne(+id);
	}
}
