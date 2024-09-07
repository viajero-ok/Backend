/* eslint-disable @typescript-eslint/ban-types */

import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { AuthRepositoryService } from '../auth-repository.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(private readonly authReposirotyService: AuthRepositoryService) {
		super();
	}

	serializeUser(user: Usuario, done: Function) {
		done(null, user);
	}

	async deserializeUser(payload: any, done: Function) {
		const user = await this.authReposirotyService.obtenerInfoUsuarioPorId(
			payload.id_usuario,
		);
		return user ? done(null, user) : done(null, null);
	}
}
