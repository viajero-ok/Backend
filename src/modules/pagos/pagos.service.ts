import { HttpStatus, Injectable } from '@nestjs/common';
import { PagosRepositoryService } from './pagos-repository.service';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
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

	async solicitarAutorizacionPrestador(id_usuario: string) {
		const app_id = process.env.MERCADO_PAGO_APP_ID;
		const redirect_uri = process.env.REDIRECT_URI;

		const codigoRandom = this.generarCodigoRandomEncriptado();

		const resultado = await this.pagosRepositoryService.guardarCodigoRandom(
			id_usuario,
			codigoRandom,
			Date.now(),
		);

		this.exceptionHandlingService.handleError(
			resultado,
			'Error al guardar el code_verifier',
			HttpStatus.INTERNAL_SERVER_ERROR,
		);

		const authorizationUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${app_id}&response_type=code&platform_id=mp&redirect_uri=${redirect_uri}&state=${codigoRandom}`;

		return authorizationUrl;
	}

	private generarCodigoRandomEncriptado(): string {
		// Generar un código de verificación aleatorio
		const codigoRandom = crypto.randomBytes(32).toString('base64url');
		console.log('codigoRandom', codigoRandom);
		return codigoRandom;
	}

	async oauthCallback(code: string, codigoRandom: string, res: Response) {
		console.log('CODE MP', code);
		console.log('CODIGO RANDOM OAUTH', codigoRandom);

		const datos_usuario_autorizado =
			await this.pagosRepositoryService.obtenerDatosUsuarioAutorizado(
				codigoRandom,
			);

		this.exceptionHandlingService.handleError(
			datos_usuario_autorizado,
			'Error al obtener los datos del usuario autorizado',
			HttpStatus.INTERNAL_SERVER_ERROR,
		);

		const QUINCE_MINUTOS_EN_MS = 15 * 60 * 1000; // 15 minutos en milisegundos
		if (
			Date.now() - datos_usuario_autorizado.fecha_creacion >
			QUINCE_MINUTOS_EN_MS
		) {
			throw new Error('El código random ha expirado');
		}

		const url = 'https://api.mercadopago.com/oauth/token';
		const client_id = process.env.MERCADO_PAGO_APP_ID;
		const client_secret = process.env.MERCADO_PAGO_CLIENT_SECRET;
		const redirect_uri = process.env.FRONT_REDIRECT_URI;

		const body = new URLSearchParams({
			client_id: client_id,
			client_secret: client_secret,
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: `${redirect_uri}`,
			state: uuidv4(),
			test_token: 'true',
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
			const result = await this.pagosRepositoryService.guardarDatosMP(
				datos_usuario_autorizado.id_usuario,
				data.access_token,
				data.public_key,
				data.refresh_token,
				data.live_mode,
				data.user_id,
				data.token_type,
				data.expires_in,
				data.scope,
			);

			this.exceptionHandlingService.handleError(
				result,
				'Error al guardar los datos de Mercado Pago',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);

			return res.redirect(redirect_uri);
		} catch (error) {
			console.error('Error en la solicitud OAuth:', error);
			throw error;
		}
	}
}
