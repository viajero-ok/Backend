import { Injectable } from '@nestjs/common';
import { UsuarioDto } from './dto/usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
	create(usuarioDto: UsuarioDto) {
		return `This action adds a new usuario , ${usuarioDto}`;
	}

	findAll() {
		return `This action returns all usuarios`;
	}

	findOne(id: number) {
		return `This action returns a #${id} usuario`;
	}

	update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
		return `This action updates a #${id}, ${updateUsuarioDto} usuario`;
	}

	remove(id: number) {
		return `This action removes a #${id} usuario`;
	}
}
