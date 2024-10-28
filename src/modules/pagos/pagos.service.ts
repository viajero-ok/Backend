import { HttpStatus, Injectable } from '@nestjs/common';
import { PagosRepositoryService } from './pagos-repository.service';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { Response } from 'express';
import { ExceptionHandlingService } from 'src/common/services/exception-handler.service';

@Injectable()
export class PagosService {
	constructor(
		private readonly pagosRepositoryService: PagosRepositoryService,
		private readonly exceptionHandlingService: ExceptionHandlingService,
	) {}

	async generarOrden() {
		const client = new MercadoPagoConfig({
			accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
		});

		const preference = new Preference(client);
		const response = await preference.create({
			body: {
				items: [
					{
						id: uuidv4(),
						title: 'Cabañas del Lago',
						unit_price: 100,
						quantity: 1,
						currency_id: 'ARS',
						description: 'Cabañas del Lago',
					},
				],
				back_urls: {
					success: 'http://localhost:8100',
				},
			},
		});

		return response;
	}

	async solicitarAutorizacionPrestador(id_usuario: string, res: Response) {
		/* // Generar el code_verifier
		const codeVerifier = this.generateCodeVerifier();

		// Guardar el code_verifier en la base de datos
		const resultado = await this.pagosRepositoryService.guardarCodeVerifier(
			id_usuario,
			codeVerifier,
		);

		this.exceptionHandlingService.handleError(
			resultado,
			'Error al guardar el code_verifier',
			HttpStatus.INTERNAL_SERVER_ERROR,
		);

		// Generar el code_challenge y code_challenge_method
		const codeChallenge = this.generateCodeChallenge(codeVerifier);
		const codeChallengeMethod = 'S256';

		const app_id = process.env.MERCADO_PAGO_APP_ID;
		const redirect_uri = process.env.REDIRECT_URI;

		const authorizationUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${app_id}&response_type=code&platform_id=mp&redirect_uri=${redirect_uri}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`; */

		const app_id = process.env.MERCADO_PAGO_APP_ID;
		const redirect_uri = process.env.REDIRECT_URI;

		console.log(id_usuario);

		const authorizationUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${app_id}&response_type=code&platform_id=mp&redirect_uri=${redirect_uri}&state=${id_usuario}`;

		return res.redirect(authorizationUrl);
	}

	private generateCodeVerifier(): string {
		// Generar un código de verificación aleatorio que cumpla con los requisitos
		const codeVerifier = crypto.randomBytes(32).toString('base64url');
		console.log('codeVerifier', codeVerifier);
		return codeVerifier;
	}

	private generateCodeChallenge(codeVerifier: string): string {
		// Generar el code_challenge a partir del code_verifier utilizando SHA256 y codificación BASE64URL
		const codeChallenge = Buffer.from(
			crypto.createHash('sha256').update(codeVerifier).digest(),
		).toString('base64url');
		console.log('codeChallenge', codeChallenge);
		return codeChallenge;
	}

	async oauthCallback(code: string, id_usuario: string) {
		console.log('CODE OAUTH', code);
		console.log('ID_USUARIO OAUTH', id_usuario);
		/* const url = 'https://api.mercadopago.com/oauth/token';
		const clientId = process.env.MERCADO_PAGO_APP_ID;
		const clientSecret = process.env.MERCADO_PAGO_CLIENT_SECRET;
		const redirectUri = process.env.REDIRECT_URI + '/' + id_usuario;

		const body = new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: `${redirectUri}`,
			state: uuidv4(), // Generamos un ID aleatorio usando uuid
		});

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'content-type': 'application/x-www-form-urlencoded',
				},
				body: body,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log('DATA', data);
			return data;
		} catch (error) {
			console.error('Error en la solicitud OAuth:', error);
			throw error;
		} */
	}
}
