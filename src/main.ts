import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthorizationGuard } from './common/guards/authorization/authorization.guard'; // Import the AuthorizationGuard
import { GlobalJwtGuard } from './common/guards/jwt/global-jwt.guard';
import { JwtRefreshInterceptor } from './common/interceptors/jwt-refresh/jwt-refresh.interceptor';
import { JwtService } from '@nestjs/jwt';
import { TimeOutInterceptor } from './common/interceptors/time-out/time-out.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });

	//Prefijo de las rutas
	app.setGlobalPrefix('api');

	//Validación de los datos de entrada
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	// Aplicar el AuthorizationGuard y GlobalJwtGuard de forma global
	const authorizationGuard = app.get(AuthorizationGuard);
	const globalJwtGuard = app.get(GlobalJwtGuard);
	app.useGlobalGuards(globalJwtGuard, authorizationGuard);

	// Aplicar el JwtRefreshInterceptor de forma global
	const jwtService = app.get(JwtService);
	const jwtRefreshInterceptor = new JwtRefreshInterceptor(jwtService);
	app.useGlobalInterceptors(jwtRefreshInterceptor, new TimeOutInterceptor());

	//Versionamiento de la API
	app.enableVersioning({
		defaultVersion: '1',
		type: VersioningType.URI,
	});

	//Documentación de swagger
	const config = new DocumentBuilder()
		.addBearerAuth()
		.setTitle('Documentación Viajero API')
		.setVersion('1.0')
		.addTag('auth')
		.addTag('usuarios')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document);

	//Iniciar la aplicación
	const PORT = process.env.PORT || 3000;
	await app.listen(PORT);
}
bootstrap();
