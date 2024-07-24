import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthRepositoryService } from '../auth-repository.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authRepositoryService: AuthRepositoryService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: { id: string }) {
		// PARA HACER: Implementar un SP para obtener la información del usuario
		const user = await this.authRepositoryService.findOneUserById(
			payload.id,
		);
		//borrar la contraseña del objeto
		user.TX_CONTRASENIA = undefined;
		return user;
	}
}
