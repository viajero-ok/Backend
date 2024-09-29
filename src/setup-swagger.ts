import { INestApplication } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
import {
	DocumentBuilder,
	SwaggerDocumentOptions,
	SwaggerModule,
} from '@nestjs/swagger';
import { AuthModule } from './modules/auth/auth.module';
import { OfertaTuristicaModule } from './modules/oferta-turistica/oferta-turistica.module';
import { AlojamientosModule } from './modules/oferta-turistica/alojamientos/alojamientos.module';
import { EventosModule } from './modules/oferta-turistica/eventos/eventos.module';
import { ActividadesModule } from './modules/oferta-turistica/actividades/actividades.module';
import { EstablecimientosModule } from './modules/oferta-turistica/establecimientos/establecimientos.module';
import { UbicacionesModule } from './modules/tipificados/ubicaciones/ubicaciones.module';

/**
 * Sets up password-protected swagger documentation for the application
 */
export const setupSwagger = (app: INestApplication) => {
	const swaggerPassword = process.env.SWAGGER_PASSWORD;

	// Note: It's important that this comes BEFORE calling SwaggerModule.setup()

	app.use(
		['/api/docs', '/api/docs-json'],
		basicAuth({
			challenge: true,
			users: {
				admin: swaggerPassword,
			},
		}),
	);

	//Documentación de swagger
	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('Documentación Viajero API')
		.setVersion('1.0')
		.build();
	const options: SwaggerDocumentOptions = {
		include: [
			AuthModule,
			OfertaTuristicaModule,
			AlojamientosModule,
			EventosModule,
			ActividadesModule,
			EstablecimientosModule,
			UbicacionesModule,
			AlojamientosModule,
		],
		extraModels: [],
	};
	const document = SwaggerModule.createDocument(app, config, options);

	// Define el esquema general de respuestas en Swagger
	document.components.schemas.GeneralResponse = {
		type: 'object',
		properties: {
			message: {
				type: 'string',
				example: 'mensaje',
				description: 'Mensaje de la respuesta',
			},
			statusCode: {
				type: 'integer',
				example: 400,
				description: 'Código de estado HTTP',
			},
		},
	};

	SwaggerModule.setup('api/docs', app, document, {
		swaggerOptions: {
			docExpansion: 'none',
		},
	});
};
