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

	async solicitarAutorizacionPrestador() {
		const appId = process.env.MERCADO_PAGO_APP_ID;
		const redirectUri = process.env.REDIRECT_URI;
		return {
			url: `https://auth.mercadopago.com.ar/authorization?client_id=${appId}&response_type=code&platform_id=mp&redirect_uri=${redirectUri}`,
		};
	}
}
