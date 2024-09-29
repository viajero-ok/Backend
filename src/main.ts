import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthorizationGuard } from './common/guards/authorization/authorization.guard'; // Import the AuthorizationGuard
import { GlobalJwtGuard } from './common/guards/jwt/global-jwt.guard';
import { JwtRefreshInterceptor } from './common/interceptors/jwt-refresh/jwt-refresh.interceptor';
import { JwtService } from '@nestjs/jwt';
import { TimeOutInterceptor } from './common/interceptors/time-out/time-out.interceptor';
import * as session from 'express-session';
import * as passport from 'passport';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		credentials: true,
	});

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

	//Configuración de la sesión
	//(app as any).set('trust proxy', 1);
	app.use(
		session({
			secret: process.env.SESSION_SECRET,
			resave: false,
			saveUninitialized: false,
			cookie: { maxAge: 86400000 }, // 1 dia 86400000
		}),
	);
	//Inicializar passport
	app.use(passport.initialize());
	app.use(passport.session());

	setupSwagger(app);

	//Iniciar la aplicación
	const PORT = process.env.PORT || 3000;
	await app.listen(PORT);
}
bootstrap();
