import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsConfig: CorsOptions = {
	origin: function (
		origin: string,
		callback: (error: Error | null, allow?: boolean) => void,
	) {
		const allowedDomains = [
			// Dominios estáticos
			'https://viajeroturismo.me',
			'http://localhost:3000',
			'http://localhost:5173',

			// MercadoPago
			'https://www.mercadopago.com.ar',
			'https://api.mercadopago.com',
			'https://checkout.mercadopago.com.ar',
			'https://api.mercadolibre.com',

			// Google
			'https://accounts.google.com',
			'https://apis.google.com',
			'https://www.googleapis.com',
		];

		// Patrones para dominios dinámicos
		const allowedPatterns = [
			/^https:\/\/([a-zA-Z0-9-]+\.)*viajeroturismo\.com\.ar$/,
			/^https:\/\/([a-zA-Z0-9-]+\.)*mercadopago\.(com|com\.ar)$/,
			/^https:\/\/([a-zA-Z0-9-]+\.)*google\.(com|com\.ar)$/,
		];

		// Permitir solicitudes sin origin (como aplicaciones móviles o Postman)
		if (!origin) {
			callback(null, true);
			return;
		}

		// Verificar dominios estáticos
		if (allowedDomains.includes(origin)) {
			callback(null, true);
			return;
		}

		// Verificar patrones de dominio
		if (allowedPatterns.some((pattern) => pattern.test(origin))) {
			callback(null, true);
			return;
		}

		// En desarrollo, permitir localhost
		if (
			process.env.NODE_ENV === 'development' &&
			/^http:\/\/localhost:[0-9]+$/.test(origin)
		) {
			callback(null, true);
			return;
		}

		// Si no coincide con ninguno, denegar
		callback(new Error('No permitido por CORS'));
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: [
		'Origin',
		'X-Requested-With',
		'Content-Type',
		'Accept',
		'Authorization',
		'x-csrf-token',
		'x-mp-access-token',
		'x-idempotency-key',
		'x-client-id',
		'x-client-secret',
	],
	exposedHeaders: [
		'Content-Disposition',
		'X-RateLimit-Limit',
		'X-RateLimit-Remaining',
	],
	credentials: true,
	maxAge: 3600,
	preflightContinue: false,
};
