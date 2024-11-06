import { HttpStatus, Injectable } from '@nestjs/common';
import { PagosRepositoryService } from './pagos-repository.service';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
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

	async generarOrden(id_reserva: string) {
		const datos_preferencia =
			await this.pagosRepositoryService.obtenerDatosPreferencia(
				id_reserva,
			);
		console.log('DATOS PREFERENCIA', datos_preferencia);

		this.exceptionHandlingService.handleError(
			datos_preferencia,
			'Error al obtener los datos de la preferencia',
			HttpStatus.INTERNAL_SERVER_ERROR,
		);

		const client = new MercadoPagoConfig({
			accessToken: datos_preferencia.access_token,
		});

		const preference = new Preference(client);
		const response = await preference.create({
			body: {
				items: datos_preferencia.items.map((item) => ({
					id: uuidv4(),
					title: item.titulo,
					description: item.descripcion,
					unit_price: parseFloat(item.precio_unitario),
					quantity: item.cantidad,
					currency_id: 'ARS',
				})),
				back_urls: {
					success: process.env.SUCCESS_URL,
					failure: process.env.FAILURE_URL,
				},
				expires: true,
				expiration_date_from: new Date(Date.now()).toISOString(),
				expiration_date_to: new Date(
					Date.now() + 1000 * 60 * 60 * 24, // 24 horas para realizar el pago
				).toISOString(),
				/* marketplace_fee: datos_preferencia.marketplace_fee, */
				statement_descriptor: 'viajero',
				marketplace: 'viajero',
				notification_url: `${process.env.NOTIFICATION_URL}`,
				external_reference: uuidv4(),
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

		return { url: authorizationUrl };
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

		const url = 'https://api.mercadopago.com/oauth/token';
		const client_id = process.env.MERCADO_PAGO_APP_ID;
		const client_secret = process.env.MERCADO_PAGO_CLIENT_SECRET;
		const redirect_uri = process.env.REDIRECT_URI;
		const redirect_uri_front = process.env.FRONT_REDIRECT_URI;

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
			return res.redirect(redirect_uri_front);
		}

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
				console.log(response);
				const errorData = await response.json();
				console.log('Error detallado:', errorData);
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log('DATA', data);
			console.log('EXPIRES IN', data.expires_in + new Date().getTime());
			const result = await this.pagosRepositoryService.guardarDatosMP(
				datos_usuario_autorizado.id_usuario,
				data.access_token,
				data.public_key,
				data.refresh_token,
				data.live_mode,
				data.user_id,
				data.token_type,
				data.expires_in * 1000 + new Date().getTime(),
				data.scope,
			);

			this.exceptionHandlingService.handleError(
				result,
				'Error al guardar los datos de Mercado Pago',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);

			return res.redirect(redirect_uri_front);
		} catch (error) {
			console.error('Error en la solicitud OAuth:', error);
			throw error;
		}
	}

	async notification(req) {
		console.log('REQUEST QUERY', req.query);

		// Determinar el tipo de notificación
		if (req.query.type === 'payment') {
			console.log('PAYMENT NOTIFICATION');
			console.log('REQUEST QUERY DATA', req.query.data);
			const id_pago = req.query.data.id;
			console.log('ID PAGO', id_pago);
			const client = new MercadoPagoConfig({
				accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
			});
			const payment = new Payment(client);
			const response = await payment.get(id_pago);
			console.log('PAYMENT RESPONSE', response);
		} else if (req.query.type === 'merchant_order') {
			console.log('MERCHANT ORDER NOTIFICATION');
			const merchant_order_id = req.query.data.id;
			// Aquí puedes agregar la lógica para manejar merchant_orders
			console.log('MERCHANT ORDER ID', merchant_order_id);
		}
	}

	async externalReference(external_reference: string) {
		console.log('EXTERNAL REFERENCE', external_reference);
		const client = new MercadoPagoConfig({
			accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
		});
		const payment = new Payment(client);
		const response = await payment.search({
			options: {
				external_reference: external_reference,
			},
		});
		console.log('RESPONSE', response);
	}
}
