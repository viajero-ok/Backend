/* import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oidc';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		@InjectRepository(Usuario)
		private usersRepository: Repository<Usuario>,
	) {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:3000/auth/google/callback',
			scope: ['email', 'profile'],
		});
	}

	async validate(
		issuer: string,
		profile: any,
		done: VerifyCallback,
	): Promise<any> {
		const { id, displayName, emails } = profile;

		// Chequear si el usuario ya está en la base de datos
		let user = await this.usersRepository.findOne({
			where: { TX_MAIL: emails[0].value },
		});

		// Si no existe, crearlo
		if (!user) {
			user = this.usersRepository.create({
				TX_MAIL: emails[0].value,
				TX_NOMBRE: displayName,
			});
			await this.usersRepository.save(user);
		}

		const payload = { id: user.ID_USUARIO };
		done(null, payload);
	}
}
 */
