import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthRepositoryService } from '../auth-repository.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		private readonly authRepositoryService: AuthRepositoryService,
		private readonly authService: AuthService,
	) {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_REDIRECT_URI,
			scope: ['profile', 'email'],
		});
	}

	authorizationParams(): object {
		return {
			access_type: 'offline',
			//prompt: 'consent',
		};
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: VerifyCallback,
	) {
		/* const user = await this.authRepositoryService.buscarUsuarioPorMail(
			profile.emails[0].value,
		);
		console.log(user); */
		/* const { name, emails } = profile;
		const user = {
			mail: emails[0].value,
			nombre: name.givenName,
			apellido: name.familyName,
			accessToken,
		}; */
		const user = await this.authService.googleStrategyLogin(profile);
		done(null, user);
		return user || null;
	}
}
