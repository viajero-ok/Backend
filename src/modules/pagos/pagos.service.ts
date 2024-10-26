import { Injectable } from '@nestjs/common';
import { PagosRepositoryService } from './pagos-repository.service';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PagosService {
	constructor(
		private readonly pagosRepositoryService: PagosRepositoryService,
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

	async solicitarAutorizacionPrestador(req) {
		const appId = process.env.MERCADO_PAGO_APP_ID;
		const redirectUri =
			process.env.REDIRECT_URI + '/' + req.user.id_usuario;
		return {
			url: `https://auth.mercadopago.com.ar/authorization?client_id=${appId}&response_type=code&platform_id=mp&redirect_uri=${redirectUri}`,
		};
	}

	async oauthCallback(code: string) {
		const url = 'https://api.mercadopago.com/oauth/token';
		const clientId = process.env.MERCADO_PAGO_APP_ID;
		const clientSecret = process.env.MERCADO_PAGO_CLIENT_SECRET;
		const redirectUri = process.env.REDIRECT_URI;

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
		}
	}
}
